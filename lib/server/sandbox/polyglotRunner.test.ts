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
  const fizz = codeTasks.find((t) => t.id === "swdev-01-conditional-print")!.config;

  it("python program embeds all test args and appends generated driver", () => {
    const program = assembleProgram("python", "def solve(n):\n    return []", fizz);
    expect(program).toContain("def solve(n):");
    expect(program).toContain("_ARGS");
    expect(program).toContain("__PEDRO__");
    // hidden test input (n=15) is embedded server-side only
    expect(program).toContain("15");
  });

  it("java program combines user code, helpers, and driver", () => {
    const program = assembleProgram("java", "class Solution { static String[] solve(int n) { return new String[0]; } }", fizz);
    expect(program).toContain("class Solution");
    expect(program).toContain("class Canon");
    expect(program).toContain("class Main");
  });

  it("c program includes headers, helpers, and driver", () => {
    const program = assembleProgram("c", "void solve(int n, char result[][12]) {}", fizz);
    expect(program).toContain("#include <stdio.h>");
    expect(program).toContain("canon_str");
    expect(program).toContain("int main(void)");
  });
});

describe("gradeMarkerOutput", () => {
  const max = codeTasks.find((t) => t.id === "swdev-02-array-max")!.config;

  it("passes when all values match expected", () => {
    const result = gradeMarkerOutput("__PEDRO__[9,-1,7,2]\n", max)!;
    expect(result.evaluation.passed).toBe(true);
    expect(result.evaluation.summary).toContain("All 4");
  });

  it("fails with per-test detail when a value differs", () => {
    const result = gradeMarkerOutput("__PEDRO__[9,-1,7,999]\n", max)!;
    expect(result.evaluation.passed).toBe(false);
    const failed = result.evaluation.testResults!.find((r) => !r.passed)!;
    expect(failed.hidden).toBe(true);
    expect(failed.error).toBe("Hidden case failed");
  });

  it("ignores learner stdout noise before the marker line", () => {
    const result = gradeMarkerOutput("debug print\nmore output\n__PEDRO__[9,-1,7,2]\n", max)!;
    expect(result.evaluation.passed).toBe(true);
  });

  it("returns null when the marker is missing or malformed", () => {
    expect(gradeMarkerOutput("no marker here", max)).toBeNull();
    expect(gradeMarkerOutput("__PEDRO__[not json", max)).toBeNull();
    expect(gradeMarkerOutput("__PEDRO__[1,2]", max)).toBeNull(); // wrong count
  });

  it("handles nulls, booleans, strings, and nested arrays", () => {
    const second = codeTasks.find((t) => t.id === "dsa-02-second-largest")!.config;
    const result = gradeMarkerOutput("__PEDRO__[3,9,null,2]", second)!;
    expect(result.evaluation.passed).toBe(true);

    const fizz = codeTasks.find((t) => t.id === "swdev-01-conditional-print")!.config;
    const good = JSON.stringify(fizz.testCases.map((tc) => tc.expected));
    expect(gradeMarkerOutput(`__PEDRO__${good}`, fizz)!.evaluation.passed).toBe(true);
  });
});
