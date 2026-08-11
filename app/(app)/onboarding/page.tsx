"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Eye, Activity, BarChart3, FlaskConical } from "lucide-react";
import { PedroButton, PedroCard, PedroPill, PedroShell } from "@/components/pedro";
import { PedroToggle } from "@/components/pedro/PedroToggle";
import { PedroScale } from "@/components/pedro/PedroScale";
import { DOMAIN_ICON_MAP, BuildIcon } from "@/components/pedro/icons/DomainIcons";
import { ALL_DOMAINS } from "@/lib/content";
import { api } from "@/lib/client/api";
import { useAuth } from "@/lib/client/useAuth";
import type { UserProfile } from "@/types/entities";

type Step = "welcome" | "consent" | "baseline" | "ready";
const STEPS: Step[] = ["welcome", "consent", "baseline", "ready"];

interface ConsentState {
  analyticsConsent: boolean;
  interactionConsent: boolean;
  gazeConsent: boolean;
  researchConsent: boolean;
}

interface BaselineState {
  triedBefore: string[];
  confidenceProgramming: number;
  confidenceLogic: number;
  confidenceDesign: number;
  confidenceData: number;
  curiosityCloud: number;
  interestSecurity: number;
}

const TRIED_BEFORE_OPTIONS = [
  "Programming",
  "Logic puzzles / DSA",
  "Design tools",
  "Spreadsheets / SQL",
  "Linux / command line",
  "Security or CTFs",
  "None of these yet",
];

const JOURNEY_ROWS = [
  ...ALL_DOMAINS.map((d) => ({ day: d.day, label: d.name, icon: DOMAIN_ICON_MAP[d.id] })),
  { day: 7, label: "Your Choice", icon: BuildIcon },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [step, setStep] = useState<Step>("welcome");
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    analyticsConsent: false,
    interactionConsent: false,
    gazeConsent: false,
    researchConsent: false,
  });
  const [baseline, setBaseline] = useState<BaselineState>({
    triedBefore: [],
    confidenceProgramming: 3,
    confidenceLogic: 3,
    confidenceDesign: 3,
    confidenceData: 3,
    curiosityCloud: 3,
    interestSecurity: 3,
  });

  useEffect(() => {
    api
      .get<{ profile: UserProfile }>("/api/profile")
      .then(({ profile }) => {
        if (profile.onboardingCompleted) router.replace("/dashboard");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  function toggleTriedBefore(option: string) {
    setBaseline((b) => ({
      ...b,
      triedBefore: b.triedBefore.includes(option)
        ? b.triedBefore.filter((o) => o !== option)
        : [...b.triedBefore, option],
    }));
  }

  function goNext() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }
  function goBack() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  async function handleBegin() {
    setSubmitting(true);
    try {
      await api.post("/api/consent", consent);
      await api.patch("/api/profile", { baseline });
      await refreshProfile();
      router.push("/dashboard");
    } catch {
      setSubmitting(false);
    }
  }

  if (checking) return null;

  return (
    <PedroShell className="max-w-3xl">
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${STEPS.indexOf(step) >= i ? "bg-pd-mint" : "bg-surface-elevated"}`}
          />
        ))}
      </div>

      {step === "welcome" && (
        <PedroCard padding="lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">Welcome to Pedro</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">You don&apos;t need to know what career you want yet.</h1>
          <p className="mt-4 text-base text-text-secondary">
            Spend seven days exploring. We&apos;ll help you understand what fits you - not by asking you to
            guess, but by having you try the actual work of six technology domains.
          </p>
          <p className="mt-3 text-sm text-text-muted">
            Pedro measures four things as you go: how accurately you complete tasks, how quickly you improve,
            how engaged you stay, and what you genuinely enjoy. At the end, you&apos;ll get an evidence-based
            report - not a verdict.
          </p>
          <div className="mt-8 flex justify-end">
            <PedroButton onClick={goNext} size="lg">
              Continue
              <ArrowRight className="size-4" aria-hidden />
            </PedroButton>
          </div>
        </PedroCard>
      )}

      {step === "consent" && (
        <PedroCard padding="lg">
          <h2 className="text-2xl font-semibold tracking-tight">Your data, your choice</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Each of these is separate - turn on only what you&apos;re comfortable with. You can change any of
            these later in Settings, and none of them are required to use Pedro.
          </p>

          <div className="mt-6 flex flex-col divide-y divide-border-subtle">
            <div className="flex items-start gap-3 py-4">
              <BarChart3 className="mt-0.5 size-5 shrink-0 text-text-muted" aria-hidden />
              <PedroToggle
                label="Basic application analytics"
                description="Lets Pedro record which lessons and tasks you complete, so your dashboard, history, and report can work."
                checked={consent.analyticsConsent}
                onChange={(v) => setConsent((c) => ({ ...c, analyticsConsent: v }))}
              />
            </div>
            <div className="flex items-start gap-3 py-4">
              <Activity className="mt-0.5 size-5 shrink-0 text-text-muted" aria-hidden />
              <PedroToggle
                label="Interaction telemetry"
                description="Aggregate signals like click counts, active time, and retries - never raw keystrokes or continuous cursor tracking."
                checked={consent.interactionConsent}
                onChange={(v) => setConsent((c) => ({ ...c, interactionConsent: v }))}
              />
            </div>
            <div className="flex items-start gap-3 py-4">
              <Eye className="mt-0.5 size-5 shrink-0 text-text-muted" aria-hidden />
              <PedroToggle
                label="Optional webcam / gaze estimation"
                description="Experimental. Estimates coarse attention region from your webcam, processed in your browser. No video is ever stored. A visible indicator shows whenever it's active, and you can turn it off anytime."
                checked={consent.gazeConsent}
                onChange={(v) => setConsent((c) => ({ ...c, gazeConsent: v }))}
              />
            </div>
            <div className="flex items-start gap-3 py-4">
              <FlaskConical className="mt-0.5 size-5 shrink-0 text-text-muted" aria-hidden />
              <PedroToggle
                label="Research / aggregate data usage"
                description="Allows de-identified, aggregated results to help improve Pedro's recommendation methodology."
                checked={consent.researchConsent}
                onChange={(v) => setConsent((c) => ({ ...c, researchConsent: v }))}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <PedroButton variant="tertiary" onClick={goBack}>
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </PedroButton>
            <PedroButton onClick={goNext} size="lg">
              Continue
              <ArrowRight className="size-4" aria-hidden />
            </PedroButton>
          </div>
        </PedroCard>
      )}

      {step === "baseline" && (
        <PedroCard padding="lg">
          <h2 className="text-2xl font-semibold tracking-tight">A quick starting point</h2>
          <p className="mt-2 text-sm text-text-secondary">
            This isn&apos;t a test - there are no wrong answers. It just gives Pedro context for how you&apos;re
            starting out, so your improvement over the week means something.
          </p>

          <div className="mt-6 flex flex-col gap-7">
            <div>
              <p className="mb-2.5 text-sm font-medium">What have you tried before?</p>
              <div className="flex flex-wrap gap-2">
                {TRIED_BEFORE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleTriedBefore(option)}
                    className="flex min-h-11 items-center"
                  >
                    <PedroPill tone={baseline.triedBefore.includes(option) ? "mint" : "neutral"}>
                      {option}
                    </PedroPill>
                  </button>
                ))}
              </div>
            </div>

            {[
              { key: "confidenceProgramming" as const, label: "How confident are you with programming?" },
              { key: "confidenceLogic" as const, label: "How confident are you with logical reasoning?" },
              { key: "confidenceDesign" as const, label: "How confident are you with design?" },
              { key: "confidenceData" as const, label: "How confident are you with data?" },
              { key: "curiosityCloud" as const, label: "How curious are you about cloud technologies?" },
              { key: "interestSecurity" as const, label: "How interested are you in cybersecurity?" },
            ].map(({ key, label }) => (
              <div key={key}>
                <p className="mb-2.5 text-sm font-medium">{label}</p>
                <PedroScale
                  name={label}
                  value={baseline[key]}
                  onChange={(v) => setBaseline((b) => ({ ...b, [key]: v }))}
                  lowLabel="Not at all"
                  highLabel="Very"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <PedroButton variant="tertiary" onClick={goBack}>
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </PedroButton>
            <PedroButton onClick={goNext} size="lg">
              Continue
              <ArrowRight className="size-4" aria-hidden />
            </PedroButton>
          </div>
        </PedroCard>
      )}

      {step === "ready" && (
        <PedroCard padding="lg">
          <h2 className="text-2xl font-semibold tracking-tight">Your seven days</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Each day introduces a domain with a short lesson, then practical tasks. Day 7 is yours to choose.
          </p>

          <ol className="mt-6 flex flex-col gap-1">
            {JOURNEY_ROWS.map((row) => (
              <li key={row.day} className="flex items-center gap-3 rounded-pd-md px-3 py-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pd-mint text-xs font-semibold text-pd-charcoal">
                  {row.day}
                </span>
                <row.icon className="size-4 text-text-muted" />
                <span className="text-sm font-medium">{row.label}</span>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex justify-between">
            <PedroButton variant="tertiary" onClick={goBack} disabled={submitting}>
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </PedroButton>
            <PedroButton onClick={handleBegin} size="lg" loading={submitting}>
              Begin Day 1
              <ArrowRight className="size-4" aria-hidden />
            </PedroButton>
          </div>
        </PedroCard>
      )}
    </PedroShell>
  );
}
