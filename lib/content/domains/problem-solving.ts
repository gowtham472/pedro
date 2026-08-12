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
  estimatedMinutes: 45,
  order: 1,
  sections: [
    {
      heading: "Algorithmic thinking",
      visualId: "algo-thinking",
      body: "Yesterday you learned the words - variables, loops, conditions. Today is about the sentences: **algorithms**, precise step-by-step plans that get you from an input to an output.\n\nThe skill isn't knowing fancy algorithms. It's this habit: restate the problem in your own words, work one small example **by hand on paper**, and only then write code. If you can't do it on paper, you can't do it in code yet - and if you can, the code is mostly translation. Everything on this page works in whichever language you picked yesterday.",
    },
    {
      heading: "Breaking a problem into steps",
      visualId: "decompose",
      body: "Big problems refuse to be solved all at once - so don't. Split them into steps small enough that each one is obvious.\n\n\"Find the second-largest value\" feels slippery until you split it: (1) find the largest, (2) ignore it, (3) find the largest of what's left. Each step is something you already know how to do from Day 1. Naming the sub-steps out loud - or as comments in your code before writing any logic - is often the fastest way to find your approach.",
    },
    {
      heading: "Pattern 1: the single-pass scan",
      visualId: "search-sort",
      body: "The most-used tool in this whole domain: walk the array **once**, carrying a little state with you - a \"best so far\", a running total, a count.\n\nYou saw this shape yesterday for finding a maximum. The trick that unlocks harder problems: carry **two** pieces of state. Second-largest? Track the best *and* the second-best, updating both as you walk. One pass, no sorting, works on a million items.",
      codeExample: {
        title: "One pass, tracking the best so far",
        code: {
          javascript: `function largest(arr) {\n  let best = arr[0];\n  for (const v of arr) {\n    if (v > best) {\n      best = v;    // met something bigger - remember it\n    }\n  }\n  return best;\n}`,
          python: `def largest(arr):\n    best = arr[0]\n    for v in arr:\n        if v > best:\n            best = v    # met something bigger - remember it\n    return best`,
          java: `static int largest(int[] arr) {\n  int best = arr[0];\n  for (int v : arr) {\n    if (v > best) {\n      best = v;    // met something bigger - remember it\n    }\n  }\n  return best;\n}`,
          c: `int largest(const int* arr, int len) {\n  int best = arr[0];\n  for (int i = 1; i < len; i++) {\n    if (arr[i] > best) {\n      best = arr[i];   /* met something bigger */\n    }\n  }\n  return best;\n}`,
        },
      },
    },
    {
      heading: "Pattern 2: counting with a tally",
      body: "\"How many times does each value appear?\" comes up constantly - duplicates, most-common, frequency of anything. The tool is a **tally**: a structure that maps each value to its count. JavaScript calls it a `Map`, Python a dictionary, Java a `HashMap`.\n\nWalk the array once; for each value, add 1 to its tally entry. Afterwards the tally holds every answer at once: which values appeared, and how often. C has no built-in map - the honest C approach is comparing pairs with two loops, which still works fine at today's sizes.",
      codeExample: {
        title: "Tallying how often each value appears",
        code: {
          javascript: `const counts = new Map();\nfor (const v of arr) {\n  counts.set(v, (counts.get(v) ?? 0) + 1);\n}\n\n// counts.get(3) → how many times 3 appeared\nfor (const [value, count] of counts) {\n  if (count > 1) {\n    // value is a duplicate\n  }\n}`,
          python: `counts = {}\nfor v in arr:\n    counts[v] = counts.get(v, 0) + 1\n\n# counts[3] → how many times 3 appeared\nfor value, count in counts.items():\n    if count > 1:\n        pass  # value is a duplicate`,
          java: `Map<Integer, Integer> counts = new HashMap<>();\nfor (int v : arr) {\n  counts.merge(v, 1, Integer::sum);  // add 1, starting at 0\n}\n\nfor (Map.Entry<Integer, Integer> e : counts.entrySet()) {\n  if (e.getValue() > 1) {\n    // e.getKey() is a duplicate\n  }\n}`,
          c: `/* C has no built-in map. For small arrays,\n   count each element with a second loop: */\nfor (int i = 0; i < len; i++) {\n  int count = 0;\n  for (int j = 0; j < len; j++) {\n    if (arr[j] == arr[i]) count++;\n  }\n  if (count > 1) {\n    /* arr[i] is a duplicate */\n  }\n}`,
        },
      },
    },
    {
      heading: "Pattern 3: \"have I seen this before?\"",
      body: "A close cousin of the tally: sometimes you don't need counts, just a yes/no - *have I already met this value?* That's a **set**: things go in, and membership checks are instant.\n\nThe elegant move this enables: while walking the array, ask about the **partner** of the current value. \"Do two numbers sum to 42?\" becomes: for each value `v`, have I already seen `42 - v`? If yes - done, one pass. If no, remember `v` and keep walking.",
      codeExample: {
        title: "The seen-set, and the partner trick",
        code: {
          javascript: `const seen = new Set();\nfor (const v of arr) {\n  if (seen.has(target - v)) {\n    return true;   // v + its partner = target\n  }\n  seen.add(v);\n}\nreturn false;`,
          python: `seen = set()\nfor v in arr:\n    if target - v in seen:\n        return True   # v + its partner = target\n    seen.add(v)\nreturn False`,
          java: `Set<Integer> seen = new HashSet<>();\nfor (int v : arr) {\n  if (seen.contains(target - v)) {\n    return true;   // v + its partner = target\n  }\n  seen.add(v);\n}\nreturn false;`,
          c: `/* Without a set, check every pair - two loops.\n   j starts at i + 1 so each pair is tried once: */\nfor (int i = 0; i < len; i++) {\n  for (int j = i + 1; j < len; j++) {\n    if (arr[i] + arr[j] == target) {\n      return 1;\n    }\n  }\n}\nreturn 0;`,
        },
      },
    },
    {
      heading: "Pattern 4: sort first, think second",
      body: "Sorting rearranges values into order - and order makes many problems collapse. After sorting: the largest is at the end, equal values sit next to each other, and \"second largest distinct\" is just \"walk backwards until the value changes\".\n\nSorting costs some time up front but often buys much simpler logic. One JavaScript trap worth knowing forever: `.sort()` with no arguments sorts **as text** (so 10 comes before 9) - always pass a comparator for numbers.",
      codeExample: {
        title: "Sorting an array of numbers",
        code: {
          javascript: `arr.sort((a, b) => a - b);   // ascending\n// WITHOUT the (a, b) => a - b comparator,\n// [10, 9, 2] sorts to [10, 2, 9] - as text!`,
          python: `arr.sort()              # in place, ascending\nordered = sorted(arr)   # or: a new sorted copy`,
          java: `import java.util.Arrays;\n\nArrays.sort(arr);       // in place, ascending`,
          c: `#include <stdlib.h>\n\nint ascending(const void* a, const void* b) {\n  return *(const int*)a - *(const int*)b;\n}\n\nqsort(arr, len, sizeof(int), ascending);`,
        },
      },
    },
    {
      heading: "Complexity: why the pattern you pick matters",
      visualId: "complexity",
      body: "Two correct solutions can differ wildly in how much work they do. A single pass over n items does n steps. A loop **inside** a loop touches every pair - roughly n² steps. At n = 8 that's 8 versus 28; at n = 1,000 it's a thousand versus half a million.\n\nYou don't need formal Big-O notation today - just the instinct: the moment you catch yourself writing a loop inside a loop, pause and ask, \"could a tally or a set remember this for me instead?\" Often the answer is yes, and the n² solution becomes an n one. That reflex is the single most transferable thing in this domain.",
    },
    {
      heading: "Putting it together: how today's tasks work",
      body: "Same setup as yesterday: complete `solve` in your language of choice, and the tests check what it returns - visible examples plus hidden cases.\n\nToday's three tasks are the three patterns wearing costumes: one wants a **tally** (then sorted output - pattern 4 helps), one wants a **two-variable scan** (mind the edge case where no answer exists), one wants the **partner trick**. Here's a full worked example of a fourth problem so you see the shape: count how many values appear **exactly once**.",
      codeExample: {
        title: "Worked example: count values appearing exactly once",
        code: {
          javascript: `function solve(arr) {\n  const counts = new Map();\n  for (const v of arr) {\n    counts.set(v, (counts.get(v) ?? 0) + 1);\n  }\n  let unique = 0;\n  for (const count of counts.values()) {\n    if (count === 1) {\n      unique++;\n    }\n  }\n  return unique;   // solve([4, 1, 4, 2]) → 2\n}`,
          python: `def solve(arr):\n    counts = {}\n    for v in arr:\n        counts[v] = counts.get(v, 0) + 1\n    unique = 0\n    for count in counts.values():\n        if count == 1:\n            unique += 1\n    return unique   # solve([4, 1, 4, 2]) → 2`,
          java: `class Solution {\n  static int solve(int[] arr) {\n    Map<Integer, Integer> counts = new HashMap<>();\n    for (int v : arr) {\n      counts.merge(v, 1, Integer::sum);\n    }\n    int unique = 0;\n    for (int count : counts.values()) {\n      if (count == 1) {\n        unique++;\n      }\n    }\n    return unique;   // solve([4, 1, 4, 2]) → 2\n  }\n}`,
          c: `int solve(const int* arr, int len) {\n  int unique = 0;\n  for (int i = 0; i < len; i++) {\n    int count = 0;\n    for (int j = 0; j < len; j++) {\n      if (arr[j] == arr[i]) count++;\n    }\n    if (count == 1) unique++;\n  }\n  return unique;   /* solve({4, 1, 4, 2}, 4) → 2 */\n}`,
        },
      },
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
