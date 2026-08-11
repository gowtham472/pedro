import "server-only";

import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import { FOOD_DELIVERY_ROWS, FOOD_DELIVERY_SCHEMA_SQL } from "@/lib/content/datasets/food-delivery";
import type { SqlTaskConfig } from "@/types/content";
import type { EvaluationBreakdownItem, EvaluationDetail } from "@/types/entities";

// sql.js is excluded from Next's bundling (see serverExternalPackages in
// next.config.ts). This is a real, sandboxed SQLite engine running entirely
// in-process (no filesystem or network access from inside a query) - safe to
// run arbitrary read-only SELECTs against a throwaway in-memory database that
// we reseed on every request.
//
// The wasm binary is loaded via `wasmBinary` (a raw buffer) rather than
// `locateFile`/require.resolve on the .wasm path directly: Turbopack's build
// tries to generate a special loader shim for any statically-visible
// `.wasm` module specifier (even inside require.resolve) and that shim is
// broken for this package. Resolving the bare `sql.js` specifier (which
// sql.js's package.json "exports" maps to dist/sql-wasm.js) and deriving the
// wasm file's path from there with plain string manipulation avoids ever
// asking Node's resolver to resolve a `.wasm`-suffixed or unlisted-export
// specifier, in both Turbopack and plain Node (Vitest).
const nodeRequire = createRequire(import.meta.url);

// Under Turbopack's dev server, `import.meta.url` (and thus createRequire
// resolution) can point at a virtual "[externals]" path that doesn't exist on
// disk. Anchor on process.cwd() first - node_modules/sql.js is a symlink into
// the pnpm store and readFileSync follows it - and only fall back to the
// resolver for runtimes where cwd isn't the project root.
function resolveWasmPath(): string {
  const fromCwd = path.join(process.cwd(), "node_modules", "sql.js", "dist", "sql-wasm.wasm");
  if (existsSync(fromCwd)) return fromCwd;
  const mainModulePath = nodeRequire.resolve("sql.js"); // .../sql.js/dist/sql-wasm.js
  return path.join(path.dirname(mainModulePath), "sql-wasm.wasm");
}

let sqlJsPromise: Promise<SqlJsStatic> | null = null;
function loadSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsPromise) {
    const nodeBuffer = readFileSync(resolveWasmPath());
    // Buffer is a Uint8Array view, not literally an ArrayBuffer - slice out
    // exactly this buffer's bytes in case Node handed us a view into a
    // larger shared pool.
    const wasmBinary = nodeBuffer.buffer.slice(
      nodeBuffer.byteOffset,
      nodeBuffer.byteOffset + nodeBuffer.byteLength
    ) as ArrayBuffer;
    sqlJsPromise = initSqlJs({ wasmBinary });
  }
  return sqlJsPromise!;
}

async function seedFoodDeliveryDb(SQL: SqlJsStatic): Promise<Database> {
  const db = new SQL.Database();
  db.run(FOOD_DELIVERY_SCHEMA_SQL);
  const stmt = db.prepare(
    "INSERT INTO orders (order_id, customer, city, restaurant, category, order_value, order_date, delivery_minutes, rating) VALUES (?,?,?,?,?,?,?,?,?)"
  );
  for (const row of FOOD_DELIVERY_ROWS) {
    stmt.run([
      row.orderId,
      row.customer,
      row.city,
      row.restaurant,
      row.category,
      row.orderValue,
      row.orderDate,
      row.deliveryMinutes,
      row.rating,
    ]);
  }
  stmt.free();
  return db;
}

const FORBIDDEN_KEYWORDS = /\b(drop|delete|update|insert|alter|attach|detach|pragma|vacuum|create|replace)\b/i;

export interface SqlExecutionResult {
  columns: string[];
  rows: Record<string, unknown>[];
  error: string | null;
}

export async function executeSqlQuery(
  _datasetId: "food-delivery",
  query: string
): Promise<SqlExecutionResult> {
  const trimmed = query.trim();
  if (!trimmed) return { columns: [], rows: [], error: "Write a query first." };
  if (trimmed.length > 4000) return { columns: [], rows: [], error: "Query is too long." };

  const withoutTrailingSemi = trimmed.replace(/;+\s*$/, "");
  if (withoutTrailingSemi.includes(";")) {
    return { columns: [], rows: [], error: "Only a single SELECT statement is allowed - remove the extra `;`." };
  }
  if (!/^select\b/i.test(withoutTrailingSemi)) {
    return { columns: [], rows: [], error: "Only SELECT queries are allowed in this read-only sandbox." };
  }
  if (FORBIDDEN_KEYWORDS.test(withoutTrailingSemi)) {
    return { columns: [], rows: [], error: "That keyword isn't allowed in this read-only sandbox." };
  }

  const SQL = await loadSqlJs();
  const db = await seedFoodDeliveryDb(SQL);
  try {
    const results = db.exec(withoutTrailingSemi);
    if (results.length === 0) return { columns: [], rows: [], error: null };
    const { columns, values } = results[0];
    const rows = values.map((row) => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
    return { columns, rows: rows.slice(0, 500), error: null };
  } catch (err) {
    return { columns: [], rows: [], error: err instanceof Error ? err.message : String(err) };
  } finally {
    db.close();
  }
}

// --- Grading ---------------------------------------------------------------

function normalizeCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") return String(Math.round(v * 100) / 100);
  return String(v).trim().toLowerCase();
}

function rowSatisfies(actualRow: Record<string, unknown>, expectedRow: Record<string, unknown>): boolean {
  const expectedEntries = Object.entries(expectedRow);
  const byKey = expectedEntries.every(([key, val]) => {
    const actualKey = Object.keys(actualRow).find((k) => k.toLowerCase() === key.toLowerCase());
    return actualKey !== undefined && normalizeCell(actualRow[actualKey]) === normalizeCell(val);
  });
  if (byKey) return true;

  // Fall back to positional match for a single-column expectation, so a
  // differently aliased column (e.g. `SELECT city AS c`) still grades fairly.
  if (expectedEntries.length === 1 && Object.keys(actualRow).length === 1) {
    const [, val] = expectedEntries[0];
    return normalizeCell(Object.values(actualRow)[0]) === normalizeCell(val);
  }
  return false;
}

function rowsMatch(
  actual: Record<string, unknown>[],
  expected: Record<string, unknown>[],
  orderMatters: boolean
): boolean {
  if (actual.length === 0 || expected.length === 0) return actual.length === expected.length;
  if (orderMatters) {
    return actual.length >= expected.length && expected.every((exp, i) => rowSatisfies(actual[i], exp));
  }
  const remaining = [...actual];
  for (const exp of expected) {
    const idx = remaining.findIndex((row) => rowSatisfies(row, exp));
    if (idx === -1) return false;
    remaining.splice(idx, 1);
  }
  return true;
}

function firstScalar(rows: Record<string, unknown>[]): unknown {
  const firstRow = rows[0];
  if (!firstRow) return undefined;
  const firstKey = Object.keys(firstRow)[0];
  return firstKey ? firstRow[firstKey] : undefined;
}

export interface SqlSubmissionInput {
  query: string;
  findingText?: string;
  chartCreated?: boolean;
}

export async function evaluateSqlTask(
  config: SqlTaskConfig,
  input: SqlSubmissionInput
): Promise<{ evaluation: EvaluationDetail; execution: SqlExecutionResult }> {
  const execution = await executeSqlQuery(config.datasetId, input.query);
  const breakdown: EvaluationBreakdownItem[] = [];

  if (execution.error) {
    breakdown.push({ label: "Query runs successfully", passed: false, detail: execution.error });
    return {
      evaluation: { summary: `Your query didn't run: ${execution.error}`, passed: false, breakdown },
      execution,
    };
  }
  breakdown.push({ label: "Query runs successfully", passed: true });

  let passed: boolean;
  let summary: string;

  if (config.validate.mode === "row-match") {
    const matched = rowsMatch(execution.rows, config.validate.expectedRows, config.validate.orderMatters ?? false);
    breakdown.push({ label: "Result matches the expected answer", passed: matched });
    passed = matched;
    summary = matched
      ? "Correct - your query returns the expected result."
      : "Not quite - your result doesn't match what we expected yet. Check the hint if you're stuck.";
  } else if (config.validate.mode === "scalar") {
    const scalar = firstScalar(execution.rows);
    const numeric = typeof scalar === "number" ? scalar : Number(scalar);
    const matched =
      Number.isFinite(numeric) && Math.abs(numeric - config.validate.expectedValue) <= (config.validate.tolerance ?? 0.01);
    breakdown.push({
      label: "Result matches the expected value",
      passed: matched,
      detail: `Got ${scalar ?? "no result"}, expected about ${config.validate.expectedValue}`,
    });
    passed = matched;
    summary = matched ? "Correct." : "Not quite - the value your query returns doesn't match.";
  } else {
    const hasRows = execution.rows.length >= (config.validate.minResultRows ?? 1);
    const findingOk = (input.findingText?.trim().length ?? 0) >= (config.validate.minFindingLength ?? 20);
    const chartOk = !config.requiresChart || Boolean(input.chartCreated);
    breakdown.push({ label: "Query returns results", passed: hasRows });
    breakdown.push({ label: "Finding written up", passed: findingOk });
    if (config.requiresChart) breakdown.push({ label: "Chart created", passed: chartOk });
    passed = hasRows && findingOk && chartOk;
    summary = passed
      ? "Nice exploration - your query, chart, and write-up all came together."
      : "Almost there - make sure you've run a query, built a chart, and written a few sentences about what you found.";
  }

  return { evaluation: { summary, passed, breakdown }, execution };
}
