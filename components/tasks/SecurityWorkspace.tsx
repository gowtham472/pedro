"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import clsx from "clsx";
import { PedroButton, PedroCard, PedroCardEyebrow } from "@/components/pedro";
import { PedroInput } from "@/components/pedro/PedroInput";
import { api, ApiClientError } from "@/lib/client/api";
import { useToast } from "@/lib/client/useToast";
import type { SecurityExhibit, SecurityTaskConfig } from "@/types/content";
import type { WorkspaceProps } from "./types";

function Exhibit({ exhibit }: { exhibit: SecurityExhibit }) {
  if (exhibit.kind === "table") {
    return (
      <div className="overflow-x-auto rounded-pd-md border border-border-subtle">
        <p className="border-b border-border-subtle bg-surface-elevated px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
          {exhibit.title}
        </p>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border-subtle">
              {exhibit.columns.map((c) => (
                <th key={c} className="px-3 py-2 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exhibit.rows.map((row, i) => (
              <tr key={i} className="border-b border-border-subtle last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 font-mono">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (exhibit.kind === "log") {
    return (
      <div className="rounded-pd-md border border-border-subtle">
        <p className="border-b border-border-subtle bg-surface-elevated px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
          {exhibit.title}
        </p>
        <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed">{exhibit.lines.join("\n")}</pre>
      </div>
    );
  }
  return (
    <div className="rounded-pd-md border border-border-subtle">
      <p className="border-b border-border-subtle bg-surface-elevated px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
        {exhibit.title}
      </p>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed">{exhibit.code}</pre>
    </div>
  );
}

export function SecurityWorkspace({ task, onEvaluated, previousResult }: WorkspaceProps) {
  const config = task.config as SecurityTaskConfig;
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { show } = useToast();

  function toggleOption(questionId: string, optionId: string, exclusive: boolean) {
    setSelections((prev) => {
      const current = prev[questionId] ?? [];
      if (exclusive) return { ...prev, [questionId]: [optionId] };
      const next = current.includes(optionId) ? current.filter((o) => o !== optionId) : [...current, optionId];
      return { ...prev, [questionId]: next };
    });
  }

  const allAnswered = config.questions.every((q) =>
    q.kind === "short-text" ? Boolean(texts[q.id]?.trim()) : (selections[q.id]?.length ?? 0) > 0
  );

  async function handleSubmit() {
    const answers = config.questions.map((q) => ({
      questionId: q.id,
      selectedOptionIds: selections[q.id],
      text: texts[q.id],
    }));
    setSubmitting(true);
    try {
      const res = await api.post(`/api/tasks/${task.id}/submit`, { answers });
      onEvaluated(res as Parameters<WorkspaceProps["onEvaluated"]>[0], Boolean(previousResult));
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't submit your answers.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PedroCard padding="lg">
      <PedroCardEyebrow>{config.eyebrow ?? "Investigation"}</PedroCardEyebrow>
      <p className="mb-4 text-sm text-text-secondary">{config.briefing}</p>

      <div className="flex flex-col gap-4">
        {config.exhibits.map((ex, i) => (
          <Exhibit key={i} exhibit={ex} />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-6 border-t border-border-subtle pt-6">
        {config.questions.map((q) => (
          <div key={q.id}>
            <p className="mb-2.5 text-sm font-medium">{q.prompt}</p>
            {q.kind === "short-text" ? (
              <PedroInput
                value={texts[q.id] ?? ""}
                onChange={(e) => setTexts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                placeholder="Your answer"
              />
            ) : (
              <div className="flex flex-col gap-2">
                {q.options?.map((opt) => {
                  const selected = (selections[q.id] ?? []).includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleOption(q.id, opt.id, q.kind === "single-choice")}
                      className={clsx(
                        "flex items-center gap-2.5 rounded-pd-md border px-4 py-2.5 text-left text-sm transition-colors",
                        selected ? "border-pd-mint bg-pd-mint/10" : "border-border-subtle hover:bg-surface-elevated"
                      )}
                    >
                      <span
                        className={clsx(
                          "flex size-4 shrink-0 items-center justify-center border",
                          q.kind === "single-choice" ? "rounded-full" : "rounded",
                          selected ? "border-pd-mint bg-pd-mint" : "border-border-subtle"
                        )}
                      />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <PedroButton className="mt-6" onClick={handleSubmit} disabled={!allAnswered} loading={submitting} size="lg">
        <Send className="size-4" aria-hidden />
        Submit answers
      </PedroButton>

      {previousResult && (
        <div className="mt-5 flex flex-col gap-3 border-t border-border-subtle pt-5">
          {config.questions.map((q, i) => {
            const b = previousResult.evaluation.breakdown[i];
            if (!b) return null;
            return (
              <div key={q.id} className="text-sm">
                <p className="font-medium">{q.prompt}</p>
                <p className="mt-1 text-text-muted">{b.detail}</p>
              </div>
            );
          })}
        </div>
      )}
    </PedroCard>
  );
}
