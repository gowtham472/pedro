import { describe, expect, it } from "vitest";
import { evaluateDesignTask } from "./designScoring";
import { uiUxDesignTasks } from "@/lib/content/domains/ui-ux-design";
import type { DesignTaskConfig } from "@/types/content";
import type { DesignScene } from "@/types/design";

function designConfig(taskId: string): DesignTaskConfig {
  const task = uiUxDesignTasks.find((t) => t.id === taskId);
  if (!task || task.config.type !== "design") throw new Error("fixture missing: " + taskId);
  return task.config;
}

describe("evaluateDesignTask", () => {
  it("passes a well-formed login screen", () => {
    const config = designConfig("design-01-login-screen");
    const scene: DesignScene = {
      canvasWidth: 375,
      canvasHeight: 700,
      iterationCount: 3,
      elements: [
        { id: "1", kind: "heading", x: 20, y: 40, width: 200, height: 40, label: "Welcome back" },
        { id: "2", kind: "email-field", x: 20, y: 120, width: 300, height: 48 },
        { id: "3", kind: "password-field", x: 20, y: 180, width: 300, height: 48 },
        { id: "4", kind: "button", x: 20, y: 260, width: 300, height: 48, label: "Log in" },
        { id: "5", kind: "subtext", x: 20, y: 320, width: 300, height: 24 },
      ],
    };
    const evaluation = evaluateDesignTask(config, scene);
    expect(evaluation.passed).toBe(true);
  });

  it("fails a near-empty canvas", () => {
    const config = designConfig("design-01-login-screen");
    const scene: DesignScene = {
      canvasWidth: 375,
      canvasHeight: 700,
      iterationCount: 1,
      elements: [{ id: "1", kind: "heading", x: 20, y: 40, width: 200, height: 40 }],
    };
    const evaluation = evaluateDesignTask(config, scene);
    expect(evaluation.passed).toBe(false);
  });
});
