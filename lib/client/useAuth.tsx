"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { onIdTokenChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { api } from "./api";
import type { UserProfile } from "@/types/entities";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

async function postSession(idToken: string) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return api.post<{ profile: UserProfile; claimsChanged: boolean }>("/api/auth/session", {
    idToken,
    timezone,
  });
}

// Login/register must await this BEFORE navigating to a protected route:
// proxy.ts redirects on cookie presence, and the onIdTokenChanged listener
// sets the cookie asynchronously - navigating first loses the race and
// bounces the user to /login -> /dashboard.
// forceRefresh: pass true right after updateProfile() so the token (and the
// server-side profile created from it) carries the new displayName.
export async function establishSession(firebaseUser: User, forceRefresh = false): Promise<void> {
  await postSession(await firebaseUser.getIdToken(forceRefresh));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const syncingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
        fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
        return;
      }

      if (syncingRef.current) return;
      syncingRef.current = true;
      try {
        const idToken = await firebaseUser.getIdToken();
        const { profile: syncedProfile, claimsChanged } = await postSession(idToken);
        setProfile(syncedProfile);

        if (claimsChanged) {
          // The admin claim was just granted server-side; force a fresh
          // token so this session (and subsequent API calls) actually
          // carry it, then resync the cookie with that fresh token.
          const freshToken = await firebaseUser.getIdToken(true);
          await postSession(freshToken);
        }
      } catch (err) {
        console.error("Session sync failed", err);
      } finally {
        syncingRef.current = false;
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const { profile: fresh } = await api.get<{ profile: UserProfile }>("/api/profile");
      setProfile(fresh);
    } catch (err) {
      console.error("Failed to refresh profile", err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, isAdmin: profile?.role === "admin", signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
