import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import type { AttemptStatus, DomainId, EvaluationDetail, TaskAttempt, XpAward } from "@/types/entities";
import { notFound } from "@/lib/server/apiError";
import { batchDeleteByField } from "./_batch";

const ATTEMPTS = "taskAttempts";

export async function listAttemptsForUserTask(uid: string, taskId: string): Promise<TaskAttempt[]> {
  const snap = await adminDb
    .collection(ATTEMPTS)
    .where("userId", "==", uid)
    .where("taskId", "==", taskId)
    .get();
  return snap.docs
    .map((d) => d.data() as TaskAttempt)
    .sort((a, b) => a.attemptNumber - b.attemptNumber);
}

export async function getLatestAttempt(uid: string, taskId: string): Promise<TaskAttempt | null> {
  const attempts = await listAttemptsForUserTask(uid, taskId);
  return attempts.length ? attempts[attempts.length - 1] : null;
}

export async function getAttempt(id: string): Promise<TaskAttempt | null> {
  const doc = await adminDb.collection(ATTEMPTS).doc(id).get();
  return doc.exists ? (doc.data() as TaskAttempt) : null;
}

export async function requireOwnedAttempt(id: string, uid: string): Promise<TaskAttempt> {
  const attempt = await getAttempt(id);
  if (!attempt || attempt.userId !== uid) throw notFound("Attempt");
  return attempt;
}

export async function createAttempt(params: {
  uid: string;
  taskId: string;
  domainId: DomainId;
  day: number;
}): Promise<TaskAttempt> {
  const prior = await listAttemptsForUserTask(params.uid, params.taskId);
  const ref = adminDb.collection(ATTEMPTS).doc();
  const attempt: TaskAttempt = {
    id: ref.id,
    userId: params.uid,
    taskId: params.taskId,
    domainId: params.domainId,
    day: params.day,
    attemptNumber: prior.length + 1,
    status: "in_progress",
    startedAt: new Date().toISOString(),
    timeSpentSeconds: 0,
    hintCount: 0,
    score: 0,
  };
  await ref.set(attempt);
  return attempt;
}

export async function patchAttemptSubmission(attemptId: string, submission: unknown): Promise<void> {
  await adminDb.collection(ATTEMPTS).doc(attemptId).set({ submission }, { merge: true });
}

export async function incrementHintCount(attemptId: string): Promise<void> {
  const ref = adminDb.collection(ATTEMPTS).doc(attemptId);
  await adminDb.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    if (!doc.exists) return;
    const current = (doc.data() as TaskAttempt).hintCount ?? 0;
    tx.set(ref, { hintCount: current + 1 }, { merge: true });
  });
}

export async function submitAttempt(
  attemptId: string,
  data: {
    status: AttemptStatus;
    score: number;
    submission: unknown;
    evaluationDetail: EvaluationDetail;
    timeSpentSeconds: number;
    xpAward?: XpAward;
  }
): Promise<TaskAttempt> {
  const ref = adminDb.collection(ATTEMPTS).doc(attemptId);
  const patch = { ...data, completedAt: new Date().toISOString() };
  await ref.set(patch, { merge: true });
  const updated = await ref.get();
  return updated.data() as TaskAttempt;
}

export async function listAttemptsForUser(uid: string): Promise<TaskAttempt[]> {
  const snap = await adminDb.collection(ATTEMPTS).where("userId", "==", uid).get();
  return snap.docs.map((d) => d.data() as TaskAttempt);
}

export async function listAttemptsForUserDay(uid: string, day: number): Promise<TaskAttempt[]> {
  const snap = await adminDb
    .collection(ATTEMPTS)
    .where("userId", "==", uid)
    .where("day", "==", day)
    .get();
  return snap.docs.map((d) => d.data() as TaskAttempt);
}

export async function listAttemptsForUserDomain(uid: string, domainId: DomainId): Promise<TaskAttempt[]> {
  const snap = await adminDb
    .collection(ATTEMPTS)
    .where("userId", "==", uid)
    .where("domainId", "==", domainId)
    .get();
  return snap.docs.map((d) => d.data() as TaskAttempt);
}

export async function deleteAttemptsForUser(uid: string): Promise<void> {
  await batchDeleteByField(ATTEMPTS, "userId", uid);
}

/** Uncapped-ish scan for admin analytics; fine at MVP scale (see adminAnalytics.ts). */
export async function listAllAttemptsForAnalytics(limitCount = 5000): Promise<TaskAttempt[]> {
  const snap = await adminDb.collection(ATTEMPTS).limit(limitCount).get();
  return snap.docs.map((d) => d.data() as TaskAttempt);
}
