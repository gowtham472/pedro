import { withAuth } from "@/lib/server/apiHandler";
import { listAllLessons, upsertLesson } from "@/lib/server/dal/content";
import { lessonSchema } from "@/lib/server/validation/content";
import { writeAuditLog } from "@/lib/server/dal/audit";
import type { LessonDefinition } from "@/types/content";

export const GET = withAuth(
  async () => {
    const lessons = await listAllLessons();
    return Response.json({ lessons });
  },
  { admin: true }
);

export const POST = withAuth(
  async (req, auth) => {
    const lesson = lessonSchema.parse(await req.json()) as LessonDefinition;
    await upsertLesson(lesson);
    await writeAuditLog({ actorUid: auth.uid, action: "lesson.create", targetType: "lesson", targetId: lesson.id });
    return Response.json({ lesson }, { status: 201 });
  },
  { admin: true }
);
