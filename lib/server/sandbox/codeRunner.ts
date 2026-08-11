import "server-only";

import { Worker } from "node:worker_threads";
import type { CodeTaskConfig } from "@/types/content";
import type { EvaluationDetail, TestResult } from "@/types/entities";
import { CODE_WORKER_SOURCE } from "./codeWorkerSource";

// ---------------------------------------------------------------------------
// Honest limitation (see also README "Limitations"): PRD §32 describes a
// queue + container-isolated worker fleet for code execution. Standing up
// real container/microVM isolation is out of reach inside this Next.js
// serverless app, so this is a best-effort in-process sandbox instead:
//   - a fresh worker_thread per submission (separate V8 isolate)
//   - a capped heap via `resourceLimits`
//   - execution inside `vm.createContext` with a minimal global allowlist
//     (no require/process/fs/network)
//   - a hard per-test-case timeout enforced by V8 script interruption
//   - a static denylist pre-check as defense-in-depth
// This is meaningfully safer than running submissions inline, but it is NOT
// container-grade isolation. A production deployment accepting code from
// untrusted strangers at scale should replace this with a real isolated
// execution service (Firecracker/gVisor-backed workers, or a hosted judge
// like Piston/Judge0) - tasks here are intentionally simple beginner
// exercises, not a general-purpose online judge.
// ---------------------------------------------------------------------------

const DANGEROUS_PATTERNS: RegExp[] = [
  /\brequire\s*\(/,
  /\bimport\s*\(/,
  /\bprocess\s*[.[]/,
  /\bglobalThis\b/,
  /__proto__/,
  /\bconstructor\s*\.\s*constructor\b/,
  /\bFunction\s*\(/,
  /\bchild_process\b/,
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bWebAssembly\b/,
];

export interface CodeRunResult {
  evaluation: EvaluationDetail;
  logs: string[];
}

interface WorkerMessage {
  compileError: string | null;
  results: TestResult[];
  logs: string[];
}

function staticPreCheck(code: string): string | null {
  if (code.length > 20_000) return "Your solution is too long for this sandbox.";
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return "Your code uses something that isn't allowed in this sandbox (require, process, dynamic code generation, or network access). Stick to plain JavaScript logic.";
    }
  }
  return null;
}

function blockedResult(reason: string): CodeRunResult {
  return {
    evaluation: {
      summary: reason,
      passed: false,
      breakdown: [{ label: "Sandbox safety check", passed: false, detail: reason }],
      testResults: [],
    },
    logs: [],
  };
}

function timeoutResult(config: CodeTaskConfig): CodeRunResult {
  return {
    evaluation: {
      summary: "Your code took too long to run (possible infinite loop) and was stopped.",
      passed: false,
      breakdown: [{ label: "Time limit", passed: false, detail: "Execution exceeded the time limit." }],
      testResults: config.testCases.map((tc) => ({
        id: tc.id,
        passed: false,
        error: "Timed out",
        hidden: Boolean(tc.hidden),
      })),
    },
    logs: [],
  };
}

function crashResult(message: string): CodeRunResult {
  return {
    evaluation: {
      summary: `Your code crashed the sandbox: ${message}`,
      passed: false,
      breakdown: [{ label: "Execution", passed: false, detail: message }],
      testResults: [],
    },
    logs: [],
  };
}

function toRunResult(msg: WorkerMessage): CodeRunResult {
  if (msg.compileError) {
    return {
      evaluation: {
        summary: msg.compileError,
        passed: false,
        breakdown: [{ label: "Runs without errors", passed: false, detail: msg.compileError }],
        testResults: [],
      },
      logs: msg.logs ?? [],
    };
  }

  const testResults = msg.results;
  const passedCount = testResults.filter((r) => r.passed).length;
  const allPassed = testResults.length > 0 && passedCount === testResults.length;
  const hiddenFailed = testResults.some((r) => !r.passed && r.hidden);
  const visibleFailed = testResults.some((r) => !r.passed && !r.hidden);

  let summary: string;
  if (allPassed) summary = `All ${testResults.length} test cases passed.`;
  else if (!visibleFailed && hiddenFailed)
    summary = `${passedCount}/${testResults.length} test cases passed - the visible examples work, but at least one hidden case doesn't.`;
  else summary = `${passedCount}/${testResults.length} test cases passed.`;

  return {
    evaluation: {
      summary,
      passed: allPassed,
      breakdown: [
        { label: "Runs without errors", passed: true },
        { label: "All test cases pass", passed: allPassed, detail: `${passedCount}/${testResults.length}` },
      ],
      testResults,
    },
    logs: msg.logs ?? [],
  };
}

export async function runCodeTask(config: CodeTaskConfig, submittedCode: string): Promise<CodeRunResult> {
  const blockedReason = staticPreCheck(submittedCode);
  if (blockedReason) return blockedResult(blockedReason);

  const perTestTimeoutMs = Math.min(config.timeLimitMs ?? 3000, 5000);
  // Capped independently of test-case count: if every case happens to loop
  // forever, we'd rather kill the whole worker on one bound than make the
  // student wait out N independent per-test timeouts in sequence.
  const overallTimeoutMs = Math.min(perTestTimeoutMs * config.testCases.length + 2000, 10_000);

  const worker = new Worker(CODE_WORKER_SOURCE, {
    eval: true,
    workerData: {
      code: submittedCode,
      functionName: config.functionName,
      testCases: config.testCases,
      perTestTimeoutMs,
    },
    resourceLimits: {
      maxOldGenerationSizeMb: 64,
      maxYoungGenerationSizeMb: 32,
      codeRangeSizeMb: 16,
      stackSizeMb: 4,
    },
  });

  return new Promise<CodeRunResult>((resolve) => {
    let settled = false;
    const finish = (result: CodeRunResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.removeAllListeners();
      void worker.terminate();
      resolve(result);
    };

    const timer = setTimeout(() => finish(timeoutResult(config)), overallTimeoutMs);

    worker.once("message", (msg: WorkerMessage) => finish(toRunResult(msg)));
    worker.once("error", (err: Error) => finish(crashResult(err.message)));
    worker.once("exit", (code) => {
      if (code !== 0) finish(crashResult(`Sandbox exited unexpectedly (code ${code}).`));
    });
  });
}
