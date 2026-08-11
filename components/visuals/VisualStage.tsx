"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import clsx from "clsx";

// ---------------------------------------------------------------------------
// The shared animation stage every concept visual runs on.
//
// Design language borrowed from 3Blue1Brown: a fixed dark stage (independent
// of app theme, so accents always pop), concepts built up step by step, and
// smooth eased motion between steps. Each visual declares an ordered list of
// captions; the stage owns the step state machine, playback controls,
// autoplay-on-first-view, and reduced-motion handling. The visual itself is
// just a pure function of the current step.
// ---------------------------------------------------------------------------

/** Fixed stage palette (Pedro dark tokens) - visuals import this. */
export const V = {
  bg: "#242424",
  panel: "#2b2b2b",
  panelLight: "#333333",
  stroke: "#454545",
  text: "#f7f8f4",
  muted: "#a9aaa5",
  faint: "#6b6c68",
  mint: "#c3dcb4",
  cyan: "#bfefff",
  cream: "#fff3b5",
  red: "#f2a09b",
} as const;

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

interface VisualStageProps {
  title: string;
  captions: string[];
  /** ms per step during autoplay */
  autoMs?: number;
  viewBox?: string;
  children: (step: number) => React.ReactNode;
}

export function VisualStage({ title, captions, autoMs = 3000, viewBox = "0 0 640 250", children }: VisualStageProps) {
  const steps = captions.length;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoStartedRef = useRef(false);

  // Autoplay once when the visual first scrolls into view (unless the user
  // prefers reduced motion - then it stays manual).
  useEffect(() => {
    const el = containerRef.current;
    if (!el || autoStartedRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !autoStartedRef.current) {
          autoStartedRef.current = true;
          setPlaying(true);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const atEnd = step >= steps - 1;
  // "playing" is the user's intent; the interval only actually runs while
  // there are steps left, so reaching the end pauses without extra state.
  const running = playing && !atEnd;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps - 1)), autoMs);
    return () => clearInterval(id);
  }, [running, steps, autoMs]);

  return (
    <div
      ref={containerRef}
      className="my-4 overflow-hidden rounded-pd-md border border-black/30"
      style={{ background: V.bg }}
    >
      <div className="flex items-center justify-between gap-2 px-4 pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: V.muted }}>
          Visual · {title}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous step"
            disabled={step === 0}
            onClick={() => {
              setPlaying(false);
              setStep((s) => Math.max(0, s - 1));
            }}
            className="flex size-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={atEnd ? "Replay" : running ? "Pause" : "Play"}
            onClick={() => {
              if (atEnd) {
                setStep(0);
                setPlaying(true);
              } else {
                setPlaying((p) => !p);
              }
            }}
            className="flex size-7 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
          >
            {atEnd ? (
              <RotateCcw className="size-4" aria-hidden />
            ) : running ? (
              <Pause className="size-4" aria-hidden />
            ) : (
              <Play className="size-4" aria-hidden />
            )}
          </button>
          <button
            type="button"
            aria-label="Next step"
            disabled={atEnd}
            onClick={() => {
              setPlaying(false);
              setStep((s) => Math.min(steps - 1, s + 1));
            }}
            className="flex size-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10 disabled:opacity-30"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <svg viewBox={viewBox} className="block w-full" role="img" aria-label={`${title}: ${captions[step]}`}>
        {children(step)}
      </svg>

      <div className="flex items-center justify-between gap-3 px-4 pb-3">
        <p key={step} className="min-h-10 text-sm leading-snug animate-xp-rise" style={{ color: V.text }}>
          {captions[step]}
        </p>
        <div className="flex shrink-0 items-center gap-1.5" role="tablist" aria-label="Steps">
          {captions.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Step ${i + 1}`}
              onClick={() => {
                setPlaying(false);
                setStep(i);
              }}
              className={clsx("size-2 rounded-full transition-colors")}
              style={{ background: i === step ? V.mint : i < step ? V.faint : "#3a3a3a" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Animated SVG primitives. Everything positions via CSS transform on <g> so
// moves and fades tween smoothly between steps.
// ---------------------------------------------------------------------------

interface GProps {
  x?: number;
  y?: number;
  o?: number;
  scale?: number;
  children: React.ReactNode;
}

/** Animated group: position, opacity and scale transition between steps. */
export function G({ x = 0, y = 0, o = 1, scale = 1, children }: GProps) {
  return (
    <g
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        opacity: o,
        transition: `transform 0.8s ${EASE}, opacity 0.55s ease`,
      }}
    >
      {children}
    </g>
  );
}

interface BoxProps {
  w: number;
  h: number;
  fill?: string;
  stroke?: string;
  dashed?: boolean;
  r?: number;
  label?: string;
  labelColor?: string;
  fontSize?: number;
  mono?: boolean;
}

/** Rounded rectangle with centered label, positioned by a parent <G>. */
export function Box({
  w,
  h,
  fill = V.panel,
  stroke = V.stroke,
  dashed = false,
  r = 10,
  label,
  labelColor = V.text,
  fontSize = 14,
  mono = false,
}: BoxProps) {
  return (
    <>
      <rect
        width={w}
        height={h}
        rx={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.5}
        strokeDasharray={dashed ? "5 4" : undefined}
        style={{ transition: `fill 0.5s ease, stroke 0.5s ease` }}
      />
      {label !== undefined && (
        <Txt x={w / 2} y={h / 2} size={fontSize} color={labelColor} mono={mono} anchor="middle">
          {label}
        </Txt>
      )}
    </>
  );
}

interface TxtProps {
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  mono?: boolean;
  bold?: boolean;
  anchor?: "start" | "middle" | "end";
  children: React.ReactNode;
}

export function Txt({ x = 0, y = 0, size = 13, color = V.text, mono = false, bold = false, anchor = "start", children }: TxtProps) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fill={color}
      textAnchor={anchor}
      dominantBaseline="central"
      fontWeight={bold ? 600 : 400}
      fontFamily={mono ? "ui-monospace, 'Cascadia Code', Menlo, monospace" : "inherit"}
      style={{ transition: "fill 0.5s ease" }}
    >
      {children}
    </text>
  );
}

interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  o?: number;
  dashed?: boolean;
}

export function Arrow({ x1, y1, x2, y2, color = V.muted, o = 1, dashed = false }: ArrowProps) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const hx = x2 - 9 * Math.cos(angle);
  const hy = y2 - 9 * Math.sin(angle);
  const a1 = angle + Math.PI * 0.82;
  const a2 = angle - Math.PI * 0.82;
  return (
    <g style={{ opacity: o, transition: "opacity 0.55s ease" }}>
      <line
        x1={x1}
        y1={y1}
        x2={hx}
        y2={hy}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashed ? "5 4" : undefined}
        strokeLinecap="round"
      />
      <path
        d={`M ${x2} ${y2} L ${x2 + 10 * Math.cos(a1)} ${y2 + 10 * Math.sin(a1)} L ${x2 + 10 * Math.cos(a2)} ${y2 + 10 * Math.sin(a2)} Z`}
        fill={color}
      />
    </g>
  );
}

/** A pill-shaped token (value chip) - the moving "data" in most visuals. */
export function Chip({ w = 46, h = 28, color = V.cyan, label, mono = true }: { w?: number; h?: number; color?: string; label: string; mono?: boolean }) {
  return (
    <>
      <rect width={w} height={h} rx={h / 2} fill={color} style={{ transition: "fill 0.5s ease" }} />
      <Txt x={w / 2} y={h / 2 + 0.5} size={13} color="#1f1f1f" mono={mono} bold anchor="middle">
        {label}
      </Txt>
    </>
  );
}
