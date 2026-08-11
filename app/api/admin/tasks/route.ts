import { withAuth } from "@/lib/server/apiHandler";
import { listAllTasks, upsertTask } from "@/lib/server/dal/content";
import { taskSchema } from "@/lib/server/validation/content";
import { writeAuditLog } from "@/lib/server/dal/audit";
import type { TaskDefinition } from "@/types/content";

export const GET = withAuth(
  async () => {
    const tasks = await listAllTasks();
    return Response.json({ tasks });
  },
  { admin: true }
);

export const POST = withAuth(
  async (req, auth) => {
    const task = taskSchema.parse(await req.json()) as unknown as TaskDefinition;
    await upsertTask(task);
    await writeAuditLog({ actorUid: auth.uid, action: "task.create", targetType: "task", targetId: task.id });
    return Response.json({ task }, { status: 201 });
  },
  { admin: true }
);
