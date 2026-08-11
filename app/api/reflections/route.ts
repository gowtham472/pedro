import { z } from "zod";
import { withAuth } from "@/lib/server/apiHandler";
import { requireTask } from "@/lib/server/dal/content";
import { upsertReflection } from "@/lib/server/dal/reflections";
import { insertEvents } from "@/lib/server/dal/telemetry";
import { checkAndAdvanceDay } from "@/lib/server/journeyEngine";
import { touchActivity } from "@/lib/server/dal/journey";
import { recomputeDomainScore } from "@/lib/server/scoring/orchestrate";
import { checkRateLimit } from "@/lib/server/rateLimit";

const scale = z.number().int().min(1).max(5);

const bodySchema = z.object({
  taskId: z.string().max(128),
  enjoyment: scale,
  difficulty: scale,
  curiosity: scale,
  persistence: scale,
  futureInterest: scale,
  comment: z.string().max(1000).optional(),
});

export const POST = withAuth(async (req, auth) => {
  checkRateLimit(`reflections:${auth.uid}`, 40, 60_000);
  const body = bodySchema.parse(await req.json());
  const task = await requireTask(body.taskId);

  const reflection = await upsertReflection(auth.uid, {
    taskId: body.taskId,
    domainId: task.domainId,
    day: task.day,
    enjoyment: body.enjoyment,
    difficulty: body.difficulty,
    curiosity: body.curiosity,
    persistence: body.persistence,
    futureInterest: body.futureInterest,
    comment: body.comment,
  });

  const { dayCompleted } = await checkAndAdvanceDay(auth.uid, task.day);

  await Promise.all([
    touchActivity(auth.uid),
    insertEvents(auth.uid, [
      { sessionId: auth.uid, taskId: body.taskId, eventType: "reflection_submitted", timestamp: new Date().toISOString() },
      ...(dayCompleted
        ? [{ sessionId: auth.uid, eventType: "day_completed" as const, timestamp: new Date().toISOString(), metadata: { day: task.day } }]
        : []),
    ]),
    recomputeDomainScore(auth.uid, task.domainId),
  ]);

  return Response.json({ reflection, dayCompleted });
});
