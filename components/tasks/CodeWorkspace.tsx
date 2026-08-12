"use client";

import { useState } from "react";
import { Play, CheckCircle2, XCircle, Terminal } from "lucide-react";
import clsx from "clsx";
import { PedroButton, PedroCard, PedroCardEyebrow } from "@/components/pedro";
import { CodeEditor } from "./CodeEditor";
import { api, ApiClientError } from "@/lib/client/api";
import { useToast } from "@/lib/client/useToast";
import { CODE_LANGUAGE_LABELS as LANGUAGE_LABELS, useCodeLanguage } from "@/lib/client/useCodeLanguage";
import type { CodeLanguage, CodeTaskConfig } from "@/types/content";
import type { WorkspaceProps } from "./types";

export function CodeWorkspace({ task, onEvaluated, previousResult }: WorkspaceProps) {
  const config = task.config as CodeTaskConfig;

  const languages: CodeLanguage[] = [
    "javascript",
    ...(Object.keys(config.variants ?? {}) as CodeLanguage[]),
  ];

  // Language comes from the shared site-wide preference (the same one lesson
  // snippets use), clamped to what this task actually supports.
  const { language: preferredLanguage, setLanguage } = useCodeLanguage();
  const language: CodeLanguage = languages.includes(preferredLanguage) ? preferredLanguage : "javascript";
  // One buffer per language so switching tabs never loses work.
  const [buffers, setBuffers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = { javascript: config.starterCode };
    for (const [lang, variant] of Object.entries(config.variants ?? {})) {
      initial[lang] = variant.starterCode;
    }
    return initial;
  });
  const [submitting, setSubmitting] = useState(false);
  const { show } = useToast();

  const code = buffers[language] ?? "";
  const setCode = (next: string) => setBuffers((prev) => ({ ...prev, [language]: next }));

  const visibleTests = config.testCases.filter((tc) => !tc.hidden);

  async function handleRun() {
    setSubmitting(true);
    try {
      const res = await api.post(`/api/tasks/${task.id}/submit`, { code, language });
      onEvaluated(res as Parameters<WorkspaceProps["onEvaluated"]>[0], Boolean(previousResult));
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't run your code.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PedroCard padding="lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PedroCardEyebrow className="mb-0">Workspace · {LANGUAGE_LABELS[language]}</PedroCardEyebrow>
        {languages.length > 1 && (
          <div className="flex items-center gap-1 rounded-pd-pill border border-border-subtle bg-surface p-1" role="tablist" aria-label="Language">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                role="tab"
                aria-selected={language === lang}
                onClick={() => setLanguage(lang)}
                className={clsx(
                  "flex min-h-9 items-center rounded-pd-pill px-3 text-xs font-medium transition-colors",
                  language === lang ? "bg-pd-mint text-pd-charcoal" : "text-text-secondary hover:text-foreground"
                )}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <CodeEditor value={code} onChange={setCode} language={language} ariaLabel="Code editor" />
          <PedroButton className="mt-4" onClick={handleRun} loading={submitting} size="lg">
            <Play className="size-4" aria-hidden />
            Run tests
          </PedroButton>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Example test cases</p>
          <ul className="flex flex-col gap-2">
            {visibleTests.map((tc) => (
              <li key={tc.id} className="rounded-pd-md border border-border-subtle bg-surface p-3 font-mono text-xs">
                <div>
                  {config.functionName}({tc.args.map((a) => JSON.stringify(a)).join(", ")})
                </div>
                <div className="text-text-muted">→ {JSON.stringify(tc.expected)}</div>
                {tc.description && <div className="mt-1 font-sans text-text-muted">{tc.description}</div>}
              </li>
            ))}
          </ul>

          {previousResult?.evaluation.testResults && previousResult.evaluation.testResults.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">Latest run</p>
              <ul className="flex flex-col gap-1.5">
                {previousResult.evaluation.testResults.map((tr) => (
                  <li key={tr.id} className="flex items-start gap-2 rounded-pd-md bg-surface px-3 py-2 text-xs">
                    {tr.passed ? (
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-pd-mint" aria-hidden />
                    ) : (
                      <XCircle className="mt-0.5 size-3.5 shrink-0 text-red-400" aria-hidden />
                    )}
                    <span className="font-mono">
                      {tr.hidden ? "hidden case" : `expected ${tr.expected}`}
                      {!tr.passed && tr.actual !== undefined && <> - got {tr.actual}</>}
                      {!tr.passed && tr.error && <> - {tr.error}</>}
                    </span>
                  </li>
                ))}
              </ul>
              {previousResult.evaluation.warnings && (
                <div className="mt-2 rounded-pd-md bg-amber-500/10 px-3 py-2 text-xs text-amber-600">
                  <p className="font-medium">Compiled with warnings</p>
                  <pre className="mt-1 whitespace-pre-wrap break-words font-mono opacity-90">
                    {previousResult.evaluation.warnings}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-text-muted">
        <Terminal className="size-3.5" aria-hidden />
        {language === "javascript"
          ? "Your code runs inside an isolated sandbox - no network access, limited memory, and a short time limit."
          : "Your code runs on an isolated execution service - no network access and a short time limit."}
      </div>
    </PedroCard>
  );
}
