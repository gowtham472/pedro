import type { DomainDefinition, LessonDefinition, TaskDefinition } from "@/types/content";

export const softwareDevelopmentDomain: DomainDefinition = {
  id: "software-development",
  name: "Software Development",
  tagline: "Programming fundamentals, debugging",
  description:
    "Write small programs, run them, and work through the errors. This day looks at how you learn syntax and respond when something breaks.",
  day: 1,
  accentToken: "mint",
  primarySkills: ["Programming fundamentals", "Debugging"],
  active: true,
  order: 1,
};

export const softwareDevelopmentLesson: LessonDefinition = {
  id: "lesson-software-development-day1",
  domainId: "software-development",
  day: 1,
  title: "Programming fundamentals",
  summary:
    "The building blocks every program is made of: variables, conditions, loops, functions, arrays - and what to do when your code doesn't run.",
  estimatedMinutes: 35,
  order: 1,
  sections: [
    {
      heading: "Variables and data types",
      visualId: "variables",
      body: "A variable is a named container for a value. In JavaScript you declare one with `let` or `const`. Values have types - numbers, strings, booleans, arrays, and objects are the ones you'll use most. `const total = 12;` creates a number that can't be reassigned. `let name = \"Ada\";` creates a string you can update later.",
    },
    {
      heading: "Conditions",
      visualId: "conditions",
      body: "`if` / `else` statements let a program choose between paths based on a condition. `if (score >= 70) { pass(); } else { retry(); }` runs one branch or the other, never both. Conditions evaluate to `true` or `false`, so comparison operators (`===`, `>`, `<=`) are the tools you reach for.",
    },
    {
      heading: "Loops",
      visualId: "loops",
      body: "Loops repeat a block of code. A `for` loop is explicit about how many times it runs: `for (let i = 0; i < n; i++) { ... }`. Most bugs in loops come from off-by-one errors - starting or stopping one step too early or too late. When a loop misbehaves, print the loop variable on each pass to see what's actually happening.",
    },
    {
      heading: "Functions",
      visualId: "functions",
      body: "A function packages logic you want to reuse, with inputs (parameters) and an output (`return`). `function double(n) { return n * 2; }` takes one input and returns one output. Naming a function well is half of writing it - `double` tells you exactly what to expect.",
    },
    {
      heading: "Arrays",
      visualId: "arrays",
      body: "An array is an ordered list of values: `const scores = [88, 92, 74];`. You'll read items by index (`scores[0]`), find the length (`scores.length`), and loop over them to compute something - a sum, a maximum, a filtered subset.",
    },
    {
      heading: "Basic debugging",
      visualId: "debugging",
      body: "When code doesn't do what you expect: read the error message first, it usually names the line and the problem. Then check your assumptions with `console.log` at the point things go wrong. Debugging is a normal, repeated part of writing software - not a sign something is wrong with you.",
    },
  ],
};

export const softwareDevelopmentTasks: TaskDefinition[] = [
  {
    id: "swdev-01-conditional-print",
    domainId: "software-development",
    lessonId: "lesson-software-development-day1",
    day: 1,
    title: "Print numbers by a rule",
    description:
      "Write a function that prints numbers from 1 to n, replacing multiples of 3 with \"Fizz\", multiples of 5 with \"Buzz\", and multiples of both with \"FizzBuzz\".",
    instructions:
      "Implement `solve(n)`. It should return an array of strings, one per number from 1 to `n` inclusive.\n\n- If the number is divisible by 3 and 5, use `\"FizzBuzz\"`.\n- Else if divisible by 3, use `\"Fizz\"`.\n- Else if divisible by 5, use `\"Buzz\"`.\n- Otherwise use the number itself, as a string.\n\nExample: `solve(5)` → `[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]`",
    difficulty: "beginner",
    estimatedMinutes: 10,
    learningObjectives: ["Conditions", "Loops", "The modulo operator"],
    prerequisiteConcepts: ["variables", "loops", "conditions"],
    passingScore: 70,
    order: 1,
    basePoints: 50,
    hints: [
      { order: 1, text: "The modulo operator `%` gives you the remainder of a division - `n % 3 === 0` means n is a multiple of 3." },
      { order: 2, text: "Check the \"divisible by both\" case before checking 3 or 5 alone, otherwise it will never be reached." },
      { order: 3, text: "Build up an array with `push` inside a `for` loop from 1 to n, then return it." },
    ],
    config: {
      type: "code",
      language: "javascript",
      functionName: "solve",
      starterCode:
        "function solve(n) {\n  const result = [];\n  // your code here\n  return result;\n}",
      timeLimitMs: 4000,
      testCases: [
        { id: "t1", args: [1], expected: ["1"], description: "n = 1" },
        { id: "t2", args: [3], expected: ["1", "2", "Fizz"], description: "n = 3" },
        { id: "t3", args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"], description: "n = 5" },
        {
          id: "t4",
          args: [15],
          expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"],
          hidden: true,
          description: "n = 15 (checks FizzBuzz case)",
        },
      ],
      variants: {
        python: {
          starterCode: `def solve(n):\n    result = []\n    # your code here\n    return result\n`,
        },
        java: {
          starterCode: `class Solution {\n  static String[] solve(int n) {\n    String[] result = new String[n];\n    // your code here\n    return result;\n  }\n}\n`,
          driver: `class Main {\n  public static void main(String[] args) {\n    int[] tests = {1, 3, 5, 15};\n    StringBuilder out = new StringBuilder("[");\n    for (int i = 0; i < tests.length; i++) {\n      if (i > 0) out.append(',');\n      out.append(Canon.j(Solution.solve(tests[i])));\n    }\n    out.append(']');\n    System.out.println("__PEDRO__" + out);\n  }\n}\n`,
        },
        c: {
          starterCode: `/* Fill result[i] with the text for number i+1 (i = 0 .. n-1).\n   Each result[i] is a char buffer of size 12 - use strcpy or sprintf. */\nvoid solve(int n, char result[][12]) {\n  /* your code here */\n}\n`,
          driver: `static void run_case(int n, int first) {\n  char result[64][12];\n  solve(n, result);\n  if (!first) putchar(',');\n  putchar('[');\n  for (int i = 0; i < n; i++) { if (i > 0) putchar(','); canon_str(result[i]); }\n  putchar(']');\n}\nint main(void) {\n  printf("__PEDRO__[");\n  run_case(1, 1); run_case(3, 0); run_case(5, 0); run_case(15, 0);\n  printf("]\\n");\n  return 0;\n}\n`,
        },
      },
    },
  },
  {
    id: "swdev-02-array-max",
    domainId: "software-development",
    lessonId: "lesson-software-development-day1",
    day: 1,
    title: "Find the largest value",
    description: "Write a function that returns the largest number in an array.",
    instructions:
      "Implement `solve(arr)`, which takes an array of numbers and returns the largest one. The array will always have at least one number, and may include negative numbers.\n\nExample: `solve([3, 1, 4, 1, 5])` → `5`",
    difficulty: "intermediate",
    estimatedMinutes: 8,
    learningObjectives: ["Array iteration", "Tracking a running value"],
    prerequisiteConcepts: ["arrays", "loops", "conditions"],
    passingScore: 70,
    order: 2,
    basePoints: 75,
    hints: [
      { order: 1, text: "Start by assuming the first element is the largest, then compare it against the rest." },
      { order: 2, text: "JavaScript's built-in `Math.max(...arr)` can do this in one line - try the loop version first, then compare." },
    ],
    config: {
      type: "code",
      language: "javascript",
      functionName: "solve",
      starterCode: "function solve(arr) {\n  // your code here\n}",
      timeLimitMs: 4000,
      testCases: [
        { id: "t1", args: [[3, 1, 4, 1, 5, 9, 2, 6]], expected: 9 },
        { id: "t2", args: [[-5, -1, -10]], expected: -1, description: "all negative" },
        { id: "t3", args: [[7]], expected: 7, description: "single element" },
        { id: "t4", args: [[2, 2, 2]], expected: 2, hidden: true, description: "all equal" },
      ],
      variants: {
        python: {
          starterCode: `def solve(arr):\n    # your code here\n    pass\n`,
        },
        java: {
          starterCode: `class Solution {\n  static int solve(int[] arr) {\n    // your code here\n    return 0;\n  }\n}\n`,
          driver: `class Main {\n  public static void main(String[] args) {\n    int[][] tests = {{3, 1, 4, 1, 5, 9, 2, 6}, {-5, -1, -10}, {7}, {2, 2, 2}};\n    StringBuilder out = new StringBuilder("[");\n    for (int i = 0; i < tests.length; i++) {\n      if (i > 0) out.append(',');\n      out.append(Canon.j(Solution.solve(tests[i])));\n    }\n    out.append(']');\n    System.out.println("__PEDRO__" + out);\n  }\n}\n`,
        },
        c: {
          starterCode: `int solve(const int* arr, int len) {\n  /* your code here */\n  return 0;\n}\n`,
          driver: `int main(void) {\n  int t1[] = {3, 1, 4, 1, 5, 9, 2, 6};\n  int t2[] = {-5, -1, -10};\n  int t3[] = {7};\n  int t4[] = {2, 2, 2};\n  printf("__PEDRO__[%d,%d,%d,%d]\\n", solve(t1, 8), solve(t2, 3), solve(t3, 1), solve(t4, 3));\n  return 0;\n}\n`,
        },
      },
    },
  },
  {
    id: "swdev-03-palindrome",
    domainId: "software-development",
    lessonId: "lesson-software-development-day1",
    day: 1,
    title: "Check for a palindrome",
    description:
      "Write a function that checks whether a string reads the same forwards and backwards, ignoring case, spaces, and punctuation.",
    instructions:
      "Implement `solve(str)`, returning `true` if `str` is a palindrome once you ignore letter case and any character that isn't a letter or digit, and `false` otherwise.\n\nExample: `solve(\"A man a plan a canal Panama\")` → `true`",
    difficulty: "challenge",
    estimatedMinutes: 12,
    learningObjectives: ["String manipulation", "Regular expressions basics"],
    prerequisiteConcepts: ["strings", "loops", "functions"],
    passingScore: 70,
    order: 3,
    basePoints: 100,
    hints: [
      { order: 1, text: "Normalize first: lowercase the string, then strip out anything that isn't a letter or number." },
      { order: 2, text: "A string reversed equals `str.split(\"\").reverse().join(\"\")`. Compare the normalized string to its reverse." },
    ],
    config: {
      type: "code",
      language: "javascript",
      functionName: "solve",
      starterCode: "function solve(str) {\n  // your code here\n}",
      timeLimitMs: 4000,
      testCases: [
        { id: "t1", args: ["A man a plan a canal Panama"], expected: true },
        { id: "t2", args: ["Not a palindrome"], expected: false },
        { id: "t3", args: [""], expected: true, description: "empty string" },
        { id: "t4", args: ["Race car!"], expected: true, hidden: true },
        { id: "t5", args: ["hello"], expected: false, hidden: true },
      ],
      variants: {
        python: {
          starterCode: `def solve(s):\n    # your code here - return True or False\n    pass\n`,
        },
        java: {
          starterCode: `class Solution {\n  static boolean solve(String s) {\n    // your code here\n    return false;\n  }\n}\n`,
          driver: `class Main {\n  public static void main(String[] args) {\n    String[] tests = {"A man a plan a canal Panama", "Not a palindrome", "", "Race car!", "hello"};\n    StringBuilder out = new StringBuilder("[");\n    for (int i = 0; i < tests.length; i++) {\n      if (i > 0) out.append(',');\n      out.append(Canon.j(Solution.solve(tests[i])));\n    }\n    out.append(']');\n    System.out.println("__PEDRO__" + out);\n  }\n}\n`,
        },
        c: {
          starterCode: `/* Return 1 if s is a palindrome (ignoring case and any character\n   that isn't a letter or digit), otherwise 0. */\nint solve(const char* s) {\n  /* your code here */\n  return 0;\n}\n`,
          driver: `static void run_case(const char* s, int first) {\n  if (!first) putchar(',');\n  printf("%s", solve(s) ? "true" : "false");\n}\nint main(void) {\n  printf("__PEDRO__[");\n  run_case("A man a plan a canal Panama", 1);\n  run_case("Not a palindrome", 0);\n  run_case("", 0);\n  run_case("Race car!", 0);\n  run_case("hello", 0);\n  printf("]\\n");\n  return 0;\n}\n`,
        },
      },
    },
  },
];
