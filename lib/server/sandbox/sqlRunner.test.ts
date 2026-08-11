import { describe, expect, it } from "vitest";
import { evaluateSqlTask, executeSqlQuery } from "./sqlRunner";
import { dataAnalyticsTasks } from "@/lib/content/domains/data-analytics";
import type { SqlTaskConfig } from "@/types/content";

function sqlConfig(taskId: string): SqlTaskConfig {
  const task = dataAnalyticsTasks.find((t) => t.id === taskId);
  if (!task || task.config.type !== "sql") throw new Error("fixture missing: " + taskId);
  return task.config;
}

describe("executeSqlQuery", () => {
  it("runs a basic SELECT against the seeded dataset", async () => {
    const result = await executeSqlQuery("food-delivery", "SELECT COUNT(*) AS n FROM orders");
    expect(result.error).toBeNull();
    expect(result.rows[0].n).toBe(42);
  });

  it("rejects non-SELECT statements", async () => {
    const result = await executeSqlQuery("food-delivery", "DELETE FROM orders");
    expect(result.error).toContain("SELECT");
  });

  it("rejects stacked statements", async () => {
    const result = await executeSqlQuery("food-delivery", "SELECT 1; DROP TABLE orders");
    expect(result.error).toBeTruthy();
  });

  it("surfaces a real SQL syntax error", async () => {
    const result = await executeSqlQuery("food-delivery", "SELECT FROM WHERE");
    expect(result.error).toBeTruthy();
  });
});

describe("evaluateSqlTask", () => {
  it("grades the highest-revenue-city task correctly for a correct query", async () => {
    const config = sqlConfig("data-01-top-city");
    const { evaluation } = await evaluateSqlTask(config, {
      query: "SELECT city, SUM(order_value) AS revenue FROM orders GROUP BY city ORDER BY revenue DESC LIMIT 1",
    });
    expect(evaluation.passed).toBe(true);
  });

  it("fails the highest-revenue-city task for a wrong query", async () => {
    const config = sqlConfig("data-01-top-city");
    const { evaluation } = await evaluateSqlTask(config, {
      // Deliberately wrong: ASC instead of DESC picks the lowest-revenue city.
      query: "SELECT city, SUM(order_value) AS revenue FROM orders GROUP BY city ORDER BY revenue ASC LIMIT 1",
    });
    expect(evaluation.passed).toBe(false);
  });

  it("grades the average-order-value scalar task within tolerance", async () => {
    const config = sqlConfig("data-03-average-order-value");
    const { evaluation } = await evaluateSqlTask(config, {
      query: "SELECT AVG(order_value) FROM orders",
    });
    expect(evaluation.passed).toBe(true);
  });

  it("passes the open-ended exploration task when a query, chart, and finding are all present", async () => {
    const config = sqlConfig("data-04-explore-pattern");
    const { evaluation } = await evaluateSqlTask(config, {
      query: "SELECT city, restaurant, AVG(order_value) FROM orders GROUP BY city, restaurant",
      findingText: "Lakeside has far fewer orders but the highest average order value by a wide margin.",
      chartCreated: true,
    });
    expect(evaluation.passed).toBe(true);
  });

  it("fails the open-ended task when no chart was created", async () => {
    const config = sqlConfig("data-04-explore-pattern");
    const { evaluation } = await evaluateSqlTask(config, {
      query: "SELECT city, restaurant, AVG(order_value) FROM orders GROUP BY city, restaurant",
      findingText: "Lakeside has far fewer orders but the highest average order value by a wide margin.",
      chartCreated: false,
    });
    expect(evaluation.passed).toBe(false);
  });
});
