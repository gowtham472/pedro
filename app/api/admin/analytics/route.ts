import { withAuth } from "@/lib/server/apiHandler";
import { computeAdminAnalytics } from "@/lib/server/dal/adminAnalytics";

// Aggregate-only: completion funnels and per-task pass rates, never raw
// per-user telemetry streams (PRD §26: "Admin should not have unrestricted
// access to sensitive raw telemetry").
export const GET = withAuth(
  async () => {
    const analytics = await computeAdminAnalytics();
    return Response.json({ analytics });
  },
  { admin: true }
);
