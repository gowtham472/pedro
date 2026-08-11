import { withAuth } from "@/lib/server/apiHandler";
import { ApiError } from "@/lib/server/apiError";
import { deleteLesson, requireLesson, upsertLesson } from "@/lib/server/dal/content";
import { lessonSchema } from "@/lib/server/validation/content";
import { writeAuditLog } from "@/lib/server/dal/audit";
import type { LessonDefinition } from "@/types/content";

export const PUT = withAuth(
  async (req, auth, ctx) => {
    const { lessonId } = await ctx.params;
    const lesson = lessonSchema.parse(await req.json()) as LessonDefinition;
    if (lesson.id !== lessonId) throw new ApiError(400, "Lesson id in the body must match the URL.");
    await upsertLesson(lesson);
    await writeAuditLog({ actorUid: auth.uid, action: "lesson.update", targetType: "lesson", targetId: lessonId });
    return Response.json({ lesson });
  },
  { admin: true }
);

export const DELETE = withAuth(
  async (_req, auth, ctx) => {
    const { lessonId } = await ctx.params;
    await requireLesson(lessonId);
    await deleteLesson(lessonId);
    await writeAuditLog({ actorUid: auth.uid, action: "lesson.delete", targetType: "lesson", targetId: lessonId });
    return Response.json({ success: true });
  },
  { admin: true }
);
