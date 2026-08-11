import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import type { DayStatus, DomainId, JourneyState } from "@/types/entities";
import { TOTAL_DAYS } from "@/lib/content";

const JOURNEYS = "journeys";

function initialDayStatus(): Record<number, DayStatus> {
  const status: Record<number, DayStatus> = {};
  for (let day = 1; day <= TOTAL_DAYS; day++) {
    status[day] = day === 1 ? "not_started" : "locked";
  }
  return status;
}

export async function getJourney(uid: string): Promise<JourneyState | null> {
  const doc = await adminDb.collection(JOURNEYS).doc(uid).get();
  return doc.exists ? (doc.data() as JourneyState) : null;
}

export async function getOrInitJourney(uid: string): Promise<JourneyState> {
  const existing = await getJourney(uid);
  if (existing) return existing;

  const journey: JourneyState = {
    userId: uid,
    currentDay: 1,
    dayStatus: initialDayStatus(),
    day7Choice: null,
    startedAt: new Date().toISOString(),
    streak: 0,
    lastActivityAt: new Date().toISOString(),
  };
  await adminDb.collection(JOURNEYS).doc(uid).set(journey);
  return journey;
}

function nextStreak(journey: JourneyState, now: Date): number {
  const last = new Date(journey.lastActivityAt);
  const hoursSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60);
  if (hoursSince < 20) return journey.streak; // same day, unchanged
  if (hoursSince <= 48) return journey.streak + 1; // consecutive day
  return 1; // streak broken, restart
}

export async function touchActivity(uid: string): Promise<JourneyState> {
  const journey = await getOrInitJourney(uid);
  const now = new Date();
  const updated: JourneyState = {
    ...journey,
    streak: nextStreak(journey, now),
    lastActivityAt: now.toISOString(),
  };
  await adminDb.collection(JOURNEYS).doc(uid).set(updated, { merge: true });
  return updated;
}

export async function markDayInProgress(uid: string, day: number): Promise<void> {
  const journey = await getOrInitJourney(uid);
  if (journey.dayStatus[day] === "not_started") {
    await adminDb
      .collection(JOURNEYS)
      .doc(uid)
      .set({ dayStatus: { ...journey.dayStatus, [day]: "in_progress" } }, { merge: true });
  }
}

export async function completeDay(uid: string, day: number): Promise<JourneyState> {
  const journey = await getOrInitJourney(uid);
  const dayStatus = { ...journey.dayStatus, [day]: "completed" as DayStatus };
  const nextDay = day + 1;
  if (nextDay <= TOTAL_DAYS && dayStatus[nextDay] === "locked") {
    dayStatus[nextDay] = "not_started";
  }

  const patch: Partial<JourneyState> = {
    dayStatus,
    currentDay: Math.max(journey.currentDay, Math.min(nextDay, TOTAL_DAYS)),
  };
  if (day === TOTAL_DAYS) {
    patch.completedAt = new Date().toISOString();
  }

  await adminDb.collection(JOURNEYS).doc(uid).set(patch, { merge: true });
  return { ...journey, ...patch } as JourneyState;
}

export async function setDay7Choice(uid: string, domainId: DomainId): Promise<void> {
  await adminDb.collection(JOURNEYS).doc(uid).set({ day7Choice: domainId }, { merge: true });
}

export async function deleteJourneyForUser(uid: string): Promise<void> {
  await adminDb.collection(JOURNEYS).doc(uid).delete();
}

export async function listJourneysForAdmin(limitCount = 500): Promise<JourneyState[]> {
  const snap = await adminDb.collection(JOURNEYS).limit(limitCount).get();
  return snap.docs.map((d) => d.data() as JourneyState);
}
