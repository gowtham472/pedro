import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import type { AuditLogEntry } from "@/types/entities";

const AUDIT_COLLECTION = "auditLogs";

export async function writeAuditLog(entry: {
  actorUid: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const ref = adminDb.collection(AUDIT_COLLECTION).doc();
  const doc: AuditLogEntry = {
    id: ref.id,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  await ref.set(doc);
}

export async function listAuditLogs(limit = 100): Promise<AuditLogEntry[]> {
  const snap = await adminDb
    .collection(AUDIT_COLLECTION)
    .orderBy("timestamp", "desc")
    .limit(limit)
    .get();
  return snap.docs.map((d) => d.data() as AuditLogEntry);
}
