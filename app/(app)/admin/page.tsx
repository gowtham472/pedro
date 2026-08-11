"use client";

import { useEffect, useState } from "react";
import { PedroCard, PedroCardEyebrow, PedroMetric } from "@/components/pedro";
import { api } from "@/lib/client/api";
import type { AdminAnalyticsSummary } from "@/lib/server/dal/adminAnalytics";

export default function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState<AdminAnalyticsSummary | null>(null);

  useEffect(() => {
    api.get<{ analytics: AdminAnalyticsSummary }>("/api/admin/analytics").then((res) => setAnalytics(res.analytics));
  }, []);

  if (!analytics) return <div className="h-64 animate-pulse rounded-pd-lg bg-surface" />;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PedroCard>
          <PedroMetric value={analytics.totalUsers} label="Total users" />
        </PedroCard>
        <PedroCard>
          <PedroMetric value={analytics.onboardedUsers} label="Completed onboarding" />
        </PedroCard>
        <PedroCard>
          <PedroMetric value={analytics.journeysCompleted} label="Journeys completed" />
        </PedroCard>
        <PedroCard>
          <PedroMetric value={`${analytics.reflectionCompletionRate}%`} label="Reflection completion" />
        </PedroCard>
      </div>

      <PedroCard padding="lg">
        <PedroCardEyebrow>Day-by-day funnel</PedroCardEyebrow>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-xs uppercase tracking-wide text-text-muted">
                <th className="py-2 pr-4 font-medium">Day</th>
                <th className="px-4 py-2 font-medium">Locked</th>
                <th className="px-4 py-2 font-medium">Not started</th>
                <th className="px-4 py-2 font-medium">In progress</th>
                <th className="px-4 py-2 font-medium">Completed</th>
              </tr>
            </thead>
            <tbody>
              {analytics.dayFunnel.map((row) => (
                <tr key={row.day} className="border-b border-border-subtle last:border-0">
                  <td className="py-2 pr-4 font-medium">Day {row.day}</td>
                  <td className="px-4 py-2 tabular-nums text-text-muted">{row.locked}</td>
                  <td className="px-4 py-2 tabular-nums text-text-muted">{row.notStarted}</td>
                  <td className="px-4 py-2 tabular-nums">{row.inProgress}</td>
                  <td className="px-4 py-2 tabular-nums font-medium">{row.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PedroCard>

      <PedroCard padding="lg">
        <PedroCardEyebrow>Task performance</PedroCardEyebrow>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-xs uppercase tracking-wide text-text-muted">
                <th className="py-2 pr-4 font-medium">Task</th>
                <th className="px-4 py-2 font-medium">Day</th>
                <th className="px-4 py-2 font-medium">Attempted</th>
                <th className="px-4 py-2 font-medium">Pass rate</th>
                <th className="px-4 py-2 font-medium">Avg score</th>
                <th className="px-4 py-2 font-medium">Avg attempts</th>
              </tr>
            </thead>
            <tbody>
              {analytics.taskStats.map((t) => (
                <tr key={t.taskId} className="border-b border-border-subtle last:border-0">
                  <td className="py-2 pr-4 font-medium">{t.title}</td>
                  <td className="px-4 py-2 tabular-nums text-text-muted">{t.day}</td>
                  <td className="px-4 py-2 tabular-nums">{t.studentsAttempted}</td>
                  <td className="px-4 py-2 tabular-nums">{t.passRate}%</td>
                  <td className="px-4 py-2 tabular-nums">{t.avgScore}</td>
                  <td className="px-4 py-2 tabular-nums">{t.avgAttempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PedroCard>
    </div>
  );
}
