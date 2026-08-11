import "server-only";

import type { TaskDefinition } from "@/types/content";
import type {
  ConfidenceLevel,
  DomainEvidence,
  DomainId,
  DomainScore,
  Reflection,
  ScoringWeights,
  TaskAttempt,
} from "@/types/entities";

function average(nums: number[]): number {
  return nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;
}
function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
function round(n: number): number {
  return Math.round(n);
}
function rescale1to5(value: number): number {
  return ((value - 1) / 4) * 100;
}

export interface ComputeDomainScoreInput {
  userId: string;
  domainId: DomainId;
  tasks: TaskDefinition[];
  attempts: TaskAttempt[];
  reflections: Reflection[];
  chosenOnDay7: boolean;
  weights: ScoringWeights;
}

/**
 * Combines performance, learning velocity, engagement, and preference into a
 * single domain score, per PRD §20-22. Progression through the journey is
 * engagement-gated (see journeyEngine.ts), not performance-gated - this
 * score is descriptive evidence for the report, never a pass/fail gate.
 */
export function computeDomainScore(input: ComputeDomainScoreInput): DomainScore {
  const { tasks, attempts, reflections, chosenOnDay7, weights } = input;
  const tasksTotal = tasks.length;

  const attemptsByTask = new Map<string, TaskAttempt[]>();
  for (const a of attempts) {
    const list = attemptsByTask.get(a.taskId) ?? [];
    list.push(a);
    attemptsByTask.set(a.taskId, list);
  }
  for (const list of attemptsByTask.values()) list.sort((a, b) => a.attemptNumber - b.attemptNumber);

  const tasksWithAttempts = tasks.filter((t) => (attemptsByTask.get(t.id)?.length ?? 0) > 0);
  const terminalAttemptLists = tasksWithAttempts
    .map((t) => attemptsByTask.get(t.id)!)
    .map((list) => list.filter((a) => a.status !== "in_progress"))
    .filter((list) => list.length > 0);

  const tasksCompleted = terminalAttemptLists.length;

  // --- Performance: latest terminal attempt score, averaged across tasks ---
  const latestScores = terminalAttemptLists.map((list) => list[list.length - 1].score);
  const performanceScore = average(latestScores);

  // --- Learning velocity: improvement from first -> last attempt ---------
  const velocityPoints: number[] = [];
  const scoreProgression: number[] = [];
  for (const list of terminalAttemptLists) {
    const first = list[0].score;
    const last = list[list.length - 1].score;
    scoreProgression.push(last);
    velocityPoints.push(list.length === 1 ? first : clamp(last + Math.max(0, last - first) * 0.5, 0, 100));
  }
  const learningScore = average(velocityPoints);

  // --- Engagement: completion, persistence (retries), active time --------
  const completionComponent = tasksTotal ? (tasksCompleted / tasksTotal) * 100 : 0;
  const attemptCounts = tasksWithAttempts.map((t) => attemptsByTask.get(t.id)!.length);
  const avgAttempts = average(attemptCounts);
  // Guard against the "zero engagement" case: with no attempts at all,
  // avgAttempts is 0 (empty average), which would otherwise flow through the
  // formula below and produce a nonzero phantom persistence score.
  const persistenceComponent = attemptCounts.length === 0 ? 0 : clamp(40 + (avgAttempts - 1) * 30, 0, 100);
  const totalActiveSeconds = attempts.reduce((s, a) => s + (a.timeSpentSeconds || 0), 0);
  const estimatedSecondsTotal = tasks.reduce((s, t) => s + t.estimatedMinutes * 60, 0) || 1;
  const activityComponent = clamp((totalActiveSeconds / estimatedSecondsTotal) * 100, 0, 100);
  const engagementScore = average([completionComponent, persistenceComponent, activityComponent]);

  // --- Preference: self-reported enjoyment/curiosity/future interest -----
  const preferenceValues = reflections.map((r) => average([r.enjoyment, r.curiosity, r.futureInterest]));
  const preferenceBase = preferenceValues.length ? rescale1to5(average(preferenceValues)) : 0;
  const day7Bonus = chosenOnDay7 ? 15 : 0;
  const preferenceScore = clamp(preferenceBase + day7Bonus, 0, 100);

  const overallScore = clamp(
    performanceScore * weights.performance +
      learningScore * weights.learningVelocity +
      engagementScore * weights.engagement +
      preferenceScore * weights.preference,
    0,
    100
  );

  // --- Confidence: driven by how complete the evidence is ----------------
  const completenessRatio = tasksTotal ? tasksCompleted / tasksTotal : 0;
  const reflectionRatio = tasksCompleted ? Math.min(1, reflections.length / tasksCompleted) : 0;
  let confidence: ConfidenceLevel = "low";
  if (completenessRatio >= 1 && reflectionRatio >= 0.8) confidence = "high";
  else if (completenessRatio >= 0.5) confidence = "medium";

  const evidence: DomainEvidence = {
    tasksCompleted,
    tasksTotal,
    averageAttempts: Number(avgAttempts.toFixed(1)),
    scoreProgression,
    averageEnjoyment: reflections.length ? Number(average(reflections.map((r) => r.enjoyment)).toFixed(1)) : 0,
    averageCuriosity: reflections.length ? Number(average(reflections.map((r) => r.curiosity)).toFixed(1)) : 0,
    averageFutureInterest: reflections.length
      ? Number(average(reflections.map((r) => r.futureInterest)).toFixed(1))
      : 0,
    totalActiveSeconds,
    chosenOnDay7,
    highlights: buildHighlights({ performanceScore, learningScore, engagementScore, preferenceScore, avgAttempts, chosenOnDay7 }),
  };

  return {
    userId: input.userId,
    domainId: input.domainId,
    performanceScore: round(performanceScore),
    learningScore: round(learningScore),
    engagementScore: round(engagementScore),
    preferenceScore: round(preferenceScore),
    overallScore: round(overallScore),
    confidence,
    evidence,
    computedAt: new Date().toISOString(),
  };
}

function buildHighlights(input: {
  performanceScore: number;
  learningScore: number;
  engagementScore: number;
  preferenceScore: number;
  avgAttempts: number;
  chosenOnDay7: boolean;
}): string[] {
  const bullets: string[] = [];
  if (input.performanceScore >= 75) bullets.push("Strong task performance");
  if (input.learningScore >= 75) bullets.push("High learning velocity - clear improvement across attempts");
  if (input.engagementScore >= 75) bullets.push("High engagement and persistence");
  if (input.avgAttempts >= 2) bullets.push("Retried tasks rather than stopping at the first attempt");
  if (input.preferenceScore >= 75) bullets.push("Reported strong enjoyment and curiosity");
  if (input.chosenOnDay7) bullets.push("Chosen voluntarily on Day 7");
  if (bullets.length === 0) bullets.push("Limited evidence collected so far");
  return bullets.slice(0, 4);
}
