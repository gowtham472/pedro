import { withAuth } from "@/lib/server/apiHandler";
import { getOrInitJourney } from "@/lib/server/dal/journey";
import { getOrGenerateReport } from "@/lib/server/scoring/orchestrate";
import { DOMAIN_IDS } from "@/types/content";
import { insertEvents } from "@/lib/server/dal/telemetry";
import { checkRateLimit } from "@/lib/server/rateLimit";

export const GET = withAuth(async (req, auth) => {
  const journey = await getOrInitJourney(auth.uid);
  if (journey.dayStatus[7] !== "completed") {
    return Response.json({ ready: false });
  }

  const forceRefresh = new URL(req.url).searchParams.get("refresh") === "true";
  if (forceRefresh) checkRateLimit(`report-refresh:${auth.uid}`, 5, 60_000);
  const report = await getOrGenerateReport(auth.uid, DOMAIN_IDS, forceRefresh);

  if (forceRefresh) {
    await insertEvents(auth.uid, [
      { sessionId: auth.uid, eventType: "navigation", timestamp: new Date().toISOString(), metadata: { action: "report_regenerated" } },
    ]);
  }

  return Response.json({ ready: true, report });
});
