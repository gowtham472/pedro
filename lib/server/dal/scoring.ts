import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import type { CareerReport, DomainId, DomainScore, ScoringWeights } from "@/types/entities";
import { DEFAULT_SCORING_WEIGHTS } from "@/lib/server/scoring/defaults";

export { DEFAULT_SCORING_WEIGHTS };

const DOMAIN_SCORES = "domainScores";
const SCORING_CONFIG = "scoringConfig";
const REPORTS = "reports";

function scoreDocId(uid: string, domainId: string) {
  return `${uid}_${domainId}`;
}

export async function upsertDomainScore(score: DomainScore): Promise<void> {
  await adminDb
    .collection(DOMAIN_SCORES)
    .doc(scoreDocId(score.userId, score.domainId))
    .set(score);
}

export async function getDomainScore(uid: string, domainId: DomainId): Promise<DomainScore | null> {
  const doc = await adminDb.collection(DOMAIN_SCORES).doc(scoreDocId(uid, domainId)).get();
  return doc.exists ? (doc.data() as DomainScore) : null;
}

export async function listDomainScoresForUser(uid: string): Promise<DomainScore[]> {
  const snap = await adminDb.collection(DOMAIN_SCORES).where("userId", "==", uid).get();
  return snap.docs.map((d) => d.data() as DomainScore);
}

export async function deleteDomainScoresForUser(uid: string): Promise<void> {
  const snap = await adminDb.collection(DOMAIN_SCORES).where("userId", "==", uid).get();
  const batch = adminDb.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  if (!snap.empty) await batch.commit();
}

export async function getScoringWeights(): Promise<ScoringWeights> {
  const doc = await adminDb.collection(SCORING_CONFIG).doc("global").get();
  return doc.exists ? (doc.data() as ScoringWeights) : DEFAULT_SCORING_WEIGHTS;
}

export async function setScoringWeights(
  weights: Pick<ScoringWeights, "performance" | "learningVelocity" | "engagement" | "preference">,
  updatedBy: string
): Promise<ScoringWeights> {
  const next: ScoringWeights = { ...weights, updatedAt: new Date().toISOString(), updatedBy };
  await adminDb.collection(SCORING_CONFIG).doc("global").set(next);
  return next;
}

export async function getReport(uid: string): Promise<CareerReport | null> {
  const doc = await adminDb.collection(REPORTS).doc(uid).get();
  return doc.exists ? (doc.data() as CareerReport) : null;
}

export async function upsertReport(report: CareerReport): Promise<void> {
  await adminDb.collection(REPORTS).doc(report.userId).set(report);
}

export async function setReportQualityRating(
  uid: string,
  rating: { accurate: number; helpful: number }
): Promise<void> {
  await adminDb
    .collection(REPORTS)
    .doc(uid)
    .set({ qualityRating: { ...rating, ratedAt: new Date().toISOString() } }, { merge: true });
}

export async function deleteReportForUser(uid: string): Promise<void> {
  await adminDb.collection(REPORTS).doc(uid).delete();
}
