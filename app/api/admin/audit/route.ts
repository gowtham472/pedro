import { withAuth } from "@/lib/server/apiHandler";
import { listAuditLogs } from "@/lib/server/dal/audit";

export const GET = withAuth(
  async () => {
    const logs = await listAuditLogs(200);
    return Response.json({ logs });
  },
  { admin: true }
);
