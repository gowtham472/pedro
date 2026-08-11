import type { EvaluationBreakdownItem } from "@/types/entities";

/** Turns any evaluator's pass/fail breakdown into a uniform 0-100 score. */
export function scoreFromBreakdown(breakdown: EvaluationBreakdownItem[]): number {
  if (breakdown.length === 0) return 0;
  const passed = breakdown.filter((b) => b.passed).length;
  return Math.round((passed / breakdown.length) * 100);
}
