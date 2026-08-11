"use client";

import { useEffect, useState } from "react";
import { PedroButton, PedroCard, PedroCardEyebrow } from "@/components/pedro";
import { api, ApiClientError } from "@/lib/client/api";
import { useToast } from "@/lib/client/useToast";
import type { ScoringWeights } from "@/types/entities";

const FIELDS: { key: keyof Pick<ScoringWeights, "performance" | "learningVelocity" | "engagement" | "preference">; label: string }[] = [
  { key: "performance", label: "Performance" },
  { key: "learningVelocity", label: "Learning velocity" },
  { key: "engagement", label: "Engagement" },
  { key: "preference", label: "Preference" },
];

export default function AdminScoringPage() {
  const { show } = useToast();
  const [weights, setWeights] = useState<ScoringWeights | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<{ weights: ScoringWeights }>("/api/admin/scoring-config").then((res) => setWeights(res.weights));
  }, []);

  const total = weights ? FIELDS.reduce((sum, f) => sum + weights[f.key], 0) : 0;

  async function save() {
    if (!weights) return;
    setSaving(true);
    try {
      const res = await api.put<{ weights: ScoringWeights }>("/api/admin/scoring-config", {
        performance: weights.performance,
        learningVelocity: weights.learningVelocity,
        engagement: weights.engagement,
        preference: weights.preference,
      });
      setWeights(res.weights);
      show("Scoring weights updated.", "success");
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Weights must sum to 1.0.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (!weights) return <div className="h-64 animate-pulse rounded-pd-lg bg-surface" />;

  return (
    <PedroCard padding="lg" className="max-w-xl">
      <PedroCardEyebrow>Domain score weights</PedroCardEyebrow>
      <p className="mb-4 text-sm text-text-secondary">
        Domain Score = performance × w1 + learning velocity × w2 + engagement × w3 + preference × w4. Must sum
        to 1.0. Default is 30/25/20/25 per the PRD.
      </p>
      <div className="flex flex-col gap-5">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <div className="flex items-center justify-between text-sm">
              <label htmlFor={f.key}>{f.label}</label>
              <span className="tabular-nums font-medium">{Math.round(weights[f.key] * 100)}%</span>
            </div>
            <input
              id={f.key}
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={weights[f.key]}
              onChange={(e) => setWeights({ ...weights, [f.key]: Number(e.target.value) })}
              className="mt-1.5 w-full accent-[var(--pd-mint)]"
            />
          </div>
        ))}
      </div>
      <p className={`mt-4 text-sm ${Math.abs(total - 1) < 0.01 ? "text-text-muted" : "text-red-500"}`}>
        Total: {Math.round(total * 100)}%
      </p>
      <PedroButton className="mt-4" onClick={save} loading={saving} disabled={Math.abs(total - 1) >= 0.01}>
        Save weights
      </PedroButton>
    </PedroCard>
  );
}
