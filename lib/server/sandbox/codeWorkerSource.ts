// Source for the worker_thread that actually executes untrusted student code.
// Passed to `new Worker(source, { eval: true })` in codeRunner.ts rather than
// referenced as a file path, because Next.js's build output doesn't preserve
// a stable on-disk path for sibling modules that a plain `new Worker(url)`
// could resolve at runtime.
//
// Isolation layers (see AGENTS.md-adjacent note in codeRunner.ts for the
// honest limitation): this is a best-effort serverless sandbox - a fresh
// worker_thread (separate V8 isolate, capped heap via resourceLimits) running
// the submission inside `vm.createContext` with a minimal global allowlist,
// no `require`/`process`/filesystem/network, and a hard per-test-case
// execution timeout enforced by V8 script interruption (works even against a
// synchronous infinite loop). It is NOT container/microVM-grade isolation -
// see the sandbox executor's own comment for what a production hardening
// pass should add.
export const CODE_WORKER_SOURCE = `
const { workerData, parentPort } = require("node:worker_threads");
const vm = require("node:vm");

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i])) return false;
    return true;
  }
  if (typeof a === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const k of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
      if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  return false;
}

function describe(value) {
  try {
    if (value === undefined) return "undefined";
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function main() {
  const { code, functionName, testCases, perTestTimeoutMs } = workerData;
  const logs = [];
  const pushLog = (prefix, args) => {
    if (logs.length < 200) {
      logs.push((prefix ? prefix + " " : "") + args.map((a) => describe(a)).join(" "));
    }
  };

  const sandbox = {
    console: {
      log: (...args) => pushLog("", args),
      info: (...args) => pushLog("", args),
      warn: (...args) => pushLog("WARN:", args),
      error: (...args) => pushLog("ERROR:", args),
    },
    Math, JSON, Array, Object, String, Number, Boolean, Map, Set, Symbol,
    Date, RegExp, Error, TypeError, RangeError, Infinity, NaN, undefined,
    parseInt, parseFloat, isNaN, isFinite,
  };

  const context = vm.createContext(sandbox, {
    codeGeneration: { strings: false, wasm: false },
  });

  try {
    vm.runInContext(code, context, { timeout: perTestTimeoutMs, filename: "solution.js" });
  } catch (err) {
    parentPort.postMessage({
      compileError: err instanceof Error ? err.message : String(err),
      results: [],
      logs,
    });
    return;
  }

  const fn = context[functionName];
  if (typeof fn !== "function") {
    parentPort.postMessage({
      compileError: 'Your code does not define a function named "' + functionName + '".',
      results: [],
      logs,
    });
    return;
  }

  const results = testCases.map((tc) => {
    context.__pedro_args__ = tc.args;
    context.__pedro_result__ = undefined;
    try {
      vm.runInContext(
        "__pedro_result__ = " + functionName + "(...__pedro_args__);",
        context,
        { timeout: perTestTimeoutMs, filename: "test-" + tc.id + ".js" }
      );
      const actual = context.__pedro_result__;
      const passed = deepEqual(actual, tc.expected);
      return {
        id: tc.id,
        passed,
        actual: describe(actual),
        expected: describe(tc.expected),
        hidden: Boolean(tc.hidden),
      };
    } catch (err) {
      return {
        id: tc.id,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
        expected: describe(tc.expected),
        hidden: Boolean(tc.hidden),
      };
    }
  });

  parentPort.postMessage({ compileError: null, results, logs });
}

main();
`;
