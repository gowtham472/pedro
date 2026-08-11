"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lightbulb, CheckCircle2, XCircle, PartyPopper } from "lucide-react";
import { PedroButton, PedroCard, PedroCardEyebrow, PedroShell } from "@/components/pedro";
import { MarkdownLite } from "@/components/pedro/MarkdownLite";
import { PedroReflection } from "@/components/pedro/PedroReflection";
import { CodeWorkspace } from "@/components/tasks/CodeWorkspace";
import { SqlWorkspace } from "@/components/tasks/SqlWorkspace";
import { DesignWorkspace } from "@/components/tasks/DesignWorkspace";
import { TerminalWorkspace } from "@/components/tasks/TerminalWorkspace";
import { SecurityWorkspace } from "@/components/tasks/SecurityWorkspace";
import { GazeIndicator } from "@/components/tasks/GazeIndicator";
import { api, ApiClientError } from "@/lib/client/api";
import { useAuth } from "@/lib/client/useAuth";
import { useTaskTelemetry } from "@/lib/client/useTaskTelemetry";
import { useToast } from "@/lib/client/useToast";
import { PedroXpCelebration } from "@/components/pedro/PedroXpCelebration";
import { DEFAULT_BASE_POINTS, type TaskDefinition } from "@/types/content";
import type { EvaluationDetail, TaskAttempt, XpAward } from "@/types/entities";

interface TaskResponse {
  task: TaskDefinition;
  latestAttempt: TaskAttempt | null;
  reflected: boolean;
}

interface SubmitResponse {
  evaluation: EvaluationDetail;
  score: number;
  status: string;
  attempt: TaskAttempt;
  dayCompleted: boolean;
  xpAward: XpAward | null;
}

export default function TaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = use(params);
  const router = useRouter();
  const { show } = useToast();
  const { refreshProfile } = useAuth();
  const { track, recordRetry } = useTaskTelemetry(taskId);

  const [data, setData] = useState<TaskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [reflected, setReflected] = useState(false);
  const [hint, setHint] = useState<{ text: string; order: number } | null>(null);
  const [hintsRemaining, setHintsRemaining] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get<TaskResponse>(`/api/tasks/${taskId}`);
        if (cancelled) return;
        setData(res);
        setReflected(res.reflected);
        if (!startedRef.current) {
          startedRef.current = true;
          await api.post(`/api/tasks/${taskId}/start`);
          track("task_started");
        }
      } catch (err) {
        if (err instanceof ApiClientError) setError(err.message);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  async function requestHint() {
    try {
      const res = await api.post<{ hint: { order: number; text: string } | null; hintsRemaining: number }>(
        `/api/tasks/${taskId}/hint`
      );
      if (res.hint) {
        setHint(res.hint);
        track("hint_opened", { hintNumber: res.hint.order });
      }
      setHintsRemaining(res.hintsRemaining);
    } catch (err) {
      if (err instanceof ApiClientError) show(err.message, "error");
    }
  }

  function handleEvaluated(res: SubmitResponse, isRetry: boolean) {
    setResult(res);
    if (isRetry) recordRetry();
    track(res.evaluation.passed ? "task_completed" : "task_failed", { score: res.score });
    if (res.xpAward) refreshProfile();
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

  const { task } = data;

  return (
    <PedroShell className="max-w-5xl">
      <Link href={`/day/${task.day}`} className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden />
        Day {task.day}
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <PedroCardEyebrow>Worth {task.basePoints ?? DEFAULT_BASE_POINTS[task.difficulty]}+ XP</PedroCardEyebrow>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{task.title}</h1>
        </div>
        <GazeIndicator taskId={taskId} />
      </div>

      <PedroCard padding="lg" className="mb-6">
        <MarkdownLite text={task.instructions} />
        {task.hints.length > 0 && !result?.evaluation.passed && (
          <div className="mt-4 border-t border-border-subtle pt-4">
            {hint ? (
              <div className="flex items-start gap-2.5 rounded-pd-md bg-pd-cream/60 p-3 text-sm text-pd-charcoal">
                <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden />
                <span>{hint.text}</span>
              </div>
            ) : (
              <PedroButton variant="secondary" size="sm" onClick={requestHint}>
                <Lightbulb className="size-4" aria-hidden />
                Need a hint? ({task.hints.length} available)
              </PedroButton>
            )}
            {hint && hintsRemaining > 0 && (
              <PedroButton variant="tertiary" size="sm" className="mt-2" onClick={requestHint}>
                Next hint ({hintsRemaining} left)
              </PedroButton>
            )}
          </div>
        )}
      </PedroCard>

      {task.config.type === "code" && (
        <CodeWorkspace task={task} onEvaluated={handleEvaluated} previousResult={result} />
      )}
      {task.config.type === "sql" && (
        <SqlWorkspace task={task} onEvaluated={handleEvaluated} previousResult={result} />
      )}
      {task.config.type === "design" && (
        <DesignWorkspace task={task} onEvaluated={handleEvaluated} previousResult={result} />
      )}
      {task.config.type === "terminal" && (
        <TerminalWorkspace task={task} onEvaluated={handleEvaluated} previousResult={result} />
      )}
      {task.config.type === "security" && (
        <SecurityWorkspace task={task} onEvaluated={handleEvaluated} previousResult={result} />
      )}

      {result && (
        <PedroCard padding="lg" className="mt-6" tone={result.evaluation.passed ? "mint" : "surface"}>
          <div className="flex items-center gap-2.5">
            {result.evaluation.passed ? (
              <CheckCircle2 className="size-5 shrink-0" aria-hidden />
            ) : (
              <XCircle className="size-5 shrink-0 text-text-muted" aria-hidden />
            )}
            <p className="font-semibold">{result.evaluation.summary}</p>
          </div>
          <ul className="mt-4 flex flex-col gap-1.5">
            {result.evaluation.breakdown.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                {b.passed ? (
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 opacity-70" aria-hidden />
                ) : (
                  <XCircle className="mt-0.5 size-3.5 shrink-0 opacity-70" aria-hidden />
                )}
                <span>
                  {b.label}
                  {b.detail && <span className="opacity-70"> - {b.detail}</span>}
                </span>
              </li>
            ))}
          </ul>
          {result.xpAward && <PedroXpCelebration award={result.xpAward} />}
          {result.dayCompleted && (
            <div className="mt-4 flex items-center gap-2 rounded-pd-md bg-pd-charcoal/10 p-3 text-sm font-medium">
              <PartyPopper className="size-4" aria-hidden />
              Day {task.day} complete.
            </div>
          )}
        </PedroCard>
      )}

      {result && !reflected && (
        <div className="mt-6">
          <PedroReflection taskId={taskId} onSubmitted={() => setReflected(true)} />
        </div>
      )}

      {result && reflected && (
        <div className="mt-6 flex justify-end">
          <PedroButton onClick={() => router.push(`/day/${task.day}`)} size="lg">
            Back to Day {task.day}
          </PedroButton>
        </div>
      )}
    </PedroShell>
  );
}
