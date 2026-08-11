import { withAuth } from "@/lib/server/apiHandler";
import { deleteUserCascade } from "@/lib/server/dal/users";
import { writeAuditLog } from "@/lib/server/dal/audit";
import { checkRateLimit } from "@/lib/server/rateLimit";

// Full account deletion: cascades across every Firestore collection that
// references the user, then deletes the Firebase Auth account itself (PRD
// §30 "delete their account and associated data"). Irreversible by design -
// the client is expected to have its own confirmation step before calling this.
export const DELETE = withAuth(async (_req, auth) => {
  checkRateLimit(`account-delete:${auth.uid}`, 3, 60_000);
  await writeAuditLog({
    actorUid: auth.uid,
    action: "account.delete",
    targetType: "user",
    targetId: auth.uid,
  });
  await deleteUserCascade(auth.uid);
  return Response.json({ success: true });
});
