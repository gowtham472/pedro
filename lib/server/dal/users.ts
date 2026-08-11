import "server-only";

import { FieldValue } from "firebase-admin/firestore";

import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { UserProfile, UserRole } from "@/types/entities";
import { notFound } from "@/lib/server/apiError";
import { deleteAttemptsForUser } from "./attempts";
import {
  deleteEventsForUser,
  deleteGazeSummariesForUser,
  deleteInteractionSummariesForUser,
} from "./telemetry";
import { deleteReflectionsForUser } from "./reflections";
import { deleteDomainScoresForUser, deleteReportForUser } from "./scoring";
import { deleteJourneyForUser } from "./journey";
import { deleteConsentForUser } from "./consent";

const USERS = "users";

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const doc = await adminDb.collection(USERS).doc(uid).get();
  return doc.exists ? (doc.data() as UserProfile) : null;
}

export async function requireUserProfile(uid: string): Promise<UserProfile> {
  const profile = await getUserProfile(uid);
  if (!profile) throw notFound("User profile");
  return profile;
}

/** Idempotent create-if-missing, called whenever a session is established. */
export async function ensureUserProfile(
  uid: string,
  data: { email: string; name: string; timezone: string; role: UserRole }
): Promise<UserProfile> {
  const ref = adminDb.collection(USERS).doc(uid);
  const existing = await ref.get();

  if (existing.exists) {
    // Keep email in sync (it can change), but don't clobber user-editable fields.
    await ref.set({ email: data.email }, { merge: true });
    return existing.data() as UserProfile;
  }

  const profile: UserProfile = {
    uid,
    email: data.email,
    name: data.name,
    createdAt: new Date().toISOString(),
    timezone: data.timezone,
    status: "active",
    role: data.role,
    onboardingCompleted: false,
    reminderOptIn: true,
    xp: 0,
  };
  await ref.set(profile);
  return profile;
}

export async function incrementUserXp(uid: string, points: number): Promise<void> {
  await adminDb
    .collection(USERS)
    .doc(uid)
    .set({ xp: FieldValue.increment(points) }, { merge: true });
}

export async function setUserRole(uid: string, role: UserRole): Promise<void> {
  await adminDb.collection(USERS).doc(uid).set({ role }, { merge: true });
}

/** Updates both the Firestore role field (for display) and the Firebase Auth
 * custom claim (the actual authorization source of truth checked by
 * withAuth). The target user's current session won't see the change until
 * their ID token refreshes. */
export async function setUserRoleAndClaim(uid: string, role: UserRole): Promise<void> {
  await Promise.all([adminAuth.setCustomUserClaims(uid, { admin: role === "admin" }), setUserRole(uid, role)]);
}

export async function updateUserProfile(
  uid: string,
  patch: Partial<Pick<UserProfile, "name" | "timezone" | "reminderOptIn">>
): Promise<void> {
  await adminDb.collection(USERS).doc(uid).set(patch, { merge: true });
}

export async function completeOnboarding(
  uid: string,
  baseline: UserProfile["baseline"]
): Promise<void> {
  await adminDb
    .collection(USERS)
    .doc(uid)
    .set({ onboardingCompleted: true, baseline }, { merge: true });
}

export async function listUsersForAdmin(
  limitCount = 50
): Promise<Pick<UserProfile, "uid" | "email" | "name" | "createdAt" | "status" | "role" | "onboardingCompleted">[]> {
  const snap = await adminDb
    .collection(USERS)
    .orderBy("createdAt", "desc")
    .limit(limitCount)
    .get();
  return snap.docs.map((d) => {
    const u = d.data() as UserProfile;
    return {
      uid: u.uid,
      email: u.email,
      name: u.name,
      createdAt: u.createdAt,
      status: u.status,
      role: u.role,
      onboardingCompleted: u.onboardingCompleted,
    };
  });
}

// --- Account deletion ----------------------------------------------------

/**
 * Cascades a full account deletion across every Firestore collection that
 * references this user, then deletes the Firebase Auth account itself.
 * Aggregated domainScores/reports (already de-identified summaries) are
 * removed too - Pedro keeps no data once an account is deleted.
 */
export async function deleteUserCascade(uid: string): Promise<void> {
  await Promise.all([
    deleteAttemptsForUser(uid),
    deleteEventsForUser(uid),
    deleteInteractionSummariesForUser(uid),
    deleteGazeSummariesForUser(uid),
    deleteReflectionsForUser(uid),
    deleteDomainScoresForUser(uid),
    deleteReportForUser(uid),
    deleteJourneyForUser(uid),
    deleteConsentForUser(uid),
    adminDb.collection(USERS).doc(uid).delete(),
  ]);

  try {
    await adminAuth.deleteUser(uid);
  } catch (err) {
    // If the auth user is already gone (e.g. retried request), don't fail
    // the whole cascade - the Firestore data is already cleaned up.
    console.warn("[deleteUserCascade] auth deleteUser failed", err);
  }
}
