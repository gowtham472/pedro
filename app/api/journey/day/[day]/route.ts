import { withAuth } from "@/lib/server/apiHandler";
import { ApiError } from "@/lib/server/apiError";
import { getDomainForDay, listLessonsForDay, listTasksForDay, getCapstoneTask } from "@/lib/server/dal/content";
import { getOrInitJourney, markDayInProgress, touchActivity } from "@/lib/server/dal/journey";
import { listAttemptsForUserDay } from "@/lib/server/dal/attempts";
import { listReflectionsForUserDay } from "@/lib/server/dal/reflections";
import { listDomainScoresForUser } from "@/lib/server/dal/scoring";
import { isDayUnlocked } from "@/lib/server/journeyEngine";
import { sanitizeTaskForClient } from "@/lib/server/taskSanitizer";
import { insertEvents } from "@/lib/server/dal/telemetry";
import type { TaskAttempt, TaskDefinition } from "@/types";

export const GET = withAuth(async (_req, auth, ctx) => {
  const { day: dayParam } = await ctx.params;
  const day = Number(dayParam);
  if (!Number.isInteger(day) || day < 1 || day > 7) {
    throw new ApiError(400, "Day must be between 1 and 7.");
  }

  const journey = await getOrInitJourney(auth.uid);
  if (!isDayUnlocked(journey, day)) {
    throw new ApiError(403, `Day ${day} isn't unlocked yet.`);
  }

  const firstVisit = journey.dayStatus[day] === "not_started";
  if (firstVisit) {
    await Promise.all([
      markDayInProgress(auth.uid, day),
      insertEvents(auth.uid, [
        {
          sessionId: auth.uid,
          eventType: "navigation",
          timestamp: new Date().toISOString(),
          metadata: { day, action: "day_started" },
        },
      ]),
    ]);
  }
  await touchActivity(auth.uid);

  let tasks: TaskDefinition[];
  let domain = null;
  let lesson = null;

  if (day === 7) {
    domain = null;
    lesson = null;
    if (journey.day7Choice) {
      const capstone = await getCapstoneTask(journey.day7Choice);
      tasks = capstone ? [capstone] : [];
    } else {
      tasks = [];
    }
  } else {
    const [domainResult, lessons, dayTasks] = await Promise.all([
      getDomainForDay(day),
      listLessonsForDay(day),
      listTasksForDay(day),
    ]);
    domain = domainResult;
    lesson = lessons[0] ?? null;
    tasks = dayTasks;
  }

  const [attempts, reflections, domainScores] = await Promise.all([
    listAttemptsForUserDay(auth.uid, day),
    listReflectionsForUserDay(auth.uid, day),
    day === 7 && !journey.day7Choice ? listDomainScoresForUser(auth.uid) : Promise.resolve([]),
  ]);

  const latestByTask = new Map<string, TaskAttempt>();
  for (const a of attempts) {
    const existing = latestByTask.get(a.taskId);
    if (!existing || a.attemptNumber > existing.attemptNumber) latestByTask.set(a.taskId, a);
  }
  const reflectedTaskIds = new Set(reflections.map((r) => r.taskId));

  const taskViews = tasks.map((task) => ({
    task: sanitizeTaskForClient(task),
    latestAttempt: latestByTask.get(task.id) ?? null,
    reflected: reflectedTaskIds.has(task.id),
  }));

  const recommendedDomains =
    day === 7 && !journey.day7Choice
      ? [...domainScores].sort((a, b) => b.overallScore - a.overallScore).slice(0, 3).map((s) => s.domainId)
      : [];

  return Response.json({
    day,
    domain,
    lesson,
    tasks: taskViews,
    dayStatus: journey.dayStatus[day],
    day7Choice: journey.day7Choice,
    recommendedDomains,
  });
});
