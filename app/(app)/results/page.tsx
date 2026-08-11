"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { PedroCard, PedroCardEyebrow, PedroEmptyState, PedroPill, PedroShell } from "@/components/pedro";
import { DOMAIN_ICON_MAP } from "@/components/pedro/icons/DomainIcons";
import { api } from "@/lib/client/api";
import type { DomainDefinition } from "@/types/content";
import type { DomainScore } from "@/types/entities";

const CONFIDENCE_TONE = { low: "muted", medium: "cyan", high: "mint" } as const;

export default function ResultsPage() {
  const [domains, setDomains] = useState<DomainDefinition[]>([]);
  const [scores, setScores] = useState<DomainScore[]>([]);
  const [day7Choice, setDay7Choice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ domains: DomainDefinition[] }>("/api/domains"),
      api.get<{ domainScores: DomainScore[]; day7Choice: string | null }>("/api/results"),
    ]).then(([d, r]) => {
      setDomains(d.domains);
      setScores(r.domainScores);
      setDay7Choice(r.day7Choice);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <PedroShell>
        <div className="h-96 animate-pulse rounded-pd-lg bg-surface" />
      </PedroShell>
    );
  }

  const domainByI = new Map(domains.map((d) => [d.id, d]));
  const sorted = [...scores].sort((a, b) => b.overallScore - a.overallScore);

  return (
    <PedroShell>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your results so far</h1>
      <p className="mt-1.5 text-sm text-text-muted">
        Updates as you complete tasks. Not a final verdict - an evolving picture of what fits.
      </p>

      {sorted.length === 0 ? (
        <PedroEmptyState
          title="No exploration data yet"
          description="Complete your first task to start building your profile."
          action={
            <Link href="/journey" className="text-sm font-medium underline">
              Go to your journey
            </Link>
          }
        />
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((s, i) => {
              const domain = domainByI.get(s.domainId);
              if (!domain) return null;
              const Icon = DOMAIN_ICON_MAP[domain.id];
              return (
                <PedroCard key={s.domainId}>
                  <div className="flex items-start justify-between">
                    <PedroCardEyebrow>#{i + 1} exploration signal</PedroCardEyebrow>
                    {day7Choice === s.domainId && <Star className="size-4 text-pd-cream" aria-hidden />}
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon className="size-6 text-text-muted" />
                    <div>
                      <p className="text-lg font-semibold">{domain.name}</p>
                      <p className="text-2xl font-semibold tabular-nums">{s.overallScore}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <PedroPill tone={CONFIDENCE_TONE[s.confidence]}>{s.confidence} confidence</PedroPill>
                    <span className="text-xs text-text-muted">
                      {s.evidence.tasksCompleted}/{s.evidence.tasksTotal} tasks
                    </span>
                  </div>
                  <ul className="mt-3 flex flex-col gap-1">
                    {s.evidence.highlights.slice(0, 2).map((h, hi) => (
                      <li key={hi} className="text-xs text-text-muted">
                        · {h}
                      </li>
                    ))}
                  </ul>
                </PedroCard>
              );
            })}
          </div>

          <PedroCard padding="lg" className="mt-6 overflow-x-auto">
            <PedroCardEyebrow>Domain comparison</PedroCardEyebrow>
            <table className="mt-2 w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-xs uppercase tracking-wide text-text-muted">
                  <th className="py-2 pr-4 font-medium">Domain</th>
                  <th className="px-4 py-2 font-medium">Performance</th>
                  <th className="px-4 py-2 font-medium">Learning</th>
                  <th className="px-4 py-2 font-medium">Engagement</th>
                  <th className="px-4 py-2 font-medium">Preference</th>
                  <th className="px-4 py-2 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => {
                  const domain = domainByI.get(s.domainId);
                  return (
                    <tr key={s.domainId} className="border-b border-border-subtle last:border-0">
                      <td className="py-3 pr-4 font-medium">{domain?.name}</td>
                      <td className="px-4 py-3 tabular-nums">{s.performanceScore}</td>
                      <td className="px-4 py-3 tabular-nums">{s.learningScore}</td>
                      <td className="px-4 py-3 tabular-nums">{s.engagementScore}</td>
                      <td className="px-4 py-3 tabular-nums">{s.preferenceScore}</td>
                      <td className="px-4 py-3 capitalize">{s.confidence}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </PedroCard>
        </>
      )}
    </PedroShell>
  );
}
