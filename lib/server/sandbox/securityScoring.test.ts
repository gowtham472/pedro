import { describe, expect, it } from "vitest";
import { evaluateSecurityTask } from "./securityScoring";
import { cybersecurityTasks } from "@/lib/content/domains/cybersecurity";
import type { SecurityTaskConfig } from "@/types/content";

function securityConfig(taskId: string): SecurityTaskConfig {
  const task = cybersecurityTasks.find((t) => t.id === taskId);
  if (!task || task.config.type !== "security") throw new Error("fixture missing: " + taskId);
  return task.config;
}

describe("evaluateSecurityTask", () => {
  it("passes when every answer matches", () => {
    const config = securityConfig("sec-01-suspicious-login");
    const evaluation = evaluateSecurityTask(config, [
      { questionId: "q1", selectedOptionIds: ["c"] },
      { questionId: "q2", selectedOptionIds: ["a", "c"] },
      { questionId: "q3", text: "It's an account takeover." },
    ]);
    expect(evaluation.passed).toBe(true);
    expect(evaluation.breakdown.every((b) => b.passed)).toBe(true);
  });

  it("fails a single-choice question when the wrong option is picked", () => {
    const config = securityConfig("sec-01-suspicious-login");
    const evaluation = evaluateSecurityTask(config, [
      { questionId: "q1", selectedOptionIds: ["a"] },
      { questionId: "q2", selectedOptionIds: ["a", "c"] },
      { questionId: "q3", text: "account takeover" },
    ]);
    expect(evaluation.passed).toBe(false);
    expect(evaluation.breakdown[0].passed).toBe(false);
  });

  it("fails a multi-choice question on a partial selection", () => {
    const config = securityConfig("sec-01-suspicious-login");
    const evaluation = evaluateSecurityTask(config, [
      { questionId: "q1", selectedOptionIds: ["c"] },
      { questionId: "q2", selectedOptionIds: ["a"] }, // missing "c"
      { questionId: "q3", text: "account takeover" },
    ]);
    expect(evaluation.breakdown[1].passed).toBe(false);
  });

  it("grades short-text answers leniently via substring match", () => {
    const config = securityConfig("sec-02-code-mistake");
    const evaluation = evaluateSecurityTask(config, [
      { questionId: "q1", selectedOptionIds: ["a", "b", "d"] },
      { questionId: "q2", text: "You could type  ' OR '1'='1  as the username." },
    ]);
    expect(evaluation.passed).toBe(true);
  });
});
