import { withAuth } from "@/lib/server/apiHandler";
import { listUsersForAdmin } from "@/lib/server/dal/users";

export const GET = withAuth(
  async (req) => {
    const limit = Number(new URL(req.url).searchParams.get("limit") ?? "50");
    const users = await listUsersForAdmin(Math.min(Math.max(limit, 1), 500));
    return Response.json({ users });
  },
  { admin: true }
);
