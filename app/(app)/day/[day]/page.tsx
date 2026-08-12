"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, ArrowRight, Star, Zap } from "lucide-react";
import { PedroCard, PedroCardEyebrow, PedroPill, PedroShell } from "@/components/pedro";
import { MarkdownLite } from "@/components/pedro/MarkdownLite";
import { ConceptVisual } from "@/components/visuals/registry";
import { CodeSnippetTabs } from "@/components/pedro/CodeSnippetTabs";
import { DOMAIN_ICON_MAP } from "@/components/pedro/icons/DomainIcons";
import { api, ApiClientError } from "@/lib/client/api";
import { useToast } from "@/lib/client/useToast";
import { DEFAULT_BASE_POINTS, type DomainDefinition, type LessonDefinition, type TaskDefinition } from "@/types/content";
import type { TaskAttempt } from "@/types/entities";

interface DayResponse {
  day: number;
  domain: DomainDefinition | null;
  lesson: LessonDefinition | null;
  tasks: { task: TaskDefinition; latestAttempt: TaskAttempt | null; reflected: boolean }[];
  dayStatus: string;
  day7Choice: string | null;
  recommendedDomains: string[];
}

const DOMAIN_LABELS: Record<string, string> = {
  "software-development": "Software Development",
  "problem-solving": "Problem Solving & DSA",
  "ui-ux-design": "UI/UX Design",
  "data-analytics": "Data & Analytics",
  "cloud-devops": "Cloud & DevOps",
  cybersecurity: "Cybersecurity",
};

export default function DayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day: dayParam } = use(params);
  const day = Number(dayParam);
  const router = useRouter();
  const { show } = useToast();
  const [data, setData] = useState<DayResponse | null>(null);
  const [lessonOpen, setLessonOpen] = useState(true);
  const [choosing, setChoosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await api.get<DayResponse>(`/api/journey/day/${day}`);
      setData(res);
    } catch (err) {
      if (err instanceof ApiClientError) setError(err.message);
    }
  }

  useEffect(() => {
    let cancelled = false;
    api
      .get<DayResponse>(`/api/journey/day/${day}`)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled && err instanceof ApiClientError) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [day]);

  async function chooseDomain(domainId: string) {
    setChoosing(true);
    try {
      await api.post("/api/journey/day7-choice", { domainId });
      await load();
      show("Day 7 domain set - good luck.", "success");
    } catch (err) {
      if (err instanceof ApiClientError) show(err.message, "error");
    } finally {
      setChoosing(false);
    }
  }

  if (error) {
    return (
      <PedroShell>
        <PedroCard>
          <p className="text-sm">{error}</p>
          <Link href="/journey" className="mt-3 inline-block text-sm font-medium underline">
            Back to journey
          </Link>
        </PedroCard>
      </PedroShell>
    );
  }

  if (!data) {
    return (
      <PedroShell>
        <div className="h-96 animate-pulse rounded-pd-lg bg-surface" />
      </PedroShell>
    );
  }

  const isDay7WithoutChoice = day === 7 && !data.day7Choice;

  return (
    <PedroShell className="max-w-4xl">
      <div className="mb-6">
        <PedroCardEyebrow>Day {day}</PedroCardEyebrow>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {day === 7 ? "Independent Build" : data.domain?.name}
        </h1>
        {data.domain && <p className="mt-1.5 text-sm text-text-muted">{data.domain.description}</p>}
      </div>

      {isDay7WithoutChoice && (
        <PedroCard padding="lg">
          <h2 className="text-lg font-semibold">Choose your domain</h2>
          <p className="mt-1.5 text-sm text-text-secondary">
            Based on your first six days, these stood out. You can pick any domain, not just the top three -
            this choice is itself a signal of what you want to explore further.
          </p>

          {data.recommendedDomains.length > 0 && (
            <>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-text-muted">Recommended for you</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                {data.recommendedDomains.map((id) => {
                  const Icon = DOMAIN_ICON_MAP[id as keyof typeof DOMAIN_ICON_MAP];
                  return (
                    <button key={id} onClick={() => chooseDomain(id)} disabled={choosing} className="text-left">
                      <PedroCard interactive tone="mint" padding="sm">
                        <div className="flex items-center gap-2">
                          <Star className="size-4 text-pd-charcoal/60" aria-hidden />
                          {Icon && <Icon className="size-5" />}
                        </div>
                        <p className="mt-2 text-sm font-semibold">{DOMAIN_LABELS[id]}</p>
                      </PedroCard>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-text-muted">All domains</p>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {Object.entries(DOMAIN_LABELS).map(([id, label]) => {
              const Icon = DOMAIN_ICON_MAP[id as keyof typeof DOMAIN_ICON_MAP];
              return (
                <button key={id} onClick={() => chooseDomain(id)} disabled={choosing} className="text-left">
                  <PedroCard interactive padding="sm">
                    <Icon className="size-5 text-text-muted" />
                    <p className="mt-2 text-sm font-semibold">{label}</p>
                  </PedroCard>
                </button>
              );
            })}
          </div>
        </PedroCard>
      )}

      {!isDay7WithoutChoice && (
        <>
          {data.lesson && (
            <PedroCard padding="lg" className="mb-6">
              <button
                type="button"
                onClick={() => setLessonOpen((o) => !o)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <PedroCardEyebrow>Lesson · {data.lesson.estimatedMinutes} min</PedroCardEyebrow>
                  <h2 className="text-lg font-semibold">{data.lesson.title}</h2>
                </div>
                <span className="text-sm text-text-muted">{lessonOpen ? "Collapse" : "Expand"}</span>
              </button>
              {lessonOpen && (
                <div className="mt-4 flex flex-col gap-5 border-t border-border-subtle pt-4">
                  {data.lesson.sections.map((section, i) => (
                    <div key={i}>
                      <h3 className="text-sm font-semibold">{section.heading}</h3>
                      <MarkdownLite text={section.body} />
                      <ConceptVisual id={section.visualId} />
                      {section.codeExample && <CodeSnippetTabs example={section.codeExample} />}
                    </div>
                  ))}
                </div>
              )}
            </PedroCard>
          )}

          <div className="flex flex-col gap-3">
            {(() => {
              const firstOpenIndex = data.tasks.findIndex(
                ({ latestAttempt }) => !(latestAttempt && latestAttempt.status === "passed")
              );
              return data.tasks.map(({ task, latestAttempt, reflected }, index) => {
                const passed = latestAttempt?.status === "passed";
                const done = latestAttempt && latestAttempt.status !== "in_progress";
                const readyForReflection = done && !reflected;
                const upNext = index === firstOpenIndex;
                const earnedXp = latestAttempt?.xpAward?.total;
                const potentialXp = task.basePoints ?? DEFAULT_BASE_POINTS[task.difficulty];
                return (
                  <PedroCard
                    key={task.id}
                    interactive
                    onClick={() => router.push(`/task/${task.id}`)}
                    className={upNext ? "ring-2 ring-pd-mint" : undefined}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {passed ? (
                          <CheckCircle2 className="size-6 shrink-0 text-pd-mint" aria-hidden />
                        ) : (
                          <span
                            className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border-subtle text-xs font-semibold text-text-muted"
                            aria-hidden
                          >
                            {index + 1}
                          </span>
                        )}
                        <div>
                          <p className="text-sm font-semibold">{task.title}</p>
                          <p className="text-xs text-text-muted">{task.description}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {upNext && <PedroPill tone="mint">Up next</PedroPill>}
                        <PedroPill tone="muted" icon={<Clock className="size-3" aria-hidden />}>
                          {task.estimatedMinutes} min
                        </PedroPill>
                        {passed && earnedXp ? (
                          <PedroPill tone="cream" icon={<Zap className="size-3" aria-hidden />}>
                            +{earnedXp} XP
                          </PedroPill>
                        ) : (
                          <PedroPill tone="muted" icon={<Zap className="size-3" aria-hidden />}>
                            {potentialXp}+ XP
                          </PedroPill>
                        )}
                        {readyForReflection && <PedroPill tone="mint">Reflect</PedroPill>}
                        <ArrowRight className="size-4 text-text-muted" aria-hidden />
                      </div>
                    </div>
                  </PedroCard>
                );
              });
            })()}
          </div>
        </>
      )}
    </PedroShell>
  );
}
