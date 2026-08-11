import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type { GazeSummary, InteractionSummary, TelemetryEvent } from "@/types/entities";
import { batchDeleteByField } from "./_batch";
import { getConsent } from "./consent";

const EVENTS = "events";
const INTERACTIONS = "interactionSummaries";
const GAZE = "gazeSummaries";

/**
 * Consent is enforced here - the single choke point every event insert goes
 * through - rather than in each caller, so a route can never forget the
 * check (PRD §30: analytics telemetry is opt-in, not bundled with the rest
 * of the product working).
 */
export async function insertEvents(
  uid: string,
  events: Omit<TelemetryEvent, "id" | "userId">[]
): Promise<number> {
  if (events.length === 0) return 0;
  const consent = await getConsent(uid);
  if (!consent.analyticsConsent) return 0;

  const batch = adminDb.batch();
  for (const event of events.slice(0, 200)) {
    const ref = adminDb.collection(EVENTS).doc();
    const doc: TelemetryEvent = { id: ref.id, userId: uid, ...event };
    batch.set(ref, doc);
  }
  await batch.commit();
  return Math.min(events.length, 200);
}

export async function deleteEventsForUser(uid: string): Promise<void> {
  await batchDeleteByField(EVENTS, "userId", uid);
}

export async function listRecentEventsForUser(uid: string, limitCount = 100): Promise<TelemetryEvent[]> {
  const snap = await adminDb
    .collection(EVENTS)
    .where("userId", "==", uid)
    .orderBy("timestamp", "desc")
    .limit(limitCount)
    .get();
  return snap.docs.map((d) => d.data() as TelemetryEvent);
}

// --- Interaction summaries (derived mouse/scroll metrics, per PRD §17) ----

function interactionDocId(uid: string, taskId: string) {
  return `${uid}_${taskId}`;
}

export async function accumulateInteractionSummary(
  uid: string,
  taskId: string,
  delta: { clickCount: number; activeInteractionSeconds: number; scrollDistance: number; retryCount: number }
): Promise<void> {
  const consent = await getConsent(uid);
  if (!consent.interactionConsent) return;

  const ref = adminDb.collection(INTERACTIONS).doc(interactionDocId(uid, taskId));
  await ref.set(
    {
      id: interactionDocId(uid, taskId),
      userId: uid,
      taskId,
      clickCount: FieldValue.increment(delta.clickCount),
      activeInteractionSeconds: FieldValue.increment(delta.activeInteractionSeconds),
      scrollDistance: FieldValue.increment(delta.scrollDistance),
      retryCount: FieldValue.increment(delta.retryCount),
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function getInteractionSummary(uid: string, taskId: string): Promise<InteractionSummary | null> {
  const doc = await adminDb.collection(INTERACTIONS).doc(interactionDocId(uid, taskId)).get();
  return doc.exists ? (doc.data() as InteractionSummary) : null;
}

export async function deleteInteractionSummariesForUser(uid: string): Promise<void> {
  await batchDeleteByField(INTERACTIONS, "userId", uid);
}

// --- Gaze summaries (optional, experimental - PRD §18) --------------------

function gazeDocId(uid: string, taskId: string) {
  return `${uid}_${taskId}`;
}

export async function setGazeSummary(
  uid: string,
  taskId: string,
  data: Omit<GazeSummary, "id" | "userId" | "taskId" | "createdAt">
): Promise<void> {
  const consent = await getConsent(uid);
  if (!consent.gazeConsent) return;

  const ref = adminDb.collection(GAZE).doc(gazeDocId(uid, taskId));
  const doc: GazeSummary = {
    id: gazeDocId(uid, taskId),
    userId: uid,
    taskId,
    createdAt: new Date().toISOString(),
    ...data,
  };
  await ref.set(doc);
}

export async function getGazeSummary(uid: string, taskId: string): Promise<GazeSummary | null> {
  const doc = await adminDb.collection(GAZE).doc(gazeDocId(uid, taskId)).get();
  return doc.exists ? (doc.data() as GazeSummary) : null;
}

export async function deleteGazeSummariesForUser(uid: string): Promise<void> {
  await batchDeleteByField(GAZE, "userId", uid);
}
