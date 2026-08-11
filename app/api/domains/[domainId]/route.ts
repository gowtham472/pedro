import { withAuth } from "@/lib/server/apiHandler";
import { requireDomain, listLessonsForDay } from "@/lib/server/dal/content";

export const GET = withAuth(async (_req, _auth, ctx) => {
  const { domainId } = await ctx.params;
  const domain = await requireDomain(domainId);
  const lessons = await listLessonsForDay(domain.day);
  return Response.json({ domain, lesson: lessons[0] ?? null });
});
