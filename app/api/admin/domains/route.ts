import { withAuth } from "@/lib/server/apiHandler";
import { listDomains, upsertDomain } from "@/lib/server/dal/content";
import { domainSchema } from "@/lib/server/validation/content";
import { writeAuditLog } from "@/lib/server/dal/audit";
import type { DomainDefinition } from "@/types/content";

export const GET = withAuth(
  async () => {
    const domains = await listDomains(false);
    return Response.json({ domains });
  },
  { admin: true }
);

export const POST = withAuth(
  async (req, auth) => {
    const domain = domainSchema.parse(await req.json()) as DomainDefinition;
    await upsertDomain(domain);
    await writeAuditLog({ actorUid: auth.uid, action: "domain.create", targetType: "domain", targetId: domain.id });
    return Response.json({ domain }, { status: 201 });
  },
  { admin: true }
);
