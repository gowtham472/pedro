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
  it("passes a correct FizzBuzz solution", async () => {
    const config = codeConfig("swdev-01-conditional-print");
    const code = `
      function solve(n) {
        const out = [];
        for (let i = 1; i <= n; i++) {
          if (i % 15 === 0) out.push("FizzBuzz");
          else if (i % 3 === 0) out.push("Fizz");
          else if (i % 5 === 0) out.push("Buzz");
          else out.push(String(i));
        }
        return out;
      }
    `;
    const result = await runCodeTask(config, code);
    expect(result.evaluation.passed).toBe(true);
    expect(result.evaluation.testResults?.every((r) => r.passed)).toBe(true);
  });

  it("fails and reports which cases broke for a wrong solution", async () => {
    const config = codeConfig("swdev-02-array-max");
    const code = `function solve(arr) { return arr[0]; }`; // wrong: ignores the rest
    const result = await runCodeTask(config, code);
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
    const config = codeConfig("swdev-03-palindrome");
    const code = `
      function solve(str) {
        console.log("checking", str);
        const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
        return clean === clean.split("").reverse().join("");
      }
    `;
    const result = await runCodeTask(config, code);
    expect(result.evaluation.passed).toBe(true);
    expect(result.logs.some((l) => l.includes("checking"))).toBe(true);
  });
});
