"use client";

import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Compass,
  ExternalLink,
  Flag,
  Info,
  MapPin,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import clsx from "clsx";
import { PedroButton, PedroCard, PedroCardEyebrow, PedroPill, PedroShell } from "@/components/pedro";
import { DOMAIN_ICON_MAP } from "@/components/pedro/icons/DomainIcons";
import { TechLogo, hasTechLogo } from "@/components/paths/TechLogo";
import { CAREER_MAPS, getCareerMap } from "@/lib/content/careerPaths";
import type { DomainId } from "@/types/content";
import type { PathChoice, PathOutcome, PathStage } from "@/types/paths";
import { useState } from "react";

const DOMAIN_LABELS: Record<DomainId, string> = {
  "software-development": "Software Development",
  "problem-solving": "Problem Solving & DSA",
  "ui-ux-design": "UI / UX Design",
  "data-analytics": "Data & Analytics",
  "cloud-devops": "Cloud & DevOps",
  cybersecurity: "Cybersecurity",
};

const STORAGE_KEY = "pedro-career-path";

/** Walk the tree following a list of choice ids; returns the resolved chain. */
function resolvePath(root: PathStage, choiceIds: string[]): PathChoice[] {
  const chain: PathChoice[] = [];
  let stage: PathStage | undefined = root;
  for (const id of choiceIds) {
    if (!stage) break;
    const choice: PathChoice | undefined = stage.choices.find((c) => c.id === id);
    if (!choice) break;
    chain.push(choice);
    stage = choice.next;
  }
  return chain;
}

interface PathState {
  domainId: DomainId | null;
  choiceIds: string[];
}

// The saved path lives in localStorage - a genuine external store, modeled
// the same way the app models theme (useSyncExternalStore).
const EMPTY_STATE: PathState = { domainId: null, choiceIds: [] };
let pathCache: PathState | null = null;
const pathListeners = new Set<() => void>();

function readStoredPath(): PathState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PathState;
      if (parsed.domainId && getCareerMap(parsed.domainId)) {
        return { domainId: parsed.domainId, choiceIds: Array.isArray(parsed.choiceIds) ? parsed.choiceIds : [] };
      }
    }
  } catch {
    /* ignore malformed storage */
  }
  return EMPTY_STATE;
}

function getPathSnapshot(): PathState {
  if (pathCache === null) pathCache = readStoredPath();
  return pathCache;
}

function getServerPathSnapshot(): PathState {
  return EMPTY_STATE;
}

function subscribePath(callback: () => void) {
  pathListeners.add(callback);
  return () => {
    pathListeners.delete(callback);
  };
}

function writePathState(next: PathState) {
  pathCache = next;
  if (next.domainId) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  pathListeners.forEach((l) => l());
}

export function PathExplorer() {
  const searchParams = useSearchParams();
  const { domainId, choiceIds } = useSyncExternalStore(subscribePath, getPathSnapshot, getServerPathSnapshot);

  // Honor a ?domain= deep link (e.g. from the results page) once after mount.
  useEffect(() => {
    const paramDomain = searchParams.get("domain") as DomainId | null;
    if (paramDomain && getCareerMap(paramDomain) && paramDomain !== getPathSnapshot().domainId) {
      writePathState({ domainId: paramDomain, choiceIds: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const map = domainId ? getCareerMap(domainId) : undefined;
  const chain = useMemo(() => (map ? resolvePath(map.root, choiceIds) : []), [map, choiceIds]);

  const last = chain[chain.length - 1];
  const outcome: PathOutcome | undefined = last?.outcome;
  const currentStage: PathStage | undefined = chain.length === 0 ? map?.root : last?.next;

  const choose = useCallback((choiceId: string) => {
    const s = getPathSnapshot();
    writePathState({ ...s, choiceIds: [...s.choiceIds, choiceId] });
  }, []);

  const jumpTo = useCallback((count: number) => {
    const s = getPathSnapshot();
    writePathState({ ...s, choiceIds: s.choiceIds.slice(0, count) });
  }, []);

  const stepBack = useCallback(() => {
    const s = getPathSnapshot();
    writePathState({ ...s, choiceIds: s.choiceIds.slice(0, -1) });
  }, []);

  const restart = useCallback(() => {
    const s = getPathSnapshot();
    writePathState({ ...s, choiceIds: [] });
  }, []);

  const enterDomain = useCallback((next: DomainId) => writePathState({ domainId: next, choiceIds: [] }), []);
  const leaveDomain = useCallback(() => writePathState({ domainId: null, choiceIds: [] }), []);

  if (!map) {
    return <DomainPicker onPick={enterDomain} />;
  }

  const Icon = DOMAIN_ICON_MAP[map.domainId];

  return (
    <PedroShell className="max-w-4xl">
      {/* header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={leaveDomain}
          className="inline-flex min-h-9 items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          All domains
        </button>
        {chain.length > 0 && (
          <div className="flex items-center gap-2">
            <PedroButton variant="tertiary" size="sm" onClick={stepBack}>
              <ArrowLeft className="size-3.5" aria-hidden />
              Back a step
            </PedroButton>
            <PedroButton variant="tertiary" size="sm" onClick={restart}>
              <RotateCcw className="size-3.5" aria-hidden />
              Restart
            </PedroButton>
          </div>
        )}
      </div>

      {/* domain title */}
      <div className="mt-5 flex items-center gap-4">
        <span className="flex size-13 shrink-0 items-center justify-center rounded-pd-md bg-pd-mint/25 p-3">
          <Icon className="size-7 text-foreground" />
        </span>
        <div>
          <PedroCardEyebrow className="mb-0.5">Career path builder</PedroCardEyebrow>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{DOMAIN_LABELS[map.domainId]}</h1>
        </div>
      </div>

      {/* the journey so far - a horizontal striped road with collected stops */}
      <JourneyTrail chain={chain} atDestination={Boolean(outcome)} onJumpTo={jumpTo} />

      {chain.length === 0 && (
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-text-secondary">{map.intro}</p>
      )}

      {/* domain tech map */}
      <TechStrip map={map} />

      <div className="mt-10">
        {currentStage && <DecisionPoint stage={currentStage} onChoose={choose} />}
        {outcome && <OutcomeSection outcome={outcome} onRestart={restart} onLeaveDomain={leaveDomain} />}
      </div>
    </PedroShell>
  );
}

// ---------------------------------------------------------------------------
// Domain picker
// ---------------------------------------------------------------------------

function DomainPicker({ onPick }: { onPick: (id: DomainId) => void }) {
  return (
    <PedroShell>
      <PedroCardEyebrow className="flex items-center gap-1.5">
        <Compass className="size-3.5" aria-hidden />
        Career paths
      </PedroCardEyebrow>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Map a path through any domain</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
        Build a career path decision by decision - the same technology choices real developers make. Every path ends at
        a concrete role with a step-by-step roadmap and resources to learn it all.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAREER_MAPS.map((m, i) => {
          const Icon = DOMAIN_ICON_MAP[m.domainId];
          return (
            <button
              key={m.domainId}
              type="button"
              onClick={() => onPick(m.domainId)}
              className="animate-node-in group text-left"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <PedroCard interactive className="flex h-full flex-col">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-pd-sm bg-pd-mint/25">
                    <Icon className="size-6 text-foreground" />
                  </span>
                  <p className="font-semibold leading-snug">{DOMAIN_LABELS[m.domainId]}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {m.techMap.slice(0, 6).map((t, ti) =>
                    hasTechLogo(t.id) ? <TechLogo key={`${t.id}-${ti}`} id={t.id} size={30} /> : null
                  )}
                </div>
                <p className="mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-foreground">
                  Start building
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </p>
              </PedroCard>
            </button>
          );
        })}
      </div>
    </PedroShell>
  );
}

// ---------------------------------------------------------------------------
// The journey trail: a horizontal striped road flowing left to right.
// Collected choices sit on the line as stops; the newest segment's stripes
// march forward as you travel. Scrolls horizontally when it outgrows the
// card, and clicking any stop jumps back to that decision.
// ---------------------------------------------------------------------------

const SEG_W = 170; // px between stops
const TRAIL_PAD = 56; // px before the start pin / after the head marker
const TRAIL_H = 128; // svg band height

function trailPoint(i: number): { x: number; y: number } {
  return { x: TRAIL_PAD + i * SEG_W, y: i % 2 === 0 ? 46 : 88 };
}

function trailSegmentD(i: number): string {
  const a = trailPoint(i);
  const b = trailPoint(i + 1);
  // Horizontal tangents at both ends: a smooth, even wave with no kinks.
  const cx = SEG_W * 0.55;
  return `M ${a.x} ${a.y} C ${a.x + cx} ${a.y}, ${b.x - cx} ${b.y}, ${b.x} ${b.y}`;
}

function JourneyTrail({
  chain,
  atDestination,
  onJumpTo,
}: {
  chain: PathChoice[];
  atDestination: boolean;
  onJumpTo: (count: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Follow the road: keep the newest stop in view as the journey grows.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
  }, [chain.length]);

  const pointCount = chain.length + 2; // start pin + stops + head marker
  const width = TRAIL_PAD * 2 + (pointCount - 1) * SEG_W;
  const head = trailPoint(pointCount - 1);

  return (
    <PedroCard className="mt-6" padding="md">
      <PedroCardEyebrow>Your journey</PedroCardEyebrow>
      <div ref={scrollRef} className="scrollbar-thin -mx-2 overflow-x-auto px-2">
        <div className="relative" style={{ width, height: TRAIL_H + 34 }}>
          <svg
            width={width}
            height={TRAIL_H}
            viewBox={`0 0 ${width} ${TRAIL_H}`}
            className="absolute left-0 top-0"
            aria-hidden
          >
            {Array.from({ length: pointCount - 1 }, (_, i) => {
              const newest = i === pointCount - 2;
              return (
                <g key={i}>
                  {/* the road bed */}
                  <path d={trailSegmentD(i)} fill="none" stroke="var(--border-subtle)" strokeWidth="10" strokeLinecap="round" />
                  {/* the striped centre line */}
                  <path
                    d={trailSegmentD(i)}
                    fill="none"
                    stroke="var(--pd-mint-strong)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="11 8"
                    className={newest ? "animate-stripe" : undefined}
                  />
                </g>
              );
            })}
          </svg>

          {/* start pin */}
          <TrailMarker point={trailPoint(0)} label="Start">
            <span className="flex size-10 items-center justify-center rounded-full bg-pd-charcoal text-pd-soft-white shadow-pd-sm dark:bg-pd-soft-white dark:text-pd-charcoal">
              <MapPin className="size-5" aria-hidden />
            </span>
          </TrailMarker>

          {/* collected stops */}
          {chain.map((choice, i) => {
            const p = trailPoint(i + 1);
            return (
              <TrailMarker key={`${choice.id}-${i}`} point={p} label={choice.label}>
                <button
                  type="button"
                  onClick={() => onJumpTo(i + 1)}
                  title={`Jump back to: ${choice.label}`}
                  className={clsx(
                    "block rounded-full ring-2 ring-pd-mint transition-transform hover:scale-105",
                    i === chain.length - 1 && "animate-collect"
                  )}
                >
                  {choice.tech && hasTechLogo(choice.tech.id) ? (
                    <TechLogo id={choice.tech.id} size={40} shape="circle" />
                  ) : (
                    <span className="flex size-10 items-center justify-center rounded-full bg-pd-mint text-sm font-bold text-pd-charcoal">
                      {i + 1}
                    </span>
                  )}
                </button>
              </TrailMarker>
            );
          })}

          {/* head of the trail: next decision, or the destination flag */}
          <TrailMarker point={head} label={atDestination ? "Destination" : "Next decision"}>
            <span
              className={clsx(
                "animate-collect flex size-10 items-center justify-center rounded-full shadow-pd-sm",
                atDestination ? "bg-pd-mint text-pd-charcoal" : "bg-pd-cream text-pd-charcoal"
              )}
            >
              {atDestination ? <Flag className="size-5" aria-hidden /> : <Compass className="size-5" aria-hidden />}
            </span>
          </TrailMarker>
        </div>
      </div>
    </PedroCard>
  );
}

/** Positions a badge on the road with its caption underneath. */
function TrailMarker({ point, label, children }: { point: { x: number; y: number }; label: string; children: React.ReactNode }) {
  return (
    <div className="absolute flex w-32 flex-col items-center" style={{ left: point.x - 64, top: point.y - 20 }}>
      {children}
      <span className="mt-1.5 max-w-full truncate text-center text-xs font-medium text-text-secondary">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Domain tech strip
// ---------------------------------------------------------------------------

function TechStrip({ map }: { map: (typeof CAREER_MAPS)[number] }) {
  return (
    <PedroCard className="mt-6" padding="md">
      <PedroCardEyebrow>Technologies that live in this domain</PedroCardEyebrow>
      <div className="mt-1 flex flex-wrap gap-2.5">
        {map.techMap.map((t, i) => (
          <span
            key={`${t.id}-${i}`}
            className="animate-map-pin flex min-h-10 items-center gap-2.5 rounded-pd-pill border border-border-subtle bg-surface-elevated py-1.5 pl-1.5 pr-3.5"
            style={{ animationDelay: `${Math.min(i * 40, 500)}ms` }}
          >
            {hasTechLogo(t.id) ? (
              <TechLogo id={t.id} size={28} shape="circle" />
            ) : (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pd-graphite text-[10px] font-bold text-white">
                {t.name.slice(0, 2)}
              </span>
            )}
            <span className="text-xs font-medium">{t.name}</span>
          </span>
        ))}
      </div>
    </PedroCard>
  );
}

/** The live decision point below the trail. */
function DecisionPoint({ stage, onChoose }: { stage: PathStage; onChoose: (id: string) => void }) {
  return (
    <div className="animate-node-in" style={{ animationDelay: "250ms" }}>
      <div className="mx-auto max-w-xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-pd-pill bg-pd-cream px-3.5 py-1.5 text-xs font-semibold text-pd-charcoal">
          <Compass className="size-3.5" aria-hidden />
          Next decision
        </span>
        <h2 className="mt-3 text-xl font-semibold tracking-tight">{stage.question}</h2>
        {stage.hint && <p className="mt-1.5 text-sm text-text-muted">{stage.hint}</p>}
      </div>

      <div className={clsx("mt-6 grid gap-4", stage.choices.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
        {stage.choices.map((choice, i) => (
          <ChoiceCard key={choice.id} choice={choice} index={i} onChoose={onChoose} />
        ))}
      </div>
    </div>
  );
}

function ChoiceCard({ choice, index, onChoose }: { choice: PathChoice; index: number; onChoose: (id: string) => void }) {
  const [showWhat, setShowWhat] = useState(false);
  const leadsToOutcome = Boolean(choice.outcome);
  return (
    <div className="animate-node-in" style={{ animationDelay: `${300 + index * 90}ms` }}>
      <PedroCard interactive={false} className="flex h-full flex-col" padding="md">
        <div className="flex items-start gap-3.5">
          {choice.tech && hasTechLogo(choice.tech.id) ? (
            <TechLogo id={choice.tech.id} size={44} />
          ) : (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-pd-mint/25 text-base font-bold">
              {choice.label.slice(0, 1)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold leading-snug">{choice.label}</p>
            <p className="mt-1 text-sm leading-snug text-text-secondary">{choice.tagline}</p>
          </div>
        </div>

        {choice.whatIsIt && (
          <div className="mt-3.5">
            <button
              type="button"
              onClick={() => setShowWhat((v) => !v)}
              className="inline-flex min-h-8 items-center gap-1.5 text-xs font-medium text-text-muted transition-colors hover:text-foreground"
            >
              <Info className="size-3.5" aria-hidden />
              {showWhat ? "Hide" : "What is this, really?"}
            </button>
            {showWhat && (
              <p className="animate-xp-rise mt-2 rounded-pd-sm bg-surface-elevated p-3 text-sm leading-relaxed text-text-secondary">
                {choice.whatIsIt}
              </p>
            )}
          </div>
        )}

        <div className="mt-auto pt-4">
          <PedroButton size="sm" className="w-full" onClick={() => onChoose(choice.id)}>
            {leadsToOutcome ? "Travel here" : "Take this road"}
            <ArrowRight className="size-4" aria-hidden />
          </PedroButton>
        </div>
      </PedroCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Destination
// ---------------------------------------------------------------------------

function OutcomeSection({
  outcome,
  onRestart,
  onLeaveDomain,
}: {
  outcome: PathOutcome;
  onRestart: () => void;
  onLeaveDomain: () => void;
}) {
  return (
    <div className="animate-node-in" style={{ animationDelay: "250ms" }}>
      <div className="mb-5 flex justify-center">
        <span className="animate-collect inline-flex items-center gap-2 rounded-pd-pill bg-pd-mint px-5 py-2.5 text-sm font-semibold text-pd-charcoal shadow-pd-sm">
          <Flag className="size-4" aria-hidden />
          Destination reached
        </span>
      </div>

      <PedroCard padding="lg" tone="mint">
        <PedroCardEyebrow className="text-pd-charcoal/60">Career destination</PedroCardEyebrow>
        <h2 className="text-2xl font-semibold tracking-tight">{outcome.role}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-pd-charcoal/85">{outcome.summary}</p>

        <div className="mt-5 flex items-start gap-2.5 rounded-pd-md bg-pd-charcoal/10 p-4">
          <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p className="text-sm leading-relaxed text-pd-charcoal/90">
            <span className="font-semibold">Why this path holds together: </span>
            {outcome.whyThisFits}
          </p>
        </div>

        {outcome.demandNote && (
          <p className="mt-3 text-xs font-medium text-pd-charcoal/70">{outcome.demandNote}</p>
        )}

        <div className="mt-6">
          <PedroCardEyebrow className="text-pd-charcoal/60">Core technologies</PedroCardEyebrow>
          <div className="mt-1 flex flex-wrap gap-2.5">
            {outcome.coreTech.map((t, i) => (
              <span
                key={`${t.id}-${i}`}
                className="animate-map-pin flex min-h-10 items-center gap-2.5 rounded-pd-pill bg-white/80 py-1.5 pl-1.5 pr-3.5"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {hasTechLogo(t.id) ? (
                  <TechLogo id={t.id} size={28} shape="circle" />
                ) : (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pd-graphite text-[10px] font-bold text-white">
                    {t.name.slice(0, 2)}
                  </span>
                )}
                <span className="text-xs font-semibold text-pd-charcoal">{t.name}</span>
              </span>
            ))}
          </div>
        </div>
      </PedroCard>

      <PedroCard padding="lg" className="mt-5">
        <PedroCardEyebrow>Your learning roadmap</PedroCardEyebrow>
        <ol className="mt-3 flex flex-col">
          {outcome.roadmap.map((step, i) => (
            <li key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pd-mint text-sm font-bold text-pd-charcoal">
                  {i + 1}
                </span>
                {i < outcome.roadmap.length - 1 && <span className="my-1 w-0.5 flex-1 rounded bg-border-subtle" />}
              </div>
              <div className={i < outcome.roadmap.length - 1 ? "pb-6" : ""}>
                <p className="font-semibold leading-snug">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </PedroCard>

      <PedroCard padding="lg" className="mt-5">
        <PedroCardEyebrow>Resources to learn it all</PedroCardEyebrow>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {outcome.resources.map((r, i) => (
            <li key={i}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full items-start gap-3 rounded-pd-md border border-border-subtle p-3.5 transition-colors hover:bg-surface-elevated"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-pd-sm bg-pd-mint/20">
                  <BookOpen className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <span className="truncate">{r.label}</span>
                    <ExternalLink className="size-3 shrink-0 text-text-muted" aria-hidden />
                  </span>
                  <span className="mt-1.5 flex items-center gap-1.5">
                    <PedroPill tone="neutral">{r.kind}</PedroPill>
                    {r.free ? <PedroPill tone="mint">Free</PedroPill> : <PedroPill tone="muted">Paid</PedroPill>}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </PedroCard>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <PedroButton variant="secondary" onClick={onRestart}>
          <RotateCcw className="size-4" aria-hidden />
          Explore another branch
        </PedroButton>
        <PedroButton variant="tertiary" onClick={onLeaveDomain}>
          <Compass className="size-4" aria-hidden />
          Try another domain
        </PedroButton>
        <Link href="/results" className="text-sm font-medium text-text-secondary underline hover:text-foreground">
          See which domains fit you
        </Link>
      </div>
    </div>
  );
}
