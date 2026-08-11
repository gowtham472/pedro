import { withAuth } from "@/lib/server/apiHandler";
import { listDomainScoresForUser } from "@/lib/server/dal/scoring";
import { getOrInitJourney } from "@/lib/server/dal/journey";

export const GET = withAuth(async (_req, auth) => {
  const [scores, journey] = await Promise.all([listDomainScoresForUser(auth.uid), getOrInitJourney(auth.uid)]);
  const sorted = [...scores].sort((a, b) => b.overallScore - a.overallScore);
  return Response.json({ domainScores: sorted, day7Choice: journey.day7Choice });
});
