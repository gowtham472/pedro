import { describe, expect, it } from "vitest";
import { assembleProgram, gradeMarkerOutput } from "./polyglotRunner";
import { softwareDevelopmentTasks } from "@/lib/content/domains/software-development";
import { problemSolvingTasks } from "@/lib/content/domains/problem-solving";
import { independentBuildTasks } from "@/lib/content/domains/independent-build";
import type { CodeTaskConfig, TaskDefinition } from "@/types/content";

const codeTasks = [...softwareDevelopmentTasks, ...problemSolvingTasks, ...independentBuildTasks].filter(
  (t): t is TaskDefinition & { config: CodeTaskConfig } => t.config.type === "code"
);

describe("content variants", () => {
  it("every code task offers python, java, and c", () => {
    for (const task of codeTasks) {
      expect(task.config.variants?.python?.starterCode, task.id).toBeTruthy();
      expect(task.config.variants?.java?.starterCode, task.id).toBeTruthy();
      expect(task.config.variants?.java?.driver, task.id).toBeTruthy();
      expect(task.config.variants?.c?.starterCode, task.id).toBeTruthy();
      expect(task.config.variants?.c?.driver, task.id).toBeTruthy();
    }
  });

  it("java/c drivers reference every visible arg count worth of tests", () => {
    // Sanity guard against drivers drifting from testCases: each driver must
    // execute exactly testCases.length cases (checked via marker grading in
    // the live smoke test; here we check the driver mentions the marker).
    for (const task of codeTasks) {
      expect(task.config.variants!.java!.driver).toContain("__PEDRO__");
      expect(task.config.variants!.c!.driver).toContain("__PEDRO__");
    }
  });
});

describe("assembleProgram", () => {
  const feature = codeTasks.find((t) => t.id === "swdev-04-ship-a-feature")!.config;

  it("python program embeds all test args and appends generated driver", () => {
    const program = assembleProgram("python", "def solve(username):\n    return False", feature);
    expect(program).toContain("def solve(username):");
    expect(program).toContain("_ARGS");
    expect(program).toContain("__PEDRO__");
    // hidden test input is embedded server-side only
    expect(program).toContain("has space");
  });

  it("java program combines user code, helpers, and driver", () => {
    const program = assembleProgram("java", "class Solution { static boolean solve(String u) { return false; } }", feature);
    expect(program).toContain("class Solution");
    expect(program).toContain("class Canon");
    expect(program).toContain("class Main");
  });

  it("c program includes headers, helpers, and driver", () => {
    const program = assembleProgram("c", "int solve(const char* username) { return 0; }", feature);
    expect(program).toContain("#include <stdio.h>");
    expect(program).toContain("canon_str");
    expect(program).toContain("int main(void)");
  });
});

describe("gradeMarkerOutput", () => {
  // fix-the-bug: expected [55, 40, 0, 0, 125], t4/t5 hidden
  const fixBug = codeTasks.find((t) => t.id === "swdev-01-fix-the-bug")!.config;

  it("passes when all values match expected, and every visible case still carries its expected value", () => {
    const result = gradeMarkerOutput("__PEDRO__[55,40,0,0,125]\n", fixBug)!;
    expect(result.evaluation.passed).toBe(true);
    expect(result.evaluation.summary).toContain("All 5");
    // Regression: a passing visible case used to have `expected`/`actual`
    // stripped entirely (only hidden cases should ever lose that data),
    // which rendered as the literal text "expected undefined" in the UI.
    for (const r of result.evaluation.testResults!.filter((r) => !r.hidden)) {
      expect(r.expected, r.id).toBeDefined();
      expect(r.actual, r.id).toBeDefined();
    }
  });

  it("fails with per-test detail when a value differs", () => {
    const result = gradeMarkerOutput("__PEDRO__[55,40,0,0,999]\n", fixBug)!;
    expect(result.evaluation.passed).toBe(false);
    const failed = result.evaluation.testResults!.find((r) => !r.passed)!;
    expect(failed.hidden).toBe(true);
    expect(failed.error).toBe("Hidden case failed");
    expect(failed.expected).toBeUndefined(); // hidden failures never leak the answer key
  });

  it("a mix of passing and failing visible cases each keep their own expected/actual (reported bug)", () => {
    // t1 55 (pass), t2 40 (fail: got 41), t3 0 (pass), t4/t5 hidden (pass)
    const result = gradeMarkerOutput("__PEDRO__[55,41,0,0,125]\n", fixBug)!;
    const [t1, t2, t3, t4] = result.evaluation.testResults!;
    expect(t1).toMatchObject({ passed: true, expected: "55", actual: "55" });
    expect(t2).toMatchObject({ passed: false, expected: "40", actual: "41" });
    expect(t3).toMatchObject({ passed: true, expected: "0", actual: "0" });
    expect(t4.hidden).toBe(true);
    expect(t4.expected).toBeUndefined();
  });

  it("ignores learner stdout noise before the marker line", () => {
    const result = gradeMarkerOutput("debug print\nmore output\n__PEDRO__[55,40,0,0,125]\n", fixBug)!;
    expect(result.evaluation.passed).toBe(true);
  });

  it("returns null when the marker is missing or malformed", () => {
    expect(gradeMarkerOutput("no marker here", fixBug)).toBeNull();
    expect(gradeMarkerOutput("__PEDRO__[not json", fixBug)).toBeNull();
    expect(gradeMarkerOutput("__PEDRO__[1,2]", fixBug)).toBeNull(); // wrong count
  });

  it("handles nulls, booleans, strings, and nested arrays", () => {
    const second = codeTasks.find((t) => t.id === "dsa-02-second-largest")!.config;
    const result = gradeMarkerOutput("__PEDRO__[3,9,null,2]", second)!;
    expect(result.evaluation.passed).toBe(true);

    const feature = codeTasks.find((t) => t.id === "swdev-04-ship-a-feature")!.config;
    const good = JSON.stringify(feature.testCases.map((tc) => tc.expected));
    expect(gradeMarkerOutput(`__PEDRO__${good}`, feature)!.evaluation.passed).toBe(true);
  });
});
