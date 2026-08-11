import { z } from "zod";
import { withAuth } from "@/lib/server/apiHandler";
import { ApiError } from "@/lib/server/apiError";
import { DOMAIN_IDS } from "@/types/content";
import { getOrInitJourney, setDay7Choice, touchActivity } from "@/lib/server/dal/journey";
import { isDayUnlocked } from "@/lib/server/journeyEngine";
import { insertEvents } from "@/lib/server/dal/telemetry";
import { checkRateLimit } from "@/lib/server/rateLimit";

const bodySchema = z.object({ domainId: z.enum(DOMAIN_IDS as [string, ...string[]]) });

export const POST = withAuth(async (req, auth) => {
  checkRateLimit(`day7-choice:${auth.uid}`, 20, 60_000);
  const { domainId } = bodySchema.parse(await req.json());
  const journey = await getOrInitJourney(auth.uid);
  if (!isDayUnlocked(journey, 7)) throw new ApiError(403, "Day 7 isn't unlocked yet.");

  await setDay7Choice(auth.uid, domainId as (typeof DOMAIN_IDS)[number]);
  await Promise.all([
    touchActivity(auth.uid),
    insertEvents(auth.uid, [
      {
        sessionId: auth.uid,
        eventType: "navigation",
        timestamp: new Date().toISOString(),
        metadata: { action: "day7_choice", domainId },
      },
    ]),
  ]);

  return Response.json({ day7Choice: domainId });
});
