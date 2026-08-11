/**
 * Promotes an existing user to admin by email — for granting admin access
 * to a second account without restarting the server (the first admin is
 * normally granted automatically via ADMIN_BOOTSTRAP_EMAILS on login; see
 * app/api/auth/session/route.ts).
 *
 * Usage: pnpm bootstrap-admin someone@example.com
 */
import { adminAuth, adminDb } from "../lib/firebase/admin";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: pnpm bootstrap-admin <email>");
    process.exit(1);
  }

  const user = await adminAuth.getUserByEmail(email);
  await adminAuth.setCustomUserClaims(user.uid, { admin: true });
  await adminDb.collection("users").doc(user.uid).set({ role: "admin" }, { merge: true });

  console.log(`${email} (${user.uid}) is now an admin. They may need to sign out and back in to see it take effect.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
