import { z } from "zod";
import { withAuth } from "@/lib/server/apiHandler";
import { ApiError } from "@/lib/server/apiError";
import { requireTask } from "@/lib/server/dal/content";
import { createAttempt, getLatestAttempt, patchAttemptSubmission } from "@/lib/server/dal/attempts";
import { insertEvents } from "@/lib/server/dal/telemetry";
import { checkRateLimit } from "@/lib/server/rateLimit";
import { getInitialSession, runTerminalCommand, type TerminalSessionState } from "@/lib/server/sandbox/terminalEngine";

const bodySchema = z.object({ command: z.string().max(500) });

export const POST = withAuth(async (req, auth, ctx) => {
  const { taskId } = await ctx.params;
  checkRateLimit(`terminal-cmd:${auth.uid}`, 200, 60_000);

  const task = await requireTask(taskId);
  if (task.config.type !== "terminal") throw new ApiError(400, "This task doesn't use the terminal sandbox.");

  const { command } = bodySchema.parse(await req.json());

  let attempt = await getLatestAttempt(auth.uid, taskId);
  if (!attempt || attempt.status !== "in_progress") {
    attempt = await createAttempt({ uid: auth.uid, taskId, domainId: task.domainId, day: task.day });
  }

  const session = (attempt.submission as TerminalSessionState | undefined) ?? getInitialSession(task.config);
  const result = runTerminalCommand(task.config, session, command);

  await Promise.all([
    patchAttemptSubmission(attempt.id, result.session),
    insertEvents(auth.uid, [
      { sessionId: auth.uid, taskId, eventType: "terminal_command", timestamp: new Date().toISOString(), metadata: { command: command.slice(0, 100) } },
    ]),
  ]);

  return Response.json({
    output: result.output,
    cwd: result.session.cwd,
    goalReached: result.goalReached,
    newlyDiscoveredFindingIds: result.newlyDiscoveredFindingIds,
  });
});
