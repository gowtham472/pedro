import { withAuth } from "@/lib/server/apiHandler";
import { ApiError } from "@/lib/server/apiError";
import { requireTask } from "@/lib/server/dal/content";
import { getLatestAttempt, incrementHintCount } from "@/lib/server/dal/attempts";
import { insertEvents } from "@/lib/server/dal/telemetry";
import { checkRateLimit } from "@/lib/server/rateLimit";

export const POST = withAuth(async (_req, auth, ctx) => {
  const { taskId } = await ctx.params;
  checkRateLimit(`task-hint:${auth.uid}`, 60, 60_000);

  const task = await requireTask(taskId);
  const attempt = await getLatestAttempt(auth.uid, taskId);
  if (!attempt) throw new ApiError(400, "Start the task before requesting a hint.");

  const nextIndex = attempt.hintCount;
  const hint = task.hints.find((h) => h.order === nextIndex + 1) ?? null;

  if (hint) {
    await Promise.all([
      incrementHintCount(attempt.id),
      insertEvents(auth.uid, [
        {
          sessionId: auth.uid,
          taskId,
          eventType: "hint_opened",
          timestamp: new Date().toISOString(),
          metadata: { hintNumber: hint.order },
        },
      ]),
    ]);
  }

  return Response.json({
    hint,
    hintsRemaining: Math.max(0, task.hints.length - (hint ? nextIndex + 1 : nextIndex)),
    totalHints: task.hints.length,
  });
});
