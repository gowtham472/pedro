import { z } from "zod";
import { withAuth } from "@/lib/server/apiHandler";
import { setReportQualityRating } from "@/lib/server/dal/scoring";
import { checkRateLimit } from "@/lib/server/rateLimit";

// PRD §44 quality metrics: "Did this result feel accurate?" / "Did Pedro
// help you understand what to explore next?" - both 1-5.
const bodySchema = z.object({
  accurate: z.number().int().min(1).max(5),
  helpful: z.number().int().min(1).max(5),
});

export const POST = withAuth(async (req, auth) => {
  checkRateLimit(`report-quality:${auth.uid}`, 10, 60_000);
  const body = bodySchema.parse(await req.json());
  await setReportQualityRating(auth.uid, body);
  return Response.json({ success: true });
});
