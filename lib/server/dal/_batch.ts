import "server-only";

import { adminDb } from "@/lib/firebase/admin";

const BATCH_SIZE = 400; // stay under Firestore's 500-write batch limit

/** Deletes every document in `collection` matching `field == value`. */
export async function batchDeleteByField(
  collection: string,
  field: string,
  value: string
): Promise<number> {
  let deleted = 0;
  while (true) {
    const snap = await adminDb
      .collection(collection)
      .where(field, "==", value)
      .limit(BATCH_SIZE)
      .get();
    if (snap.empty) break;

    const batch = adminDb.batch();
    for (const doc of snap.docs) batch.delete(doc.ref);
    await batch.commit();
    deleted += snap.size;

    if (snap.size < BATCH_SIZE) break;
  }
  return deleted;
}
