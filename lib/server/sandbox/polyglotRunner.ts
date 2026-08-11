import "server-only";

import type { CodeLanguage, CodeTaskConfig } from "@/types/content";
import type { EvaluationDetail, TestResult } from "@/types/entities";
import { ApiError } from "@/lib/server/apiError";
import type { CodeRunResult } from "./codeRunner";

// ---------------------------------------------------------------------------
// Python / Java / C execution for code tasks.
//
// JavaScript submissions run in the local worker-thread sandbox
// (codeRunner.ts). The other languages need real interpreters/compilers,
// which can't live inside a serverless Next.js process - so they execute on
// an external, sandboxed execution service. Two backends:
//
//   - Wandbox (https://wandbox.org) - the default. Public, keyless
//     compile-and-run API. (Piston's public instance went whitelist-only in
//     Feb 2026, so it can't be the default anymore.)
//   - Piston (https://github.com/engineer-man/piston) - used when
//     PISTON_URL points at a self-hosted instance; preferred for scale.
//
// Only the learner's submitted code plus the task's test harness is sent -
// never any user identity or telemetry.
//
// Grading contract shared by all three languages: the assembled program
// prints exactly one line starting with __PEDRO__ followed by a JSON array,
// one entry per test case, holding the value the learner's function
// returned. That array is deep-compared against testCases[].expected.
// ---------------------------------------------------------------------------

const PISTON_URL = process.env.PISTON_URL; // self-hosted piston, optional
const WANDBOX_URL = process.env.WANDBOX_URL || "https://wandbox.org";
const MARKER = "__PEDRO__";

// Wandbox blocks generic non-browser user agents; identify honestly but in
// a UA shape it accepts.
const USER_AGENT = "Mozilla/5.0 (compatible; PedroCareerExplorer/1.0)";

const FILE_NAMES: Record<Exclude<CodeLanguage, "javascript">, string> = {
  python: "main.py",
  java: "Main.java",
  c: "main.c",
};

const WANDBOX_COMPILERS: Record<Exclude<CodeLanguage, "javascript">, string> = {
  python: process.env.WANDBOX_COMPILER_PYTHON || "cpython-3.13.8",
  java: process.env.WANDBOX_COMPILER_JAVA || "openjdk-jdk-22+36",
  c: process.env.WANDBOX_COMPILER_C || "gcc-13.2.0-c",
};

// ---------------------------------------------------------------------------
// Piston runtime version discovery (cached per server instance)
// ---------------------------------------------------------------------------

let runtimesPromise: Promise<Map<string, string>> | null = null;

async function getPistonRuntimeVersions(): Promise<Map<string, string>> {
  if (!runtimesPromise) {
    runtimesPromise = (async () => {
      const res = await fetch(`${PISTON_URL}/runtimes`, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`piston runtimes: HTTP ${res.status}`);
      const runtimes = (await res.json()) as { language: string; version: string }[];
      const map = new Map<string, string>();
      for (const rt of runtimes) {
        if (!map.has(rt.language)) map.set(rt.language, rt.version);
      }
      return map;
    })().catch((err) => {
      runtimesPromise = null; // allow retry on next request
      throw err;
    });
  }
  return runtimesPromise;
}

// ---------------------------------------------------------------------------
// Program assembly
// ---------------------------------------------------------------------------

/** Python driver is generated: args come straight from testCases as JSON. */
function buildPythonProgram(userCode: string, config: CodeTaskConfig): string {
  const argsJson = JSON.stringify(config.testCases.map((tc) => tc.args));
  return `${userCode}

import json as _json
_ARGS = _json.loads(${JSON.stringify(argsJson)})
_results = []
for _a in _ARGS:
    _results.append(solve(*_a))
print("${MARKER}" + _json.dumps(_results, separators=(",", ":")))
`;
}

// Shared canonical-JSON printer helpers, appended between the learner's code
// and the per-task driver. Drivers call these to build the __PEDRO__ line.
const JAVA_HELPERS = `
class Canon {
  static String j(String s) {
    if (s == null) return "null";
    StringBuilder b = new StringBuilder("\\"");
    for (char c : s.toCharArray()) {
      if (c == '"' || c == '\\\\') b.append('\\\\');
      b.append(c);
    }
    return b.append('"').toString();
  }
  static String j(int v) { return String.valueOf(v); }
  static String j(boolean v) { return String.valueOf(v); }
  static String j(Integer v) { return v == null ? "null" : String.valueOf(v); }
  static String j(int[] a) {
    StringBuilder b = new StringBuilder("[");
    for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(a[i]); }
    return b.append(']').toString();
  }
  static String j(String[] a) {
    StringBuilder b = new StringBuilder("[");
    for (int i = 0; i < a.length; i++) { if (i > 0) b.append(','); b.append(j(a[i])); }
    return b.append(']').toString();
  }
}
`;

const C_HELPERS = `
static void canon_str(const char* s) {
  putchar('"');
  for (const char* p = s; *p; p++) {
    if (*p == '"' || *p == '\\\\') putchar('\\\\');
    putchar(*p);
  }
  putchar('"');
}
static void canon_int_array(const int* a, int len) {
  putchar('[');
  for (int i = 0; i < len; i++) { if (i > 0) putchar(','); printf("%d", a[i]); }
  putchar(']');
}
`;

function buildJavaProgram(userCode: string, driver: string): string {
  return `import java.util.*;\n\n${userCode}\n${JAVA_HELPERS}\n${driver}\n`;
}

function buildCProgram(userCode: string, driver: string): string {
  return `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <ctype.h>\n\n${userCode}\n${C_HELPERS}\n${driver}\n`;
}

export function assembleProgram(language: Exclude<CodeLanguage, "javascript">, userCode: string, config: CodeTaskConfig): string {
  if (language === "python") return buildPythonProgram(userCode, config);
  const driver = config.variants?.[language]?.driver;
  if (!driver) throw new ApiError(400, `This task doesn't support ${language}.`);
  return language === "java" ? buildJavaProgram(userCode, driver) : buildCProgram(userCode, driver);
}

// ---------------------------------------------------------------------------
// Grading
// ---------------------------------------------------------------------------

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < 1e-9;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ka = Object.keys(a as object).sort();
    const kb = Object.keys(b as object).sort();
    return (
      ka.length === kb.length &&
      ka.every((k, i) => k === kb[i] && deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]))
    );
  }
  return false;
}

function errorEvaluation(summary: string, detail: string): CodeRunResult {
  return {
    evaluation: {
      summary,
      passed: false,
      breakdown: [{ label: "Runs without errors", passed: false, detail }],
      testResults: [],
    },
    logs: [],
  };
}

export function gradeMarkerOutput(stdout: string, config: CodeTaskConfig): CodeRunResult | null {
  const markerLine = stdout
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l.startsWith(MARKER));
  if (!markerLine) return null;

  let values: unknown[];
  try {
    values = JSON.parse(markerLine.slice(MARKER.length)) as unknown[];
  } catch {
    return null;
  }
  if (!Array.isArray(values) || values.length !== config.testCases.length) return null;

  const testResults: TestResult[] = config.testCases.map((tc, i) => {
    const actual = values[i];
    const passed = deepEqual(actual, tc.expected);
    return {
      id: tc.id,
      passed,
      hidden: Boolean(tc.hidden),
      ...(passed
        ? {}
        : tc.hidden
          ? { error: "Hidden case failed" }
          : { actual: JSON.stringify(actual), expected: JSON.stringify(tc.expected) }),
    };
  });

  const passedCount = testResults.filter((r) => r.passed).length;
  const allPassed = passedCount === testResults.length && testResults.length > 0;
  const hiddenFailed = testResults.some((r) => !r.passed && r.hidden);
  const visibleFailed = testResults.some((r) => !r.passed && !r.hidden);

  let summary: string;
  if (allPassed) summary = `All ${testResults.length} test cases passed.`;
  else if (!visibleFailed && hiddenFailed)
    summary = `${passedCount}/${testResults.length} test cases passed - the visible examples work, but at least one hidden case doesn't.`;
  else summary = `${passedCount}/${testResults.length} test cases passed.`;

  const evaluation: EvaluationDetail = {
    summary,
    passed: allPassed,
    breakdown: [
      { label: "Runs without errors", passed: true },
      { label: "All test cases pass", passed: allPassed, detail: `${passedCount}/${testResults.length}` },
    ],
    testResults,
  };
  return { evaluation, logs: [] };
}

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

/** Backend-neutral execution outcome. */
interface ExecOutcome {
  compileError: string | null;
  stdout: string;
  stderr: string;
  crashed: boolean;
  timedOut: boolean;
}

function firstErrorLines(text: string, maxLines = 8): string {
  return text.split("\n").slice(0, maxLines).join("\n").slice(0, 800);
}

const UNREACHABLE = new ApiError(
  503,
  "The Python/Java/C runner is unreachable right now. Try again in a moment, or switch to JavaScript."
);

interface PistonStage {
  stdout: string;
  stderr: string;
  code: number | null;
}

async function executeOnPiston(
  language: Exclude<CodeLanguage, "javascript">,
  program: string,
  runTimeoutMs: number
): Promise<ExecOutcome> {
  let versions: Map<string, string>;
  try {
    versions = await getPistonRuntimeVersions();
  } catch {
    throw UNREACHABLE;
  }
  const version = versions.get(language);
  if (!version) throw new ApiError(503, `The ${language} runtime isn't available right now. Try another language.`);

  let response: { run: PistonStage; compile?: PistonStage };
  try {
    const res = await fetch(`${PISTON_URL}/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version,
        files: [{ name: FILE_NAMES[language], content: program }],
        compile_timeout: 10_000,
        run_timeout: runTimeoutMs,
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    response = (await res.json()) as { run: PistonStage; compile?: PistonStage };
  } catch {
    throw UNREACHABLE;
  }

  if (response.compile && response.compile.code !== 0) {
    return {
      compileError: response.compile.stderr || response.compile.stdout || "Compilation failed.",
      stdout: "",
      stderr: "",
      crashed: false,
      timedOut: false,
    };
  }
  const stderr = (response.run.stderr ?? "").trim();
  return {
    compileError: null,
    stdout: response.run.stdout ?? "",
    stderr,
    crashed: response.run.code !== 0 && response.run.code !== null,
    timedOut: response.run.code === null || /timed?.?out/i.test(stderr),
  };
}

interface WandboxResponse {
  status?: string; // exit code as a string; "0" = success
  signal?: string; // e.g. "SIGKILL" when the sandbox killed the program
  compiler_error?: string;
  program_output?: string;
  program_error?: string;
}

async function executeOnWandbox(
  language: Exclude<CodeLanguage, "javascript">,
  program: string
): Promise<ExecOutcome> {
  let response: WandboxResponse;
  try {
    const res = await fetch(`${WANDBOX_URL}/api/compile.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": USER_AGENT },
      body: JSON.stringify({ compiler: WANDBOX_COMPILERS[language], code: program }),
      signal: AbortSignal.timeout(45_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    response = (await res.json()) as WandboxResponse;
  } catch {
    throw UNREACHABLE;
  }

  const compileError = (response.compiler_error ?? "").trim();
  // gcc/javac warnings also land in compiler_error - only treat it as a
  // compile failure when the program produced no run stage at all.
  const ranNothing = !response.program_output && !response.program_error && response.status !== "0";
  if (compileError && ranNothing) {
    return { compileError, stdout: "", stderr: "", crashed: false, timedOut: false };
  }

  return {
    compileError: null,
    stdout: response.program_output ?? "",
    stderr: (response.program_error ?? "").trim(),
    crashed: response.status !== "0" && !response.signal,
    timedOut: Boolean(response.signal), // sandbox kill = resource/time limit
  };
}

export async function runPolyglotTask(
  config: CodeTaskConfig,
  language: Exclude<CodeLanguage, "javascript">,
  submittedCode: string
): Promise<CodeRunResult> {
  if (submittedCode.length > 20_000) {
    return errorEvaluation("Your solution is too long for this sandbox.", "Code exceeds the 20k character limit.");
  }

  const program = assembleProgram(language, submittedCode, config);
  const runTimeoutMs = Math.min((config.timeLimitMs ?? 3000) * config.testCases.length + 2000, 10_000);

  const outcome = PISTON_URL
    ? await executeOnPiston(language, program, runTimeoutMs)
    : await executeOnWandbox(language, program);

  if (outcome.compileError) {
    return errorEvaluation("Your code didn't compile.", firstErrorLines(outcome.compileError));
  }

  const graded = gradeMarkerOutput(outcome.stdout, config);
  if (graded) return graded;

  // No marker line: the program crashed, timed out, or printed over it.
  if (outcome.timedOut) {
    return errorEvaluation(
      "Your code took too long to run (possible infinite loop) and was stopped.",
      "Execution exceeded the time limit."
    );
  }
  if (outcome.crashed && outcome.stderr) {
    return errorEvaluation("Your code crashed while running.", firstErrorLines(outcome.stderr));
  }
  return errorEvaluation(
    "Your code ran but didn't produce a readable result.",
    outcome.stderr ||
      "The grader couldn't find the expected output. Make sure your function returns a value instead of printing extra output on the final line."
  );
}
