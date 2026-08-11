import { describe, expect, it } from "vitest";
import { computeXpAward, basePointsFor } from "./xp";
import type { TaskDefinition } from "@/types/content";

const task = (over: Partial<TaskDefinition> = {}): TaskDefinition =>
  ({
    id: "t",
    domainId: "software-development",
    lessonId: "l",
    day: 1,
    title: "T",
    description: "",
    instructions: "",
    difficulty: "beginner",
    estimatedMinutes: 10,
    learningObjectives: [],
    prerequisiteConcepts: [],
    hints: [],
    passingScore: 70,
    order: 1,
    config: { type: "code", language: "javascript", functionName: "solve", starterCode: "", testCases: [] },
    ...over,
  }) as TaskDefinition;

describe("basePointsFor", () => {
  it("uses explicit basePoints when set", () => {
    expect(basePointsFor(task({ basePoints: 80 }))).toBe(80);
  });

  it("falls back to difficulty defaults", () => {
    expect(basePointsFor(task({ difficulty: "beginner" }))).toBe(50);
    expect(basePointsFor(task({ difficulty: "intermediate" }))).toBe(75);
    expect(basePointsFor(task({ difficulty: "challenge" }))).toBe(100);
  });
});

describe("computeXpAward", () => {
  it("always grants exactly one of clean-solve / iterated", () => {
    const first = computeXpAward(task(), { attemptNumber: 1, hintCount: 0, timeSpentSeconds: 0, streak: 0 });
    expect(first.bonuses.map((b) => b.id)).toContain("clean-solve");
    expect(first.bonuses.map((b) => b.id)).not.toContain("iterated");

    const retry = computeXpAward(task(), { attemptNumber: 2, hintCount: 0, timeSpentSeconds: 0, streak: 0 });
    expect(retry.bonuses.map((b) => b.id)).toContain("iterated");
    expect(retry.bonuses.map((b) => b.id)).not.toContain("clean-solve");
  });

  it("rewards a fast pasted answer strictly less than an engaged solve", () => {
    // 20-second pass with hints vs. a 5-minute no-hint solve on the same task
    const pasted = computeXpAward(task(), { attemptNumber: 1, hintCount: 1, timeSpentSeconds: 20, streak: 0 });
    const engaged = computeXpAward(task(), { attemptNumber: 1, hintCount: 0, timeSpentSeconds: 300, streak: 0 });
    expect(engaged.total).toBeGreaterThan(pasted.total);
  });

  it("never deducts - total is always at least base", () => {
    const worst = computeXpAward(task(), { attemptNumber: 9, hintCount: 5, timeSpentSeconds: 1, streak: 0 });
    expect(worst.total).toBeGreaterThanOrEqual(worst.base);
  });

  it("grants comeback bonus from the third attempt", () => {
    const a2 = computeXpAward(task(), { attemptNumber: 2, hintCount: 0, timeSpentSeconds: 0, streak: 0 });
    const a3 = computeXpAward(task(), { attemptNumber: 3, hintCount: 0, timeSpentSeconds: 0, streak: 0 });
    expect(a2.bonuses.map((b) => b.id)).not.toContain("comeback");
    expect(a3.bonuses.map((b) => b.id)).toContain("comeback");
  });

  it("deep-focus floor is 60s even for tiny tasks", () => {
    const quick = computeXpAward(task({ estimatedMinutes: 1 }), { attemptNumber: 1, hintCount: 0, timeSpentSeconds: 59, streak: 0 });
    expect(quick.bonuses.map((b) => b.id)).not.toContain("deep-focus");
    const focused = computeXpAward(task({ estimatedMinutes: 1 }), { attemptNumber: 1, hintCount: 0, timeSpentSeconds: 61, streak: 0 });
    expect(focused.bonuses.map((b) => b.id)).toContain("deep-focus");
  });

  it("streak bonus appears from streak 2 and total sums correctly", () => {
    const award = computeXpAward(task({ basePoints: 100 }), { attemptNumber: 1, hintCount: 0, timeSpentSeconds: 300, streak: 3 });
    const sum = award.base + award.bonuses.reduce((s, b) => s + b.points, 0);
    expect(award.total).toBe(sum);
    expect(award.bonuses.find((b) => b.id === "streak")?.points).toBe(10);
  });
});
