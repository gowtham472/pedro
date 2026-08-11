import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import type { DomainId, Reflection } from "@/types/entities";
import { batchDeleteByField } from "./_batch";

const REFLECTIONS = "reflections";

function reflectionDocId(uid: string, taskId: string) {
  return `${uid}_${taskId}`;
}

export async function upsertReflection(
  uid: string,
  data: {
    taskId: string;
    domainId: DomainId;
    day: number;
    enjoyment: number;
    difficulty: number;
    curiosity: number;
    persistence: number;
    futureInterest: number;
    comment?: string;
  }
): Promise<Reflection> {
  const id = reflectionDocId(uid, data.taskId);
  const doc: Reflection = {
    id,
    userId: uid,
    submittedAt: new Date().toISOString(),
    ...data,
  };
  await adminDb.collection(REFLECTIONS).doc(id).set(doc);
  return doc;
}

export async function getReflection(uid: string, taskId: string): Promise<Reflection | null> {
  const doc = await adminDb.collection(REFLECTIONS).doc(reflectionDocId(uid, taskId)).get();
  return doc.exists ? (doc.data() as Reflection) : null;
}

export async function listReflectionsForUser(uid: string): Promise<Reflection[]> {
  const snap = await adminDb.collection(REFLECTIONS).where("userId", "==", uid).get();
  return snap.docs.map((d) => d.data() as Reflection);
}

export async function listReflectionsForUserDay(uid: string, day: number): Promise<Reflection[]> {
  const snap = await adminDb
    .collection(REFLECTIONS)
    .where("userId", "==", uid)
    .where("day", "==", day)
    .get();
  return snap.docs.map((d) => d.data() as Reflection);
}

export async function listReflectionsForUserDomain(uid: string, domainId: DomainId): Promise<Reflection[]> {
  const snap = await adminDb
    .collection(REFLECTIONS)
    .where("userId", "==", uid)
    .where("domainId", "==", domainId)
    .get();
  return snap.docs.map((d) => d.data() as Reflection);
}

export async function deleteReflectionsForUser(uid: string): Promise<void> {
  await batchDeleteByField(REFLECTIONS, "userId", uid);
}
