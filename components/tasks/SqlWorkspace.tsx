"use client";

import { useState } from "react";
import { Play, Send, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { PedroButton, PedroCard, PedroCardEyebrow } from "@/components/pedro";
import { PedroTextarea } from "@/components/pedro/PedroInput";
import { api, ApiClientError } from "@/lib/client/api";
import { useToast } from "@/lib/client/useToast";
import type { SqlTaskConfig } from "@/types/content";
import type { WorkspaceProps } from "./types";

interface SqlRunResult {
  columns: string[];
  rows: Record<string, unknown>[];
  error: string | null;
}

export function SqlWorkspace({ task, onEvaluated, previousResult }: WorkspaceProps) {
  const config = task.config as SqlTaskConfig;
  const isOpenEnded = config.validate.mode === "open-ended" && config.validate.findingPrompt.length > 0;
  const [query, setQuery] = useState(config.starterQuery);
  const [findingText, setFindingText] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SqlRunResult | null>(null);
  const { show } = useToast();

  async function handleRun() {
    setRunning(true);
    try {
      const res = await api.post<SqlRunResult>(`/api/tasks/${task.id}/sql/run`, { query });
      setResult(res);
      if (res.error) show(res.error, "error");
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't run that query.", "error");
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await api.post(`/api/tasks/${task.id}/submit`, {
        query,
        findingText: isOpenEnded ? findingText : undefined,
        chartCreated: isOpenEnded ? showChart : undefined,
      });
      onEvaluated(res as Parameters<WorkspaceProps["onEvaluated"]>[0], Boolean(previousResult));
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't submit your query.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const numericColumn = result?.columns.find((c) => result.rows.some((r) => typeof r[c] === "number"));
  const labelColumn = result?.columns.find((c) => c !== numericColumn);
  const chartData =
    result && numericColumn && labelColumn
      ? result.rows.slice(0, 12).map((r) => ({ label: String(r[labelColumn]), value: Number(r[numericColumn]) || 0 }))
      : [];

  return (
    <PedroCard padding="lg">
      <PedroCardEyebrow>SQL workspace · orders table</PedroCardEyebrow>
      <p className="mb-3 text-sm text-text-secondary">{config.expectedQueryDescription}</p>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        spellCheck={false}
        className="h-40 w-full resize-y rounded-pd-md border border-border-subtle bg-surface-deep p-4 font-mono text-sm leading-relaxed focus:outline-none focus:border-pd-mint focus:ring-2 focus:ring-pd-mint/30"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PedroButton variant="secondary" onClick={handleRun} loading={running}>
          <Play className="size-4" aria-hidden />
          Run query
        </PedroButton>
        {config.requiresChart && result && !result.error && chartData.length > 0 && (
          <PedroButton variant="tertiary" onClick={() => setShowChart((v) => !v)}>
            <BarChart3 className="size-4" aria-hidden />
            {showChart ? "Hide chart" : "Show as chart"}
          </PedroButton>
        )}
      </div>

      {result && (
        <div className="mt-4 overflow-x-auto rounded-pd-md border border-border-subtle">
          {result.error ? (
            <p className="p-3 text-sm text-red-400">{result.error}</p>
          ) : result.rows.length === 0 ? (
            <p className="p-3 text-sm text-text-muted">Query ran successfully - no rows returned.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated">
                <tr>
                  {result.columns.map((c) => (
                    <th key={c} className="px-3 py-2 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.slice(0, 50).map((row, i) => (
                  <tr key={i} className="border-t border-border-subtle">
                    {result.columns.map((c) => (
                      <td key={c} className="px-3 py-2 font-mono text-xs">
                        {String(row[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showChart && chartData.length > 0 && (
        <div className="mt-4 h-64 rounded-pd-md border border-border-subtle p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
              <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
              <Bar dataKey="value" fill="var(--pd-cyan)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {isOpenEnded && (
        <div className="mt-5 border-t border-border-subtle pt-5">
          <PedroTextarea
            label={config.validate.mode === "open-ended" ? config.validate.findingPrompt : ""}
            value={findingText}
            onChange={(e) => setFindingText(e.target.value)}
            rows={3}
          />
        </div>
      )}

      <PedroButton className="mt-5" onClick={handleSubmit} loading={submitting} size="lg">
        <Send className="size-4" aria-hidden />
        Submit
      </PedroButton>
    </PedroCard>
  );
}
