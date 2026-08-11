"use client";

import { useEffect, useState } from "react";
import { PedroCard, PedroCardEyebrow } from "@/components/pedro";
import { api } from "@/lib/client/api";
import type { AuditLogEntry } from "@/types/entities";

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    api.get<{ logs: AuditLogEntry[] }>("/api/admin/audit").then((res) => setLogs(res.logs));
  }, []);

  return (
    <PedroCard padding="lg">
      <PedroCardEyebrow>Audit log</PedroCardEyebrow>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-xs uppercase tracking-wide text-text-muted">
              <th className="py-2 pr-4 font-medium">When</th>
              <th className="px-4 py-2 font-medium">Actor</th>
              <th className="px-4 py-2 font-medium">Action</th>
              <th className="px-4 py-2 font-medium">Target</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border-subtle last:border-0">
                <td className="py-2 pr-4 text-text-muted">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2 font-mono text-xs">{log.actorUid.slice(0, 10)}…</td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2 text-text-muted">
                  {log.targetType}:{log.targetId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="py-6 text-center text-sm text-text-muted">No activity yet.</p>}
      </div>
    </PedroCard>
  );
}
