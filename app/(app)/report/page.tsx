"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, RefreshCw } from "lucide-react";
import { PedroButton, PedroCard, PedroCardEyebrow, PedroEmptyState, PedroPill, PedroShell } from "@/components/pedro";
import { PedroScale } from "@/components/pedro/PedroScale";
import { DOMAIN_ICON_MAP } from "@/components/pedro/icons/DomainIcons";
import { api, ApiClientError } from "@/lib/client/api";
import { useAuth } from "@/lib/client/useAuth";
import { useToast } from "@/lib/client/useToast";
import { generateReportPdf } from "@/lib/client/generateReportPdf";
import type { CareerReport } from "@/types/entities";

const DOMAIN_NAMES: Record<string, string> = {
  "software-development": "Software Development",
  "problem-solving": "Problem Solving & DSA",
  "ui-ux-design": "UI/UX Design",
  "data-analytics": "Data & Analytics",
  "cloud-devops": "Cloud & DevOps",
  cybersecurity: "Cybersecurity",
};

export default function ReportPage() {
  const { profile } = useAuth();
  const { show } = useToast();
  const [ready, setReady] = useState<boolean | null>(null);
  const [report, setReport] = useState<CareerReport | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [rating, setRating] = useState<{ accurate?: number; helpful?: number }>({});
  const [ratingSaved, setRatingSaved] = useState(false);

  async function load(refresh = false) {
    const res = await api.get<{ ready: boolean; report?: CareerReport }>(
      `/api/report${refresh ? "?refresh=true" : ""}`
    );
    setReady(res.ready);
    if (res.report) setReport(res.report);
  }

  useEffect(() => {
    let cancelled = false;
    api.get<{ ready: boolean; report?: CareerReport }>("/api/report").then((res) => {
      if (cancelled) return;
      setReady(res.ready);
      if (res.report) setReport(res.report);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await load(true);
      show("Report updated.", "success");
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't refresh.", "error");
    } finally {
      setRefreshing(false);
    }
  }

  async function submitRating() {
    if (rating.accurate === undefined || rating.helpful === undefined) return;
    try {
      await api.post("/api/report/quality", rating);
      setRatingSaved(true);
    } catch {
      show("Couldn't save your rating.", "error");
    }
  }

  if (ready === null) {
    return (
      <PedroShell>
        <div className="h-96 animate-pulse rounded-pd-lg bg-surface" />
      </PedroShell>
    );
  }

  if (!ready || !report) {
    return (
      <PedroShell>
        <PedroEmptyState
          title="Your report isn't ready yet"
          description="Complete all seven days, including your Day 7 independent build, to unlock your exploration report."
          action={
            <Link href="/journey" className="text-sm font-medium underline">
              Continue your journey
            </Link>
          }
        />
      </PedroShell>
    );
  }

  return (
    <PedroShell className="max-w-4xl">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <PedroCardEyebrow>Your exploration report</PedroCardEyebrow>
          <h1 className="text-3xl font-semibold tracking-tight">Seven days, six domains, one picture</h1>
        </div>
        <div className="flex gap-2">
          <PedroButton variant="secondary" onClick={handleRefresh} loading={refreshing}>
            <RefreshCw className="size-4" aria-hidden />
            Refresh
          </PedroButton>
          <PedroButton onClick={() => generateReportPdf(report, profile?.name ?? "Explorer")}>
            <Download className="size-4" aria-hidden />
            Export PDF
          </PedroButton>
        </div>
      </div>

      <PedroCard padding="lg">
        <p className="text-base leading-relaxed">{report.narrative.executiveSummary}</p>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{report.narrative.workingStyle}</p>
      </PedroCard>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {report.topDomains.map((d, i) => {
          const Icon = DOMAIN_ICON_MAP[d.domainId as keyof typeof DOMAIN_ICON_MAP];
          return (
            <PedroCard key={d.domainId} tone={i === 0 ? "mint" : "surface"}>
              <PedroCardEyebrow className={i === 0 ? "text-pd-charcoal/60" : undefined}>#{i + 1}</PedroCardEyebrow>
              <div className="flex items-center gap-3">
                {Icon && <Icon className="size-6" />}
                <div>
                  <p className="font-semibold">{DOMAIN_NAMES[d.domainId]}</p>
                  <p className="text-2xl font-semibold tabular-nums">{d.score}</p>
                </div>
              </div>
              <PedroPill tone={i === 0 ? "neutral" : "muted"} className="mt-2">
                {d.confidence} confidence
              </PedroPill>
            </PedroCard>
          );
        })}
      </div>

      <PedroCard padding="lg" className="mt-6">
        <PedroCardEyebrow>Why these ranked highly</PedroCardEyebrow>
        <div className="flex flex-col gap-4">
          {report.topDomains.map((d) => (
            <div key={d.domainId}>
              <p className="text-sm font-semibold">{DOMAIN_NAMES[d.domainId]}</p>
              <p className="mt-1 text-sm text-text-secondary">{report.narrative.domainNarratives[d.domainId]}</p>
            </div>
          ))}
        </div>
      </PedroCard>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <PedroCard padding="lg">
          <PedroCardEyebrow>Strength profile</PedroCardEyebrow>
          <ul className="flex flex-col gap-1.5 text-sm">
            {report.strengthProfile.map((s, i) => (
              <li key={i}>· {s}</li>
            ))}
          </ul>
        </PedroCard>
        <PedroCard padding="lg">
          <PedroCardEyebrow>Growth areas</PedroCardEyebrow>
          <ul className="flex flex-col gap-1.5 text-sm">
            {report.growthAreas.map((s, i) => (
              <li key={i}>· {s}</li>
            ))}
          </ul>
        </PedroCard>
      </div>

      <PedroCard padding="lg" className="mt-6" tone="cream">
        <PedroCardEyebrow className="text-pd-charcoal/60">Your next 30 days</PedroCardEyebrow>
        <div className="grid gap-4 sm:grid-cols-4">
          {(["primary", "secondary", "explore", "improve"] as const).map((key) => (
            <div key={key}>
              <p className="text-xs font-semibold uppercase tracking-wide text-pd-charcoal/60">{key}</p>
              <p className="mt-1 text-sm font-medium text-pd-charcoal">{report.explorationPath[key]}</p>
            </div>
          ))}
        </div>
      </PedroCard>

      <PedroCard padding="lg" className="mt-6">
        <PedroCardEyebrow>Full domain comparison</PedroCardEyebrow>
        <div className="overflow-x-auto">
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
              {report.comparison.map((s) => (
                <tr key={s.domainId} className="border-b border-border-subtle last:border-0">
                  <td className="py-3 pr-4 font-medium">{DOMAIN_NAMES[s.domainId]}</td>
                  <td className="px-4 py-3 tabular-nums">{s.performanceScore}</td>
                  <td className="px-4 py-3 tabular-nums">{s.learningScore}</td>
                  <td className="px-4 py-3 tabular-nums">{s.engagementScore}</td>
                  <td className="px-4 py-3 tabular-nums">{s.preferenceScore}</td>
                  <td className="px-4 py-3 capitalize">{s.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PedroCard>

      <PedroCard padding="lg" className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Important</p>
        <p className="mt-2 text-sm text-text-secondary">
          This report is an exploration result, not a guaranteed career prediction. You are encouraged to test
          the domain further before making a career decision.
        </p>
      </PedroCard>

      {!ratingSaved ? (
        <PedroCard padding="lg" className="mt-6">
          <PedroCardEyebrow>Quick feedback</PedroCardEyebrow>
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-2 text-sm font-medium">Did this result feel accurate?</p>
              <PedroScale
                name="accurate"
                value={rating.accurate ?? null}
                onChange={(v) => setRating((r) => ({ ...r, accurate: v }))}
                lowLabel="Not at all"
                highLabel="Very"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Did Pedro help you understand what to explore next?</p>
              <PedroScale
                name="helpful"
                value={rating.helpful ?? null}
                onChange={(v) => setRating((r) => ({ ...r, helpful: v }))}
                lowLabel="Not really"
                highLabel="Very much"
              />
            </div>
          </div>
          <PedroButton
            className="mt-5"
            onClick={submitRating}
            disabled={rating.accurate === undefined || rating.helpful === undefined}
          >
            Send feedback
          </PedroButton>
        </PedroCard>
      ) : (
        <p className="mt-6 text-center text-sm text-text-muted">Thanks for the feedback.</p>
      )}
    </PedroShell>
  );
}
