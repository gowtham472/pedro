import { withAuth } from "@/lib/server/apiHandler";
import { getOrInitJourney } from "@/lib/server/dal/journey";
import { getUserProfile } from "@/lib/server/dal/users";

export const GET = withAuth(async (_req, auth) => {
  const [journey, profile] = await Promise.all([getOrInitJourney(auth.uid), getUserProfile(auth.uid)]);
  return Response.json({ journey, onboardingCompleted: profile?.onboardingCompleted ?? false });
});
