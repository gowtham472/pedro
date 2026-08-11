import "server-only";

import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export const SESSION_COOKIE = "pedro_session";

export interface AuthContext {
  uid: string;
  email: string | null;
  admin: boolean;
}

function extractToken(req: NextRequest): string | undefined {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  return req.cookies.get(SESSION_COOKIE)?.value;
}

/**
 * Verifies the caller's Firebase ID token (from the Authorization header, or
 * falling back to the httpOnly session cookie) and returns their identity.
 * This is the ONLY place request authentication happens - every Route
 * Handler that touches Firestore goes through this via withAuth().
 */
export async function verifyRequest(req: NextRequest): Promise<AuthContext | null> {
  const token = extractToken(req);
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      admin: decoded.admin === true,
    };
  } catch {
    return null;
  }
}
