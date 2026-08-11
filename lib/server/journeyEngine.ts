import "server-only";

import type { JourneyState, TaskAttempt } from "@/types/entities";
import type { TaskDefinition } from "@/types/content";
import { listTasksForDay, getCapstoneTask } from "@/lib/server/dal/content";
import { listAttemptsForUserDay } from "@/lib/server/dal/attempts";
import { listReflectionsForUserDay } from "@/lib/server/dal/reflections";
import { completeDay, getOrInitJourney } from "@/lib/server/dal/journey";

/**
 * A day counts as complete once every task assigned that day has a terminal
 * attempt (passed/failed/submitted - not necessarily *passed*) and a
 * reflection. Progression is engagement-gated, not performance-gated: Pedro
 * measures how a student does, but never blocks them from continuing because
 * they scored low (PRD §4.1/§4.3 - this is exploration, not an exam).
 */
async function tasksRequiredForDay(day: number, journey: JourneyState): Promise<TaskDefinition[]> {
  if (day === 7) {
    if (!journey.day7Choice) return [];
    const capstone = await getCapstoneTask(journey.day7Choice);
    return capstone ? [capstone] : [];
  }
  return listTasksForDay(day);
}

export async function checkAndAdvanceDay(
  uid: string,
  day: number
): Promise<{ dayCompleted: boolean; journey: JourneyState }> {
  let journey = await getOrInitJourney(uid);
  const tasks = await tasksRequiredForDay(day, journey);

  if (tasks.length === 0) {
    return { dayCompleted: false, journey };
  }

  const [attempts, reflections] = await Promise.all([
    listAttemptsForUserDay(uid, day),
    listReflectionsForUserDay(uid, day),
  ]);

  const latestByTask = new Map<string, TaskAttempt>();
  for (const attempt of attempts) {
    const existing = latestByTask.get(attempt.taskId);
    if (!existing || attempt.attemptNumber > existing.attemptNumber) {
      latestByTask.set(attempt.taskId, attempt);
    }
  }
  const reflectedTaskIds = new Set(reflections.map((r) => r.taskId));

  const allDone = tasks.every((task) => {
    const latest = latestByTask.get(task.id);
    return Boolean(latest) && latest!.status !== "in_progress" && reflectedTaskIds.has(task.id);
  });

  if (allDone && journey.dayStatus[day] !== "completed") {
    journey = await completeDay(uid, day);
  }

  return { dayCompleted: allDone, journey };
}

export function isDayUnlocked(journey: JourneyState, day: number): boolean {
  return journey.dayStatus[day] !== "locked" && journey.dayStatus[day] !== undefined;
}
