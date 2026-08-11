import { withAuth } from "@/lib/server/apiHandler";
import { listDomains } from "@/lib/server/dal/content";

export const GET = withAuth(async () => {
  const domains = await listDomains(true);
  return Response.json({ domains });
});
