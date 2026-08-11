import { describe, expect, it } from "vitest";
import { sanitizeTaskForClient } from "./taskSanitizer";
import { ALL_TASKS } from "@/lib/content";

describe("sanitizeTaskForClient", () => {
  it("never leaks hidden code test case args/expected values", () => {
    const codeTasks = ALL_TASKS.filter((t) => t.config.type === "code");
    expect(codeTasks.length).toBeGreaterThan(0);
    for (const task of codeTasks) {
      if (task.config.type !== "code") continue;
      const sanitized = sanitizeTaskForClient(task);
      if (sanitized.config.type !== "code") throw new Error("type changed");
      for (const tc of sanitized.config.testCases) {
        if (tc.hidden) {
          expect(tc.args).toEqual([]);
          expect(tc.expected).toBeNull();
        }
      }
      const asString = JSON.stringify(sanitized);
      const hiddenOriginals = task.config.testCases.filter((tc) => tc.hidden);
      for (const hidden of hiddenOriginals) {
        // The hidden case's specific expected value should not appear anywhere
        // in the sanitized payload (guards against accidental leakage even
        // through some other field).
        if (typeof hidden.expected === "string" && hidden.expected.length > 2) {
          expect(asString).not.toContain(JSON.stringify(hidden.expected));
        }
      }
    }
  });

  it("strips language drivers (they embed hidden test inputs) but keeps starter code", () => {
    const codeTasks = ALL_TASKS.filter((t) => t.config.type === "code");
    for (const task of codeTasks) {
      if (task.config.type !== "code" || !task.config.variants) continue;
      const sanitized = sanitizeTaskForClient(task);
      if (sanitized.config.type !== "code") throw new Error("type changed");
      for (const [lang, original] of Object.entries(task.config.variants)) {
        const variant = sanitized.config.variants?.[lang as keyof typeof sanitized.config.variants];
        expect(variant?.starterCode, `${task.id}:${lang}`).toBe(original.starterCode);
        expect(variant && "driver" in variant && variant.driver, `${task.id}:${lang} driver leaked`).toBeFalsy();
      }
    }
  });

  it("never leaks SQL validate answers", () => {
    const sqlTasks = ALL_TASKS.filter((t) => t.config.type === "sql");
    expect(sqlTasks.length).toBeGreaterThan(0);
    for (const task of sqlTasks) {
      if (task.config.type !== "sql") continue;
      const sanitized = sanitizeTaskForClient(task);
      if (sanitized.config.type !== "sql") throw new Error("type changed");
      expect(sanitized.config.validate.mode).toBe("open-ended");
      const asString = JSON.stringify(sanitized);
      if (task.config.validate.mode === "row-match") {
        expect(asString).not.toContain(JSON.stringify(task.config.validate.expectedRows));
      }
      if (task.config.validate.mode === "scalar") {
        expect(asString).not.toContain(String(task.config.validate.expectedValue));
      }
    }
  });

  it("preserves the findingPrompt for genuinely open-ended SQL tasks (client needs it to render the UI)", () => {
    const openEnded = ALL_TASKS.find(
      (t) => t.config.type === "sql" && t.config.validate.mode === "open-ended"
    );
    expect(openEnded).toBeDefined();
    if (!openEnded || openEnded.config.type !== "sql") throw new Error("fixture missing");
    const sanitized = sanitizeTaskForClient(openEnded);
    if (sanitized.config.type !== "sql" || sanitized.config.validate.mode !== "open-ended") {
      throw new Error("type changed");
    }
    expect(sanitized.config.validate.findingPrompt.length).toBeGreaterThan(0);
  });

  it("never leaks terminal fix steps, findings patterns, or filesystem content", () => {
    const terminalTasks = ALL_TASKS.filter((t) => t.config.type === "terminal");
    expect(terminalTasks.length).toBeGreaterThan(0);
    for (const task of terminalTasks) {
      const sanitized = sanitizeTaskForClient(task);
      if (sanitized.config.type !== "terminal") throw new Error("type changed");
      expect(sanitized.config.fixSteps).toEqual([]);
      expect(sanitized.config.findings).toEqual([]);
      expect(sanitized.config.files).toEqual([]);
      expect(sanitized.config.services).toEqual([]);
      expect(sanitized.config.processes).toEqual([]);
    }
  });

  it("never leaks security answer keys or explanations pre-submission", () => {
    const securityTasks = ALL_TASKS.filter((t) => t.config.type === "security");
    expect(securityTasks.length).toBeGreaterThan(0);
    for (const task of securityTasks) {
      const sanitized = sanitizeTaskForClient(task);
      if (sanitized.config.type !== "security") throw new Error("type changed");
      for (const q of sanitized.config.questions) {
        expect((q as { correctOptionIds?: unknown }).correctOptionIds).toBeUndefined();
        expect((q as { correctText?: unknown }).correctText).toBeUndefined();
        expect(q.explanation).toBe("");
      }
    }
  });
});
