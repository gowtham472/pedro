import { withAuth } from "@/lib/server/apiHandler";
import { ApiError } from "@/lib/server/apiError";
import { deleteTask, requireTask, upsertTask } from "@/lib/server/dal/content";
import { taskSchema } from "@/lib/server/validation/content";
import { writeAuditLog } from "@/lib/server/dal/audit";
import type { TaskDefinition } from "@/types/content";

export const PUT = withAuth(
  async (req, auth, ctx) => {
    const { taskId } = await ctx.params;
    const task = taskSchema.parse(await req.json()) as unknown as TaskDefinition;
    if (task.id !== taskId) throw new ApiError(400, "Task id in the body must match the URL.");
    await upsertTask(task);
    await writeAuditLog({ actorUid: auth.uid, action: "task.update", targetType: "task", targetId: taskId });
    return Response.json({ task });
  },
  { admin: true }
);

export const DELETE = withAuth(
  async (_req, auth, ctx) => {
    const { taskId } = await ctx.params;
    await requireTask(taskId);
    await deleteTask(taskId);
    await writeAuditLog({ actorUid: auth.uid, action: "task.delete", targetType: "task", targetId: taskId });
    return Response.json({ success: true });
  },
  { admin: true }
);
