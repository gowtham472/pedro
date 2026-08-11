"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Compass, TrendingUp, Sparkles } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { PedroButton, PedroCard, PedroCardEyebrow, PedroMetric, PedroProgress, PedroShell } from "@/components/pedro";
import { DOMAIN_ICON_MAP } from "@/components/pedro/icons/DomainIcons";
import { api } from "@/lib/client/api";
import { useAuth } from "@/lib/client/useAuth";
import type { DomainDefinition } from "@/types/content";
import type { DomainScore, JourneyState } from "@/types/entities";

export default function DashboardPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const [domains, setDomains] = useState<DomainDefinition[]>([]);
  const [scores, setScores] = useState<DomainScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { journey: j, onboardingCompleted } = await api.get<{ journey: JourneyState; onboardingCompleted: boolean }>(
        "/api/journey"
      );
      if (!onboardingCompleted) {
        router.replace("/onboarding");
        return;
      }
      const [{ domains: d }, { domainScores }] = await Promise.all([
        api.get<{ domains: DomainDefinition[] }>("/api/domains"),
        api.get<{ domainScores: DomainScore[] }>("/api/results"),
      ]);
      if (cancelled) return;
      setJourney(j);
      setDomains(d);
      setScores(domainScores);
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading || !journey) {
    return (
      <PedroShell>
        <div className="h-64 animate-pulse rounded-pd-lg bg-surface" />
      </PedroShell>
    );
  }

  const domainByI = new Map(domains.map((d) => [d.id, d]));
  const topScore = [...scores].sort((a, b) => b.overallScore - a.overallScore)[0];
  const topDomain = topScore ? domainByI.get(topScore.domainId) : undefined;
  const journeyComplete = Boolean(journey.completedAt);

  const radarData = domains.map((d) => ({
    domain: d.name.length > 14 ? d.name.slice(0, 12) + "…" : d.name,
    score: scores.find((s) => s.domainId === d.id)?.overallScore ?? 0,
  }));

  return (
    <PedroShell>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-text-muted">Welcome back</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{profile?.name ?? "Explorer"}</h1>
        </div>
        <PedroProgress dayStatus={journey.dayStatus} currentDay={journey.currentDay} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <PedroCard tone="mint">
          <PedroCardEyebrow className="text-pd-charcoal/60">Progress</PedroCardEyebrow>
          <div className="flex items-end justify-between gap-4">
            <PedroMetric
              value={`${Object.values(journey.dayStatus).filter((s) => s === "completed").length}/7`}
              label="Days completed"
              size="lg"
            />
            <PedroMetric value={(profile?.xp ?? 0).toLocaleString()} label="XP earned" />
          </div>
          <p className="mt-3 text-sm text-pd-charcoal/70">
            {journeyComplete ? "You've completed your seven-day exploration." : `Currently on Day ${journey.currentDay}.`}
          </p>
        </PedroCard>

        <PedroCard>
          <PedroCardEyebrow>Current step</PedroCardEyebrow>
          <div className="flex items-center gap-3">
            <Compass className="size-8 text-pd-mint" aria-hidden />
            <div>
              <p className="text-lg font-semibold">Day {Math.min(journey.currentDay, 7)}</p>
              <p className="text-sm text-text-muted">
                {domains.find((d) => d.day === journey.currentDay)?.name ??
                  (journey.currentDay === 7 ? "Independent Build" : "Ready to explore")}
              </p>
            </div>
          </div>
          <Link href={journeyComplete ? "/report" : `/day/${Math.min(journey.currentDay, 7)}`} className="mt-4 block">
            <PedroButton fullWidth>
              {journeyComplete ? "View your report" : "Continue"}
              <ArrowRight className="size-4" aria-hidden />
            </PedroButton>
          </Link>
        </PedroCard>

        <PedroCard>
          <PedroCardEyebrow>Domain signal</PedroCardEyebrow>
          {topDomain ? (
            <>
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = DOMAIN_ICON_MAP[topDomain.id];
                  return <Icon className="size-7 text-text-muted" />;
                })()}
                <PedroMetric value={topScore.overallScore} label={topDomain.name} />
              </div>
              <p className="mt-3 text-sm text-text-muted">Your strongest exploration signal so far.</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-text-muted">Complete a task to start building your profile.</p>
          )}
        </PedroCard>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <PedroCard padding="lg">
          <PedroCardEyebrow>Exploration profile</PedroCardEyebrow>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="var(--border-subtle)" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="score" stroke="var(--pd-mint)" fill="var(--pd-mint)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </PedroCard>

        <PedroCard padding="lg">
          <PedroCardEyebrow>Recent signals</PedroCardEyebrow>
          {scores.length === 0 ? (
            <p className="text-sm text-text-muted">Nothing yet - your activity will show up here.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {[...scores]
                .sort((a, b) => new Date(b.computedAt).getTime() - new Date(a.computedAt).getTime())
                .slice(0, 5)
                .map((s) => {
                  const domain = domainByI.get(s.domainId);
                  if (!domain) return null;
                  return (
                    <li key={s.domainId} className="flex items-start gap-3">
                      <TrendingUp className="mt-0.5 size-4 shrink-0 text-text-muted" aria-hidden />
                      <div>
                        <p className="text-sm font-medium">{domain.name}</p>
                        <p className="text-xs text-text-muted">{s.evidence.highlights[0]}</p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          )}
        </PedroCard>
      </div>

      {!journeyComplete && (
        <PedroCard tone="cream" padding="lg" className="mt-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Sparkles className="size-6 text-pd-charcoal/70" aria-hidden />
              <div>
                <p className="text-sm font-semibold text-pd-charcoal">Recommended next step</p>
                <p className="text-sm text-pd-charcoal/70">
                  {journey.dayStatus[journey.currentDay] === "not_started"
                    ? `Start Day ${journey.currentDay} when you're ready.`
                    : `Pick up where you left off on Day ${journey.currentDay}.`}
                </p>
              </div>
            </div>
            <Link href={`/day/${journey.currentDay}`}>
              <PedroButton variant="secondary" className="border-pd-charcoal/20 text-pd-charcoal hover:bg-pd-charcoal/10">
                Go to Day {journey.currentDay}
              </PedroButton>
            </Link>
          </div>
        </PedroCard>
      )}
    </PedroShell>
  );
}
