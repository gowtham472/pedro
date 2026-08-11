import { z } from "zod";
import { withAuth } from "@/lib/server/apiHandler";
import { getConsent, upsertConsent } from "@/lib/server/dal/consent";
import { checkRateLimit } from "@/lib/server/rateLimit";

export const GET = withAuth(async (_req, auth) => {
  const consent = await getConsent(auth.uid);
  return Response.json({ consent });
});

// Each category is independently optional, per PRD §30 - consent must never
// be bundled into a single checkbox.
const bodySchema = z.object({
  analyticsConsent: z.boolean().optional(),
  interactionConsent: z.boolean().optional(),
  gazeConsent: z.boolean().optional(),
  researchConsent: z.boolean().optional(),
});

export const POST = withAuth(async (req, auth) => {
  checkRateLimit(`consent-post:${auth.uid}`, 30, 60_000);
  const patch = bodySchema.parse(await req.json());
  const consent = await upsertConsent(auth.uid, patch);
  return Response.json({ consent });
});
