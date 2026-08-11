import { withAuth } from "@/lib/server/apiHandler";
import { ApiError } from "@/lib/server/apiError";
import { deleteDomain, requireDomain, upsertDomain } from "@/lib/server/dal/content";
import { domainSchema } from "@/lib/server/validation/content";
import { writeAuditLog } from "@/lib/server/dal/audit";
import type { DomainDefinition } from "@/types/content";

export const PUT = withAuth(
  async (req, auth, ctx) => {
    const { domainId } = await ctx.params;
    const domain = domainSchema.parse(await req.json()) as DomainDefinition;
    if (domain.id !== domainId) throw new ApiError(400, "Domain id in the body must match the URL.");
    await upsertDomain(domain);
    await writeAuditLog({ actorUid: auth.uid, action: "domain.update", targetType: "domain", targetId: domainId });
    return Response.json({ domain });
  },
  { admin: true }
);

export const DELETE = withAuth(
  async (_req, auth, ctx) => {
    const { domainId } = await ctx.params;
    await requireDomain(domainId);
    await deleteDomain(domainId);
    await writeAuditLog({ actorUid: auth.uid, action: "domain.delete", targetType: "domain", targetId: domainId });
    return Response.json({ success: true });
  },
  { admin: true }
);
