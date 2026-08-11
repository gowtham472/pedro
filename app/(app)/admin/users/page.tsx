"use client";

import { useEffect, useState } from "react";
import { PedroButton, PedroCard, PedroCardEyebrow, PedroPill } from "@/components/pedro";
import { api, ApiClientError } from "@/lib/client/api";
import { useToast } from "@/lib/client/useToast";
import type { UserProfile } from "@/types/entities";

type AdminUserRow = Pick<UserProfile, "uid" | "email" | "name" | "createdAt" | "status" | "role" | "onboardingCompleted">;

export default function AdminUsersPage() {
  const { show } = useToast();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await api.get<{ users: AdminUserRow[] }>("/api/admin/users");
    setUsers(res.users);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    api.get<{ users: AdminUserRow[] }>("/api/admin/users").then((res) => {
      if (cancelled) return;
      setUsers(res.users);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleRole(user: AdminUserRow) {
    const nextRole = user.role === "admin" ? "user" : "admin";
    if (!confirm(`Change ${user.email} to ${nextRole}?`)) return;
    try {
      await api.patch(`/api/admin/users/${user.uid}`, { role: nextRole });
      show("Role updated.", "success");
      await load();
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't update role.", "error");
    }
  }

  if (loading) return <div className="h-64 animate-pulse rounded-pd-lg bg-surface" />;

  return (
    <PedroCard padding="lg">
      <PedroCardEyebrow>Users ({users.length})</PedroCardEyebrow>
      <p className="mb-3 text-xs text-text-muted">
        Aggregate progress only — no raw telemetry is exposed here (see the audit log for admin actions).
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-xs uppercase tracking-wide text-text-muted">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Onboarded</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Joined</th>
              <th className="px-4 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.uid} className="border-b border-border-subtle last:border-0">
                <td className="py-2 pr-4 font-medium">{u.name}</td>
                <td className="px-4 py-2 text-text-muted">{u.email}</td>
                <td className="px-4 py-2">{u.onboardingCompleted ? "Yes" : "No"}</td>
                <td className="px-4 py-2">
                  <PedroPill tone={u.role === "admin" ? "mint" : "muted"}>{u.role}</PedroPill>
                </td>
                <td className="px-4 py-2 text-text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <PedroButton size="sm" variant="tertiary" onClick={() => toggleRole(u)}>
                    Make {u.role === "admin" ? "user" : "admin"}
                  </PedroButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PedroCard>
  );
}
