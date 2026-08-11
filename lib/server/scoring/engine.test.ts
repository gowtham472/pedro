import { describe, expect, it } from "vitest";
import { computeDomainScore } from "./engine";
import { DEFAULT_SCORING_WEIGHTS } from "@/lib/server/scoring/defaults";
import { softwareDevelopmentTasks } from "@/lib/content/domains/software-development";
import type { Reflection, TaskAttempt } from "@/types/entities";

function attempt(taskId: string, attemptNumber: number, score: number, status: TaskAttempt["status"] = "passed"): TaskAttempt {
  return {
    id: `${taskId}-${attemptNumber}`,
    userId: "u1",
    taskId,
    domainId: "software-development",
    day: 1,
    attemptNumber,
    status,
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    timeSpentSeconds: 300,
    hintCount: 0,
    score,
  };
}

function reflection(taskId: string, values: Partial<Pick<Reflection, "enjoyment" | "curiosity" | "futureInterest">>): Reflection {
  return {
    id: `${taskId}-r`,
    userId: "u1",
    taskId,
    domainId: "software-development",
    day: 1,
    enjoyment: values.enjoyment ?? 3,
    difficulty: 3,
    curiosity: values.curiosity ?? 3,
    persistence: 3,
    futureInterest: values.futureInterest ?? 3,
    submittedAt: new Date().toISOString(),
  };
}

const tasks = softwareDevelopmentTasks; // 3 tasks

describe("computeDomainScore", () => {
  it("rewards improvement across attempts with a high learning velocity score", () => {
    const attempts: TaskAttempt[] = [
      attempt(tasks[0].id, 1, 40),
      attempt(tasks[0].id, 2, 70),
      attempt(tasks[0].id, 3, 95),
    ];
    const score = computeDomainScore({
      userId: "u1",
      domainId: "software-development",
      tasks: [tasks[0]],
      attempts,
      reflections: [],
      chosenOnDay7: false,
      weights: DEFAULT_SCORING_WEIGHTS,
    });
    expect(score.learningScore).toBeGreaterThan(score.performanceScore - 1); // velocity bonus applied
    expect(score.evidence.scoreProgression).toEqual([95]);
  });

  it("still credits a single high-scoring attempt (no penalty for not needing retries)", () => {
    const attempts: TaskAttempt[] = [attempt(tasks[0].id, 1, 90)];
    const score = computeDomainScore({
      userId: "u1",
      domainId: "software-development",
      tasks: [tasks[0]],
      attempts,
      reflections: [],
      chosenOnDay7: false,
      weights: DEFAULT_SCORING_WEIGHTS,
    });
    expect(score.learningScore).toBe(90);
  });

  it("reports low confidence when most tasks were skipped", () => {
    const attempts: TaskAttempt[] = [attempt(tasks[0].id, 1, 80)];
    const score = computeDomainScore({
      userId: "u1",
      domainId: "software-development",
      tasks, // 3 tasks total, only 1 attempted
      attempts,
      reflections: [],
      chosenOnDay7: false,
      weights: DEFAULT_SCORING_WEIGHTS,
    });
    expect(score.confidence).toBe("low");
  });

  it("reports high confidence when every task is completed and reflected on", () => {
    const attempts = tasks.map((t) => attempt(t.id, 1, 85));
    const reflections = tasks.map((t) => reflection(t.id, { enjoyment: 5, curiosity: 5, futureInterest: 5 }));
    const score = computeDomainScore({
      userId: "u1",
      domainId: "software-development",
      tasks,
      attempts,
      reflections,
      chosenOnDay7: false,
      weights: DEFAULT_SCORING_WEIGHTS,
    });
    expect(score.confidence).toBe("high");
    expect(score.preferenceScore).toBe(100);
  });

  it("gives a Day 7 voluntary choice a preference bonus", () => {
    const attempts = [attempt(tasks[0].id, 1, 50)];
    const reflections = [reflection(tasks[0].id, { enjoyment: 3, curiosity: 3, futureInterest: 3 })];
    const withChoice = computeDomainScore({
      userId: "u1",
      domainId: "software-development",
      tasks: [tasks[0]],
      attempts,
      reflections,
      chosenOnDay7: true,
      weights: DEFAULT_SCORING_WEIGHTS,
    });
    const withoutChoice = computeDomainScore({
      userId: "u1",
      domainId: "software-development",
      tasks: [tasks[0]],
      attempts,
      reflections,
      chosenOnDay7: false,
      weights: DEFAULT_SCORING_WEIGHTS,
    });
    expect(withChoice.preferenceScore).toBeGreaterThan(withoutChoice.preferenceScore);
  });

  it("returns all-zero scores gracefully when there is no data at all", () => {
    const score = computeDomainScore({
      userId: "u1",
      domainId: "software-development",
      tasks,
      attempts: [],
      reflections: [],
      chosenOnDay7: false,
      weights: DEFAULT_SCORING_WEIGHTS,
    });
    expect(score.overallScore).toBe(0);
    expect(score.confidence).toBe("low");
  });
});
