import { withAuth } from "@/lib/server/apiHandler";
import { ApiError } from "@/lib/server/apiError";
import { requireTask } from "@/lib/server/dal/content";
import { getOrInitJourney } from "@/lib/server/dal/journey";
import { isDayUnlocked } from "@/lib/server/journeyEngine";
import { sanitizeTaskForClient } from "@/lib/server/taskSanitizer";
import { getLatestAttempt } from "@/lib/server/dal/attempts";
import { getReflection } from "@/lib/server/dal/reflections";

export const GET = withAuth(async (_req, auth, ctx) => {
  const { taskId } = await ctx.params;
  const task = await requireTask(taskId);

  const journey = await getOrInitJourney(auth.uid);
  if (!isDayUnlocked(journey, task.day)) {
    throw new ApiError(403, "This task isn't unlocked yet.");
  }
  if (task.day === 7 && journey.day7Choice !== task.domainId) {
    throw new ApiError(403, "This isn't your chosen Day 7 domain.");
  }

  const [latestAttempt, reflection] = await Promise.all([
    getLatestAttempt(auth.uid, taskId),
    getReflection(auth.uid, taskId),
  ]);

  return Response.json({
    task: sanitizeTaskForClient(task),
    latestAttempt,
    reflected: Boolean(reflection),
  });
});
