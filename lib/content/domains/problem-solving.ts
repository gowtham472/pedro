import type { DomainDefinition, LessonDefinition, TaskDefinition } from "@/types/content";

export const problemSolvingDomain: DomainDefinition = {
  id: "problem-solving",
  name: "Problem Solving & DSA",
  tagline: "Logic, algorithms, structured reasoning",
  description:
    "Separate the logic from the syntax. Today is about how you break a problem into steps, not which language you write it in.",
  day: 2,
  accentToken: "cream",
  primarySkills: ["Algorithmic thinking", "Searching & sorting", "Complexity intuition"],
  active: true,
  order: 2,
};

export const problemSolvingLesson: LessonDefinition = {
  id: "lesson-problem-solving-day2",
  domainId: "problem-solving",
  day: 2,
  title: "Problem solving & DSA",
  summary:
    "How to break an unfamiliar problem into steps, and the handful of array techniques that solve most of them.",
  estimatedMinutes: 30,
  order: 1,
  sections: [
    {
      heading: "Algorithmic thinking",
      visualId: "algo-thinking",
      body: "An algorithm is just a sequence of precise steps that gets you from an input to an output. Before writing any code, restate the problem in your own words, then work a small example by hand. If you can't do it on paper, you can't do it in code yet.",
    },
    {
      heading: "Breaking a problem into steps",
      visualId: "decompose",
      body: "Large problems get easier when split into smaller ones. \"Find the second-largest value\" becomes: find the largest, remove it (conceptually), find the largest of what's left. Naming the sub-steps out loud is often the fastest way to find your approach.",
    },
    {
      heading: "Arrays, searching, and sorting",
      visualId: "search-sort",
      body: "Most structured-reasoning problems reduce to scanning an array once or twice, or sorting it first to make the scan easier. Sorting costs time but often simplifies the logic that follows - that trade-off is worth noticing.",
    },
    {
      heading: "Complexity intuition",
      visualId: "complexity",
      body: "You don't need Big-O notation to build the right instinct: a solution that checks every pair of elements (a loop inside a loop) gets slow fast as the input grows. A solution that makes a single pass, remembering what it's seen, usually scales much better. Noticing \"I'm about to write a loop inside a loop\" is a useful trigger to ask whether there's a faster way.",
    },
  ],
};

export const problemSolvingTasks: TaskDefinition[] = [
  {
    id: "dsa-01-find-duplicates",
    domainId: "problem-solving",
    lessonId: "lesson-problem-solving-day2",
    day: 2,
    title: "Find duplicates",
    description: "Given an array of numbers, return every value that appears more than once.",
    instructions:
      "Implement `solve(arr)`. Return an array of the values that appear more than once in `arr`, each included only once, sorted in ascending order.\n\nExample: `solve([1, 2, 3, 2, 4, 3, 3])` → `[2, 3]`",
    difficulty: "beginner",
    estimatedMinutes: 10,
    learningObjectives: ["Counting occurrences", "Using a Map or object as a tally"],
    prerequisiteConcepts: ["arrays", "loops"],
    passingScore: 70,
    order: 1,
    basePoints: 50,
    hints: [
      { order: 1, text: "Keep a running count of how many times you've seen each value, e.g. with a `Map`." },
      { order: 2, text: "After counting, collect the keys whose count is greater than 1, then sort them." },
    ],
    config: {
      type: "code",
      language: "javascript",
      functionName: "solve",
      starterCode: "function solve(arr) {\n  // your code here\n}",
      timeLimitMs: 4000,
      testCases: [
        { id: "t1", args: [[1, 2, 3, 2, 4, 3, 3]], expected: [2, 3] },
        { id: "t2", args: [[1, 2, 3]], expected: [], description: "no duplicates" },
        { id: "t3", args: [[5, 5, 5, 5]], expected: [5] },
        { id: "t4", args: [[4, 1, 4, 2, 1, 3]], expected: [1, 4], hidden: true },
      ],
      variants: {
        python: {
          starterCode: `def solve(arr):\n    # return a sorted list of the values that appear more than once\n    pass\n`,
        },
        java: {
          starterCode: `class Solution {\n  static int[] solve(int[] arr) {\n    // return a sorted array of the values that appear more than once\n    return new int[0];\n  }\n}\n`,
          driver: `class Main {\n  public static void main(String[] args) {\n    int[][] tests = {{1, 2, 3, 2, 4, 3, 3}, {1, 2, 3}, {5, 5, 5, 5}, {4, 1, 4, 2, 1, 3}};\n    StringBuilder out = new StringBuilder("[");\n    for (int i = 0; i < tests.length; i++) {\n      if (i > 0) out.append(',');\n      out.append(Canon.j(Solution.solve(tests[i])));\n    }\n    out.append(']');\n    System.out.println("__PEDRO__" + out);\n  }\n}\n`,
        },
        c: {
          starterCode: `/* Write the duplicated values into out[] in ascending order and\n   return how many you wrote. out has room for len values. */\nint solve(const int* arr, int len, int* out) {\n  /* your code here */\n  return 0;\n}\n`,
          driver: `static void run_case(const int* arr, int len, int first) {\n  int out[64];\n  int count = solve(arr, len, out);\n  if (!first) putchar(',');\n  canon_int_array(out, count);\n}\nint main(void) {\n  int t1[] = {1, 2, 3, 2, 4, 3, 3};\n  int t2[] = {1, 2, 3};\n  int t3[] = {5, 5, 5, 5};\n  int t4[] = {4, 1, 4, 2, 1, 3};\n  printf("__PEDRO__[");\n  run_case(t1, 7, 1); run_case(t2, 3, 0); run_case(t3, 4, 0); run_case(t4, 6, 0);\n  printf("]\\n");\n  return 0;\n}\n`,
        },
      },
    },
  },
  {
    id: "dsa-02-second-largest",
    domainId: "problem-solving",
    lessonId: "lesson-problem-solving-day2",
    day: 2,
    title: "Find the second-largest value",
    description: "Given an array of numbers, return the second-largest distinct value.",
    instructions:
      "Implement `solve(arr)`. Return the second-largest *distinct* value in `arr`. If there are fewer than two distinct values, return `null`.\n\nExample: `solve([4, 1, 3, 2])` → `3`",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    learningObjectives: ["Deduplication", "Sorting", "Edge cases"],
    prerequisiteConcepts: ["arrays", "sorting concepts"],
    passingScore: 70,
    order: 2,
    basePoints: 75,
    hints: [
      { order: 1, text: "A `Set` removes duplicates for you: `new Set(arr)`." },
      { order: 2, text: "Convert the set back to an array, sort it descending, and consider what happens if it has fewer than 2 items." },
    ],
    config: {
      type: "code",
      language: "javascript",
      functionName: "solve",
      starterCode: "function solve(arr) {\n  // your code here\n}",
      timeLimitMs: 4000,
      testCases: [
        { id: "t1", args: [[4, 1, 3, 2]], expected: 3 },
        { id: "t2", args: [[10, 10, 9]], expected: 9, description: "duplicate largest value" },
        { id: "t3", args: [[5, 5, 5]], expected: null, description: "only one distinct value" },
        { id: "t4", args: [[2, 3]], expected: 2, hidden: true },
      ],
      variants: {
        python: {
          starterCode: `def solve(arr):\n    # return the second-largest distinct value, or None if there isn't one\n    pass\n`,
        },
        java: {
          starterCode: `class Solution {\n  static Integer solve(int[] arr) {\n    // return the second-largest distinct value, or null if there isn't one\n    return null;\n  }\n}\n`,
          driver: `class Main {\n  public static void main(String[] args) {\n    int[][] tests = {{4, 1, 3, 2}, {10, 10, 9}, {5, 5, 5}, {2, 3}};\n    StringBuilder out = new StringBuilder("[");\n    for (int i = 0; i < tests.length; i++) {\n      if (i > 0) out.append(',');\n      out.append(Canon.j(Solution.solve(tests[i])));\n    }\n    out.append(']');\n    System.out.println("__PEDRO__" + out);\n  }\n}\n`,
        },
        c: {
          starterCode: `/* Return the second-largest distinct value. If there isn't one\n   (fewer than 2 distinct values), set *found = 0 instead. *found\n   starts at 1. */\nint solve(const int* arr, int len, int* found) {\n  /* your code here */\n  *found = 0;\n  return 0;\n}\n`,
          driver: `static void run_case(const int* arr, int len, int first) {\n  int found = 1;\n  int v = solve(arr, len, &found);\n  if (!first) putchar(',');\n  if (found) printf("%d", v); else printf("null");\n}\nint main(void) {\n  int t1[] = {4, 1, 3, 2};\n  int t2[] = {10, 10, 9};\n  int t3[] = {5, 5, 5};\n  int t4[] = {2, 3};\n  printf("__PEDRO__[");\n  run_case(t1, 4, 1); run_case(t2, 3, 0); run_case(t3, 3, 0); run_case(t4, 2, 0);\n  printf("]\\n");\n  return 0;\n}\n`,
        },
      },
    },
  },
  {
    id: "dsa-03-two-sum",
    domainId: "problem-solving",
    lessonId: "lesson-problem-solving-day2",
    day: 2,
    title: "Optimize a brute-force check",
    description:
      "Given an array of numbers and a target, determine whether any two elements add up to the target - without comparing every pair.",
    instructions:
      "Implement `solve(arr, target)`. Return `true` if any two elements at different positions in `arr` add up to `target`, otherwise `false`.\n\nA nested loop comparing every pair works, but scales poorly. Try to solve it by scanning the array once, remembering what you've seen.\n\nExample: `solve([2, 7, 11, 15], 9)` → `true` (2 + 7)",
    difficulty: "challenge",
    estimatedMinutes: 15,
    learningObjectives: ["Trading memory for speed", "Hash-based lookups"],
    prerequisiteConcepts: ["arrays", "complexity intuition"],
    passingScore: 70,
    order: 3,
    basePoints: 100,
    hints: [
      { order: 1, text: "For each number, the value you need to find is `target - number`." },
      { order: 2, text: "Keep a `Set` of numbers you've already visited. Before adding the current number, check whether its complement is already in the set." },
    ],
    config: {
      type: "code",
      language: "javascript",
      functionName: "solve",
      starterCode: "function solve(arr, target) {\n  // your code here\n}",
      timeLimitMs: 4000,
      testCases: [
        { id: "t1", args: [[2, 7, 11, 15], 9], expected: true },
        { id: "t2", args: [[3, 2, 4], 6], expected: true },
        { id: "t3", args: [[3, 3], 6], expected: true, description: "same value, two positions" },
        { id: "t4", args: [[1, 2, 3], 50], expected: false, hidden: true },
      ],
      variants: {
        python: {
          starterCode: `def solve(arr, target):\n    # return True if two different positions sum to target, else False\n    pass\n`,
        },
        java: {
          starterCode: `class Solution {\n  static boolean solve(int[] arr, int target) {\n    // your code here\n    return false;\n  }\n}\n`,
          driver: `class Main {\n  public static void main(String[] args) {\n    int[][] tests = {{2, 7, 11, 15}, {3, 2, 4}, {3, 3}, {1, 2, 3}};\n    int[] targets = {9, 6, 6, 50};\n    StringBuilder out = new StringBuilder("[");\n    for (int i = 0; i < tests.length; i++) {\n      if (i > 0) out.append(',');\n      out.append(Canon.j(Solution.solve(tests[i], targets[i])));\n    }\n    out.append(']');\n    System.out.println("__PEDRO__" + out);\n  }\n}\n`,
        },
        c: {
          starterCode: `/* Return 1 if two different positions in arr sum to target, else 0. */\nint solve(const int* arr, int len, int target) {\n  /* your code here */\n  return 0;\n}\n`,
          driver: `static void run_case(const int* arr, int len, int target, int first) {\n  if (!first) putchar(',');\n  printf("%s", solve(arr, len, target) ? "true" : "false");\n}\nint main(void) {\n  int t1[] = {2, 7, 11, 15};\n  int t2[] = {3, 2, 4};\n  int t3[] = {3, 3};\n  int t4[] = {1, 2, 3};\n  printf("__PEDRO__[");\n  run_case(t1, 4, 9, 1); run_case(t2, 3, 6, 0); run_case(t3, 2, 6, 0); run_case(t4, 3, 50, 0);\n  printf("]\\n");\n  return 0;\n}\n`,
        },
      },
    },
  },
];
