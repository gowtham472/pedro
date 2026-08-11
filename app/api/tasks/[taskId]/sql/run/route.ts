import { z } from "zod";
import { withAuth } from "@/lib/server/apiHandler";
import { ApiError } from "@/lib/server/apiError";
import { requireTask } from "@/lib/server/dal/content";
import { executeSqlQuery } from "@/lib/server/sandbox/sqlRunner";
import { insertEvents } from "@/lib/server/dal/telemetry";
import { checkRateLimit } from "@/lib/server/rateLimit";

const bodySchema = z.object({ query: z.string().max(4000) });

// Live preview only - no grading, no attempt mutation. Lets students iterate
// on a query and see results before submitting.
export const POST = withAuth(async (req, auth, ctx) => {
  const { taskId } = await ctx.params;
  checkRateLimit(`sql-run:${auth.uid}`, 120, 60_000);

  const task = await requireTask(taskId);
  if (task.config.type !== "sql") throw new ApiError(400, "This task doesn't use the SQL sandbox.");

  const { query } = bodySchema.parse(await req.json());
  const result = await executeSqlQuery(task.config.datasetId, query);

  await insertEvents(auth.uid, [
    {
      sessionId: auth.uid,
      taskId,
      eventType: "query_executed",
      timestamp: new Date().toISOString(),
      metadata: { hadError: Boolean(result.error) },
    },
  ]);

  return Response.json(result);
});
