import { describe, expect, it } from "vitest";
import { evaluateTerminalTask, getInitialSession, runTerminalCommand } from "./terminalEngine";
import { cloudDevopsTasks } from "@/lib/content/domains/cloud-devops";
import type { TerminalSessionState } from "./terminalEngine";
import type { TerminalTaskConfig } from "@/types/content";

function terminalConfig(taskId: string): TerminalTaskConfig {
  const task = cloudDevopsTasks.find((t) => t.id === taskId);
  if (!task || task.config.type !== "terminal") throw new Error("fixture missing: " + taskId);
  return task.config;
}

function run(config: TerminalTaskConfig, session: TerminalSessionState, commands: string[]) {
  let current = session;
  let lastGoal = false;
  for (const cmd of commands) {
    const result = runTerminalCommand(config, current, cmd);
    current = result.session;
    lastGoal = result.goalReached;
  }
  return { session: current, goalReached: lastGoal };
}

describe("terminal engine - port conflict scenario", () => {
  const config = terminalConfig("devops-01-port-conflict");

  it("walks through the full investigation and fix successfully", () => {
    const session0 = getInitialSession(config);
    const { session, goalReached } = run(config, session0, [
      "systemctl status orderapi",
      "cat /var/log/orderapi/app.log",
      "netstat",
      "ps",
      "kill 8842",
      "systemctl restart orderapi",
    ]);

    expect(goalReached).toBe(true);
    expect(session.discoveredFindingIds).toEqual(
      expect.arrayContaining(["checked-status", "viewed-logs", "checked-network", "checked-processes"])
    );

    const evaluation = evaluateTerminalTask(config, session);
    expect(evaluation.passed).toBe(true);
    expect(evaluation.breakdown.every((b) => b.passed)).toBe(true);
  });

  it("refuses to restart until the port-blocking process is killed", () => {
    const session0 = getInitialSession(config);
    const step1 = runTerminalCommand(config, session0, "systemctl restart orderapi");
    expect(step1.goalReached).toBe(false);
    expect(step1.output).toMatch(/failed/i);

    const step2 = runTerminalCommand(config, step1.session, "kill 8842");
    const step3 = runTerminalCommand(config, step2.session, "systemctl restart orderapi");
    expect(step3.goalReached).toBe(true);
  });

  it("ls and cat navigate the virtual filesystem", () => {
    const session0 = getInitialSession(config);
    const ls = runTerminalCommand(config, session0, "ls /var/log/orderapi");
    expect(ls.output).toContain("app.log");

    const cat = runTerminalCommand(config, session0, "cat /var/log/orderapi/app.log");
    expect(cat.output).toContain("EADDRINUSE");

    const missing = runTerminalCommand(config, session0, "cat /nope.txt");
    expect(missing.output).toMatch(/No such file/);
  });

  it("does not let kill affect an unrelated pid", () => {
    const session0 = getInitialSession(config);
    const result = runTerminalCommand(config, session0, "kill 1");
    expect(result.output).toMatch(/not permitted/);
    const evaluation = evaluateTerminalTask(config, result.session);
    expect(evaluation.passed).toBe(false);
  });
});

describe("terminal engine - disk full scenario", () => {
  const config = terminalConfig("devops-02-disk-full");

  it("requires truncating the log before billingapi can restart", () => {
    const session0 = getInitialSession(config);
    const early = runTerminalCommand(config, session0, "systemctl restart billingapi");
    expect(early.goalReached).toBe(false);

    const { goalReached } = run(config, session0, [
      "df",
      "du",
      "cat /var/log/app/error.log",
      "truncate /var/log/app/access.log",
      "systemctl restart billingapi",
    ]);
    expect(goalReached).toBe(true);
  });
});
