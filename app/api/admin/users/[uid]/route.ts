import { z } from "zod";
import { withAuth } from "@/lib/server/apiHandler";
import { requireUserProfile, setUserRoleAndClaim } from "@/lib/server/dal/users";
import { getOrInitJourney } from "@/lib/server/dal/journey";
import { listDomainScoresForUser } from "@/lib/server/dal/scoring";
import { writeAuditLog } from "@/lib/server/dal/audit";

// Aggregate progress view only - no raw event/telemetry dump, per PRD §26.
export const GET = withAuth(
  async (_req, auth, ctx) => {
    const { uid } = await ctx.params;
    const [profile, journey, domainScores] = await Promise.all([
      requireUserProfile(uid),
      getOrInitJourney(uid),
      listDomainScoresForUser(uid),
    ]);
    await writeAuditLog({ actorUid: auth.uid, action: "user.view", targetType: "user", targetId: uid });
    return Response.json({ profile, journey, domainScores });
  },
  { admin: true }
);

const patchSchema = z.object({ role: z.enum(["user", "admin"]) });

export const PATCH = withAuth(
  async (req, auth, ctx) => {
    const { uid } = await ctx.params;
    const { role } = patchSchema.parse(await req.json());
    await requireUserProfile(uid); // 404s if the target user doesn't exist
    await setUserRoleAndClaim(uid, role);
    await writeAuditLog({ actorUid: auth.uid, action: "user.role_change", targetType: "user", targetId: uid, metadata: { role } });
    const profile = await requireUserProfile(uid);
    return Response.json({ profile });
  },
  { admin: true }
);
