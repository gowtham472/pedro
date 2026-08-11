import { withAuth } from "@/lib/server/apiHandler";
import { getScoringWeights, setScoringWeights } from "@/lib/server/dal/scoring";
import { scoringWeightsSchema } from "@/lib/server/validation/content";
import { writeAuditLog } from "@/lib/server/dal/audit";

export const GET = withAuth(
  async () => {
    const weights = await getScoringWeights();
    return Response.json({ weights });
  },
  { admin: true }
);

export const PUT = withAuth(
  async (req, auth) => {
    const parsed = scoringWeightsSchema.parse(await req.json());
    const weights = await setScoringWeights(parsed, auth.uid);
    await writeAuditLog({ actorUid: auth.uid, action: "scoring-config.update", targetType: "scoringConfig", targetId: "global", metadata: parsed });
    return Response.json({ weights });
  },
  { admin: true }
);
