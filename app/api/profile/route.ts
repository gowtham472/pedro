import { z } from "zod";
import { withAuth } from "@/lib/server/apiHandler";
import { requireUserProfile, updateUserProfile, completeOnboarding } from "@/lib/server/dal/users";
import { getConsent } from "@/lib/server/dal/consent";
import { checkRateLimit } from "@/lib/server/rateLimit";

export const GET = withAuth(async (_req, auth) => {
  const [profile, consent] = await Promise.all([requireUserProfile(auth.uid), getConsent(auth.uid)]);
  return Response.json({ profile, consent });
});

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  timezone: z.string().max(100).optional(),
  reminderOptIn: z.boolean().optional(),
  baseline: z
    .object({
      triedBefore: z.array(z.string().max(60)).max(20),
      confidenceProgramming: z.number().int().min(1).max(5),
      confidenceLogic: z.number().int().min(1).max(5),
      confidenceDesign: z.number().int().min(1).max(5),
      confidenceData: z.number().int().min(1).max(5),
      curiosityCloud: z.number().int().min(1).max(5),
      interestSecurity: z.number().int().min(1).max(5),
    })
    .optional(),
});

export const PATCH = withAuth(async (req, auth) => {
  checkRateLimit(`profile-patch:${auth.uid}`, 30, 60_000);
  const body = patchSchema.parse(await req.json());

  if (body.baseline) {
    await completeOnboarding(auth.uid, { ...body.baseline, submittedAt: new Date().toISOString() });
  }
  if (body.name || body.timezone || body.reminderOptIn !== undefined) {
    await updateUserProfile(auth.uid, {
      name: body.name,
      timezone: body.timezone,
      reminderOptIn: body.reminderOptIn,
    });
  }

  const profile = await requireUserProfile(auth.uid);
  return Response.json({ profile });
});
