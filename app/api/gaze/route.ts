import { z } from "zod";
import { withAuth } from "@/lib/server/apiHandler";
import { setGazeSummary } from "@/lib/server/dal/telemetry";
import { checkRateLimit } from "@/lib/server/rateLimit";

// Only ever receives an aggregated summary - never raw frames or coordinates
// (PRD §18: "no raw video storage by default", "should only contribute a
// small amount to engagement/interaction analysis"). Silently no-ops if the
// user hasn't granted gaze consent (enforced in the DAL).
const bodySchema = z.object({
  taskId: z.string().max(128),
  calibrationQuality: z.enum(["none", "low", "medium", "high"]),
  presenceRatio: z.number().min(0).max(1),
  regionDistribution: z.record(z.string(), z.number().min(0).max(1)),
  sampleCount: z.number().int().min(0).max(100_000),
});

export const POST = withAuth(async (req, auth) => {
  checkRateLimit(`gaze:${auth.uid}`, 20, 60_000);
  const body = bodySchema.parse(await req.json());
  await setGazeSummary(auth.uid, body.taskId, {
    calibrationQuality: body.calibrationQuality,
    presenceRatio: body.presenceRatio,
    regionDistribution: body.regionDistribution,
    sampleCount: body.sampleCount,
  });
  return Response.json({ success: true });
});
