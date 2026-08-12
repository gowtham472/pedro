import { describe, expect, it } from "vitest";
import { runCodeTask } from "./codeRunner";
import { softwareDevelopmentTasks } from "@/lib/content/domains/software-development";
import { problemSolvingTasks } from "@/lib/content/domains/problem-solving";
import type { CodeTaskConfig } from "@/types/content";

function codeConfig(taskId: string): CodeTaskConfig {
  const task = [...softwareDevelopmentTasks, ...problemSolvingTasks].find((t) => t.id === taskId);
  if (!task || task.config.type !== "code") throw new Error("fixture missing: " + taskId);
  return task.config;
}

describe("runCodeTask", () => {
  it("passes a correctly repaired fix-the-bug solution", async () => {
    const config = codeConfig("swdev-01-fix-the-bug");
    const code = `
      function solve(prices, discount) {
        let total = 0;
        for (let i = 0; i < prices.length; i++) {
          total += prices[i];
        }
        total -= discount;
        return total < 0 ? 0 : total;
      }
    `;
    const result = await runCodeTask(config, code);
    expect(result.evaluation.passed).toBe(true);
    expect(result.evaluation.testResults?.every((r) => r.passed)).toBe(true);
  });

  it("fails the unmodified buggy starter code (the bug is real)", async () => {
    const config = codeConfig("swdev-01-fix-the-bug");
    const result = await runCodeTask(config, config.starterCode);
    expect(result.evaluation.passed).toBe(false);
    expect(result.evaluation.testResults?.some((r) => !r.passed)).toBe(true);
  });

  it("reports a compile error for invalid syntax", async () => {
    const config = codeConfig("dsa-01-find-duplicates");
    const code = `function solve(arr) { return [`; // syntax error
    const result = await runCodeTask(config, code);
    expect(result.evaluation.passed).toBe(false);
    expect(result.evaluation.testResults?.length ?? 0).toBe(0);
    expect(result.evaluation.summary.length).toBeGreaterThan(0);
  });

  it("terminates an infinite loop instead of hanging", async () => {
    const config = codeConfig("dsa-02-second-largest");
    const code = `function solve(arr) { while (true) {} }`;
    const start = Date.now();
    const result = await runCodeTask(config, code);
    const elapsed = Date.now() - start;
    expect(result.evaluation.passed).toBe(false);
    // Generous bound: this proves it terminates at all rather than hanging
    // forever. Under parallel test-file execution several real worker
    // threads compete for CPU, which can stretch wall-clock time well past
    // the ~10s in-product cap without indicating a real regression.
    expect(elapsed).toBeLessThan(60_000);
  }, 65_000);

  it("blocks obvious sandbox-escape attempts via the static pre-check", async () => {
    const config = codeConfig("dsa-03-two-sum");
    const code = `function solve(arr, target) { return require("fs").existsSync("/"); }`;
    const result = await runCodeTask(config, code);
    expect(result.evaluation.passed).toBe(false);
    expect(result.evaluation.breakdown[0].label).toBe("Sandbox safety check");
  });

  it("captures console.log output from the submission", async () => {
    const config = codeConfig("swdev-04-ship-a-feature");
    const code = `
      function solve(username) {
        console.log("checking", username);
        if (username.length < 3 || username.length > 15) return false;
        if (!/^[a-zA-Z]/.test(username)) return false;
        return /^[a-zA-Z0-9_]+$/.test(username);
      }
    `;
    const result = await runCodeTask(config, code);
    expect(result.evaluation.passed).toBe(true);
    expect(result.logs.some((l) => l.includes("checking"))).toBe(true);
  });
});
