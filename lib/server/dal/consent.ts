import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import type { ConsentRecord } from "@/types/entities";

const CONSENT = "consent";

const DEFAULT_CONSENT: Omit<ConsentRecord, "userId" | "history"> = {
  analyticsConsent: false,
  interactionConsent: false,
  gazeConsent: false,
  researchConsent: false,
  updatedAt: new Date(0).toISOString(),
};

export async function getConsent(uid: string): Promise<ConsentRecord> {
  const doc = await adminDb.collection(CONSENT).doc(uid).get();
  if (!doc.exists) {
    return { userId: uid, history: [], ...DEFAULT_CONSENT };
  }
  return doc.data() as ConsentRecord;
}

export async function upsertConsent(
  uid: string,
  patch: Partial<
    Pick<ConsentRecord, "analyticsConsent" | "interactionConsent" | "gazeConsent" | "researchConsent">
  >
): Promise<ConsentRecord> {
  const current = await getConsent(uid);
  const snapshot = {
    analyticsConsent: current.analyticsConsent,
    interactionConsent: current.interactionConsent,
    gazeConsent: current.gazeConsent,
    researchConsent: current.researchConsent,
    updatedAt: current.updatedAt,
  };
  const next: ConsentRecord = {
    userId: uid,
    analyticsConsent: patch.analyticsConsent ?? current.analyticsConsent,
    interactionConsent: patch.interactionConsent ?? current.interactionConsent,
    gazeConsent: patch.gazeConsent ?? current.gazeConsent,
    researchConsent: patch.researchConsent ?? current.researchConsent,
    updatedAt: new Date().toISOString(),
    history: [...(current.history ?? []), { changedAt: new Date().toISOString(), snapshot }].slice(-25),
  };
  await adminDb.collection(CONSENT).doc(uid).set(next);
  return next;
}

export async function deleteConsentForUser(uid: string): Promise<void> {
  await adminDb.collection(CONSENT).doc(uid).delete();
}
