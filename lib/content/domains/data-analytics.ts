import type { DomainDefinition, LessonDefinition, TaskDefinition } from "@/types/content";

export const dataAnalyticsDomain: DomainDefinition = {
  id: "data-analytics",
  name: "Data & Analytics",
  tagline: "SQL, data interpretation, visualization",
  description:
    "Pull answers out of a table with SQL, then decide how to show them. Today looks at analytical reasoning and comfort with structured information.",
  day: 4,
  accentToken: "cyan",
  primarySkills: ["SQL", "Data interpretation", "Visualization"],
  active: true,
  order: 4,
};

export const dataAnalyticsLesson: LessonDefinition = {
  id: "lesson-data-analytics-day4",
  domainId: "data-analytics",
  day: 4,
  title: "Data & analytics",
  summary:
    "Tables, SQL SELECT, filtering, sorting, aggregation, GROUP BY, basic JOIN concepts, and turning a result set into a chart.",
  estimatedMinutes: 35,
  order: 1,
  sections: [
    {
      heading: "Tables and SELECT",
      visualId: "sql-select",
      body: "Data lives in tables: rows are records, columns are fields. `SELECT column_a, column_b FROM table_name;` reads specific columns. `SELECT * FROM table_name;` reads everything - useful for exploring, but usually not what you want in a final query.",
    },
    {
      heading: "Filtering with WHERE",
      visualId: "sql-where",
      body: "`WHERE` narrows down which rows you see: `SELECT * FROM orders WHERE city = 'Rivertown';`. Combine conditions with `AND` / `OR`, and use `ORDER BY column DESC` to sort the result.",
    },
    {
      heading: "Aggregation and GROUP BY",
      visualId: "sql-groupby",
      body: "Aggregate functions summarize many rows into one number: `SUM()`, `AVG()`, `COUNT()`, `MAX()`, `MIN()`. `GROUP BY` runs that summary separately for each distinct value of a column - `SELECT city, SUM(order_value) FROM orders GROUP BY city;` gives you total revenue per city in one query.",
    },
    {
      heading: "Basic JOIN concepts",
      visualId: "sql-join",
      body: "A JOIN combines rows from two tables that share a key - for example, an `orders` table and a `customers` table joined on `customer_id`. Today's dataset is a single table, but most real analytics work involves joining several.",
    },
    {
      heading: "Charts",
      visualId: "charts",
      body: "A well-chosen chart makes a pattern obvious that a table of numbers hides. Bar charts compare categories; line charts show change over time. The goal isn't decoration - it's making the answer visible at a glance.",
    },
  ],
};

export const dataAnalyticsTasks: TaskDefinition[] = [
  {
    id: "data-01-top-city",
    domainId: "data-analytics",
    lessonId: "lesson-data-analytics-day4",
    day: 4,
    title: "Find the highest-revenue city",
    description: "Query the orders table to find which city generated the most total revenue.",
    instructions:
      "The `orders` table has columns: `order_id, customer, city, restaurant, category, order_value, order_date, delivery_minutes, rating`.\n\nWrite a query that returns the single city with the highest total `order_value`.",
    difficulty: "beginner",
    estimatedMinutes: 10,
    learningObjectives: ["GROUP BY", "SUM()", "ORDER BY ... LIMIT"],
    prerequisiteConcepts: ["SELECT", "aggregation"],
    passingScore: 70,
    order: 1,
    basePoints: 50,
    hints: [
      { order: 1, text: "Group the rows by `city`, and sum `order_value` within each group." },
      { order: 2, text: "Sort the grouped results by the summed value in descending order, then take the first row with LIMIT 1." },
    ],
    config: {
      type: "sql",
      datasetId: "food-delivery",
      starterQuery: "SELECT city, SUM(order_value) AS revenue\nFROM orders\nGROUP BY city\n-- add ORDER BY and LIMIT",
      expectedQueryDescription: "The city with the highest total order_value.",
      validate: { mode: "row-match", expectedRows: [{ city: "Rivertown" }] },
    },
  },
  {
    id: "data-02-top-category",
    domainId: "data-analytics",
    lessonId: "lesson-data-analytics-day4",
    day: 4,
    title: "Find the highest-selling category",
    description: "Query the orders table to find which food category sold the most orders.",
    instructions:
      "Write a query that returns the single `category` with the highest number of orders (row count), not the highest revenue.",
    difficulty: "beginner",
    estimatedMinutes: 10,
    learningObjectives: ["COUNT()", "GROUP BY"],
    prerequisiteConcepts: ["SELECT", "aggregation"],
    passingScore: 70,
    order: 2,
    basePoints: 60,
    hints: [
      { order: 1, text: "`COUNT(*)` counts rows within each group - that's order count, not revenue." },
    ],
    config: {
      type: "sql",
      datasetId: "food-delivery",
      starterQuery: "SELECT category, COUNT(*) AS orders\nFROM orders\nGROUP BY category\n-- add ORDER BY and LIMIT",
      expectedQueryDescription: "The category with the most orders.",
      validate: { mode: "row-match", expectedRows: [{ category: "Chinese" }] },
    },
  },
  {
    id: "data-03-average-order-value",
    domainId: "data-analytics",
    lessonId: "lesson-data-analytics-day4",
    day: 4,
    title: "Calculate the average order value",
    description: "Query the orders table to find the average order value across every order.",
    instructions: "Write a query that returns a single number: the average `order_value` across all rows in `orders`.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    learningObjectives: ["AVG()"],
    prerequisiteConcepts: ["aggregation"],
    passingScore: 70,
    order: 3,
    basePoints: 70,
    hints: [{ order: 1, text: "`AVG(order_value)` computes the mean directly - no GROUP BY needed here." }],
    config: {
      type: "sql",
      datasetId: "food-delivery",
      starterQuery: "SELECT AVG(order_value) AS avg_value\nFROM orders;",
      expectedQueryDescription: "The overall average order value.",
      validate: { mode: "scalar", expectedValue: 292.17, tolerance: 0.5 },
    },
  },
  {
    id: "data-04-explore-pattern",
    domainId: "data-analytics",
    lessonId: "lesson-data-analytics-day4",
    day: 4,
    title: "Find an unusual pattern",
    description: "Explore the dataset freely, chart something interesting, and describe what you found.",
    instructions:
      "Write one or more queries to explore the dataset beyond the previous questions. Look at averages, counts, or comparisons broken down by city, restaurant, or category.\n\nWhen something looks unusual, build a chart from your query result, then describe what you noticed in a sentence or two. There's no single right answer - this task is scored on genuine exploration, not a specific query.",
    difficulty: "challenge",
    estimatedMinutes: 20,
    learningObjectives: ["Open-ended exploration", "Choosing what to chart", "Communicating a finding"],
    prerequisiteConcepts: ["aggregation", "GROUP BY", "charts"],
    passingScore: 60,
    order: 4,
    basePoints: 100,
    hints: [
      { order: 1, text: "Try comparing average order value (not just count) across cities or restaurants - a place with few orders can still stand out." },
      { order: 2, text: "GROUP BY city, restaurant together to compare restaurants within their own city." },
    ],
    config: {
      type: "sql",
      datasetId: "food-delivery",
      starterQuery:
        "SELECT city, restaurant, COUNT(*) AS orders, AVG(order_value) AS avg_value\nFROM orders\nGROUP BY city, restaurant\nORDER BY avg_value DESC;",
      expectedQueryDescription: "Any query that surfaces a genuine pattern in the data.",
      requiresChart: true,
      validate: {
        mode: "open-ended",
        minResultRows: 1,
        findingPrompt: "What unusual pattern did you notice, and what query showed it to you?",
        minFindingLength: 20,
      },
    },
  },
];
