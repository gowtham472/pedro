import { z } from "zod";
import { withAuth } from "@/lib/server/apiHandler";
import { checkRateLimit } from "@/lib/server/rateLimit";
import { insertEvents, accumulateInteractionSummary } from "@/lib/server/dal/telemetry";

const EVENT_TYPES = [
  "session_started", "lesson_started", "lesson_completed", "task_started", "task_paused",
  "task_resumed", "task_submitted", "task_completed", "task_failed", "hint_opened",
  "hint_completed", "retry_started", "code_run", "code_error", "design_created",
  "design_modified", "query_executed", "terminal_command", "navigation", "scroll",
  "click", "reflection_submitted", "day_completed",
] as const;

const bodySchema = z.object({
  sessionId: z.string().max(128),
  events: z
    .array(
      z.object({
        taskId: z.string().max(128).optional(),
        eventType: z.enum(EVENT_TYPES),
        timestamp: z.string(),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .max(100)
    .default([]),
  interactionDelta: z
    .object({
      taskId: z.string().max(128),
      clickCount: z.number().min(0).max(100_000),
      activeInteractionSeconds: z.number().min(0).max(86_400),
      scrollDistance: z.number().min(0).max(10_000_000),
      retryCount: z.number().min(0).max(10_000),
    })
    .optional(),
});

// Batched, best-effort telemetry ingestion (PRD §16/§17). Never collects
// keystrokes, raw coordinates streamed continuously, or anything outside
// Pedro. Silently drops writes the user hasn't consented to (see
// lib/server/dal/telemetry.ts) rather than erroring, so the client doesn't
// need special-case handling for declined consent.
export const POST = withAuth(async (req, auth) => {
  checkRateLimit(`events:${auth.uid}`, 60, 60_000);
  const body = bodySchema.parse(await req.json());

  const [inserted] = await Promise.all([
    insertEvents(
      auth.uid,
      body.events.map((e) => ({ ...e, sessionId: body.sessionId }))
    ),
    body.interactionDelta
      ? accumulateInteractionSummary(auth.uid, body.interactionDelta.taskId, {
          clickCount: body.interactionDelta.clickCount,
          activeInteractionSeconds: body.interactionDelta.activeInteractionSeconds,
          scrollDistance: body.interactionDelta.scrollDistance,
          retryCount: body.interactionDelta.retryCount,
        })
      : Promise.resolve(),
  ]);

  return Response.json({ inserted });
});
