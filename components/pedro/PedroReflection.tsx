"use client";

import { useState } from "react";
import { PedroButton, PedroCard } from "@/components/pedro";
import { PedroScale } from "./PedroScale";
import { PedroTextarea } from "./PedroInput";
import { api, ApiClientError } from "@/lib/client/api";
import { useToast } from "@/lib/client/useToast";

interface ReflectionValues {
  enjoyment: number;
  difficulty: number;
  curiosity: number;
  persistence: number;
  futureInterest: number;
  comment: string;
}

const QUESTIONS: { key: keyof Omit<ReflectionValues, "comment">; prompt: string; low: string; high: string }[] = [
  { key: "enjoyment", prompt: "How much did you enjoy this?", low: "Not at all", high: "A lot" },
  { key: "difficulty", prompt: "How difficult was this?", low: "Very easy", high: "Very hard" },
  { key: "curiosity", prompt: "Would you like to learn more about this?", low: "Not really", high: "Definitely" },
  { key: "persistence", prompt: "How willing were you to keep going when stuck?", low: "Gave up quickly", high: "Kept at it" },
  { key: "futureInterest", prompt: "Would you consider doing this professionally?", low: "Not for me", high: "Very interested" },
];

export function PedroReflection({ taskId, onSubmitted }: { taskId: string; onSubmitted: () => void }) {
  const { show } = useToast();
  const [values, setValues] = useState<Partial<ReflectionValues>>({});
  const [submitting, setSubmitting] = useState(false);

  const allAnswered = QUESTIONS.every((q) => values[q.key] !== undefined);

  async function handleSubmit() {
    if (!allAnswered) return;
    setSubmitting(true);
    try {
      await api.post("/api/reflections", { taskId, ...values });
      show("Reflection saved.", "success");
      onSubmitted();
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't save your reflection.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PedroCard padding="lg">
      <h2 className="text-lg font-semibold">Quick reflection</h2>
      <p className="mt-1 text-sm text-text-muted">This helps Pedro understand what you enjoyed, not just what you got right.</p>

      <div className="mt-6 flex flex-col gap-6">
        {QUESTIONS.map((q) => (
          <div key={q.key}>
            <p className="mb-2.5 text-sm font-medium">{q.prompt}</p>
            <PedroScale
              name={q.prompt}
              value={values[q.key] ?? null}
              onChange={(v) => setValues((prev) => ({ ...prev, [q.key]: v }))}
              lowLabel={q.low}
              highLabel={q.high}
            />
          </div>
        ))}
        <PedroTextarea
          label="What did you like or dislike? (optional)"
          value={values.comment ?? ""}
          onChange={(e) => setValues((prev) => ({ ...prev, comment: e.target.value }))}
          rows={3}
        />
      </div>

      <PedroButton className="mt-6" onClick={handleSubmit} disabled={!allAnswered} loading={submitting} size="lg">
        Save reflection
      </PedroButton>
    </PedroCard>
  );
}
