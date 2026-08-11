import { withAuth } from "@/lib/server/apiHandler";
import { ApiError } from "@/lib/server/apiError";
import { requireTask } from "@/lib/server/dal/content";
import { getOrInitJourney, touchActivity } from "@/lib/server/dal/journey";
import { isDayUnlocked } from "@/lib/server/journeyEngine";
import { createAttempt, getLatestAttempt, patchAttemptSubmission } from "@/lib/server/dal/attempts";
import { insertEvents } from "@/lib/server/dal/telemetry";
import { getInitialSession } from "@/lib/server/sandbox/terminalEngine";
import { checkRateLimit } from "@/lib/server/rateLimit";

export const POST = withAuth(async (_req, auth, ctx) => {
  const { taskId } = await ctx.params;
  checkRateLimit(`task-start:${auth.uid}`, 60, 60_000);

  const task = await requireTask(taskId);
  const journey = await getOrInitJourney(auth.uid);
  if (!isDayUnlocked(journey, task.day)) throw new ApiError(403, "This task isn't unlocked yet.");
  if (task.day === 7 && journey.day7Choice !== task.domainId) {
    throw new ApiError(403, "This isn't your chosen Day 7 domain.");
  }

  const existing = await getLatestAttempt(auth.uid, taskId);
  if (existing && existing.status === "in_progress") {
    return Response.json({ attempt: existing });
  }

  const attempt = await createAttempt({ uid: auth.uid, taskId, domainId: task.domainId, day: task.day });

  if (task.config.type === "terminal") {
    await patchAttemptSubmission(attempt.id, getInitialSession(task.config));
  }

  await Promise.all([
    touchActivity(auth.uid),
    insertEvents(auth.uid, [
      { sessionId: auth.uid, taskId, eventType: "task_started", timestamp: new Date().toISOString() },
    ]),
  ]);

  return Response.json({ attempt });
});
