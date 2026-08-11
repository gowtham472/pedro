import "server-only";

import type { SecurityTaskConfig } from "@/types/content";
import type { EvaluationBreakdownItem, EvaluationDetail } from "@/types/entities";

export interface SecurityAnswer {
  questionId: string;
  selectedOptionIds?: string[];
  text?: string;
}

function normalizeText(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

export function evaluateSecurityTask(
  config: SecurityTaskConfig,
  answers: SecurityAnswer[]
): EvaluationDetail {
  const breakdown: EvaluationBreakdownItem[] = config.questions.map((question) => {
    const answer = answers.find((a) => a.questionId === question.id);
    let passed = false;

    if (question.kind === "short-text") {
      const text = normalizeText(answer?.text ?? "");
      passed = text.length > 0 && (question.correctText ?? []).some((accepted) => text.includes(normalizeText(accepted)));
    } else {
      const selected = new Set(answer?.selectedOptionIds ?? []);
      const correct = new Set(question.correctOptionIds ?? []);
      passed = selected.size === correct.size && [...selected].every((id) => correct.has(id));
    }

    return { label: question.prompt, passed, detail: question.explanation };
  });

  const passedCount = breakdown.filter((b) => b.passed).length;
  const passed = passedCount === breakdown.length;

  return {
    summary: passed
      ? "Strong investigation - every finding checks out."
      : `${passedCount}/${breakdown.length} questions answered correctly. Review the explanations below.`,
    passed,
    breakdown,
  };
}
