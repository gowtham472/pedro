import type { TaskDefinition } from "@/types/content";

// Day 7 - Independent Build. The user chooses one of the six domains (their
// top-3 recommended, or any other) and completes one capstone task in it.
// There is no separate Day 7 domain/lesson - these tasks reuse each domain's
// engine at a slightly higher difficulty, keyed by "day: 7".

export const independentBuildTasks: TaskDefinition[] = [
  {
    id: "capstone-software-development",
    domainId: "software-development",
    lessonId: "lesson-software-development-day1",
    day: 7,
    title: "Build a small text utility",
    description: "Implement a function that finds the most frequent word in a passage of text.",
    instructions:
      "This is your Day 7 independent build in Software Development. Implement `solve(text)`, which takes a passage of text and returns the single most frequent word (case-insensitive). If there's a tie, return whichever tied word appears first in the text.\n\nWords are sequences of letters, digits, or apostrophes; punctuation and whitespace separate them.\n\nExample: `solve(\"the cat sat on the mat\")` → `\"the\"`",
    difficulty: "challenge",
    estimatedMinutes: 25,
    learningObjectives: ["String parsing", "Frequency counting", "Tie-breaking logic"],
    prerequisiteConcepts: ["arrays", "loops", "functions"],
    passingScore: 70,
    order: 1,
    basePoints: 150,
    hints: [
      { order: 1, text: "Lowercase the text and extract words with a regular expression like `/[a-z0-9']+/g`." },
      { order: 2, text: "Track counts in a Map as you scan once, left to right, and update your \"best so far\" only on a strict increase - that naturally keeps the first-seen word on ties." },
    ],
    config: {
      type: "code",
      language: "javascript",
      functionName: "solve",
      starterCode: "function solve(text) {\n  // your code here\n}",
      timeLimitMs: 4000,
      testCases: [
        { id: "t1", args: ["the cat sat on the mat the cat ran"], expected: "the" },
        { id: "t2", args: ["a a b b c"], expected: "a", description: "tie broken by first occurrence" },
        { id: "t3", args: ["hello world"], expected: "hello", hidden: true },
      ],
      variants: {
        python: {
          starterCode: `def solve(text):\n    # return the most frequent word (case-insensitive);\n    # ties go to the word that appears first in the text\n    pass\n`,
        },
        java: {
          starterCode: `class Solution {\n  static String solve(String text) {\n    // your code here\n    return "";\n  }\n}\n`,
          driver: `class Main {\n  public static void main(String[] args) {\n    String[] tests = {"the cat sat on the mat the cat ran", "a a b b c", "hello world"};\n    StringBuilder out = new StringBuilder("[");\n    for (int i = 0; i < tests.length; i++) {\n      if (i > 0) out.append(',');\n      out.append(Canon.j(Solution.solve(tests[i])));\n    }\n    out.append(']');\n    System.out.println("__PEDRO__" + out);\n  }\n}\n`,
        },
        c: {
          starterCode: `/* Write the most frequent word (case-insensitive, ties go to the\n   word appearing first) into out. out has room for 255 characters. */\nvoid solve(const char* text, char* out) {\n  /* your code here */\n  out[0] = '\\0';\n}\n`,
          driver: `static void run_case(const char* text, int first) {\n  char out[256];\n  out[0] = '\\0';\n  solve(text, out);\n  if (!first) putchar(',');\n  canon_str(out);\n}\nint main(void) {\n  printf("__PEDRO__[");\n  run_case("the cat sat on the mat the cat ran", 1);\n  run_case("a a b b c", 0);\n  run_case("hello world", 0);\n  printf("]\\n");\n  return 0;\n}\n`,
        },
      },
    },
  },
  {
    id: "capstone-problem-solving",
    domainId: "problem-solving",
    lessonId: "lesson-problem-solving-day2",
    day: 7,
    title: "Longest run without repeats",
    description: "A structured-reasoning problem to close out your DSA exploration.",
    instructions:
      "This is your Day 7 independent build in Problem Solving. Implement `solve(str)`, returning the length of the longest substring of `str` that contains no repeated characters.\n\nExample: `solve(\"abcabcbb\")` → `3` (\"abc\")",
    difficulty: "challenge",
    estimatedMinutes: 25,
    learningObjectives: ["Sliding window technique", "Single-pass scanning"],
    prerequisiteConcepts: ["arrays", "complexity intuition"],
    passingScore: 70,
    order: 1,
    basePoints: 150,
    hints: [
      { order: 1, text: "Keep a window [start, i] that never contains a repeat, and remember the last index each character was seen at." },
      { order: 2, text: "When you see a character already in the window, move `start` to just after its previous occurrence." },
    ],
    config: {
      type: "code",
      language: "javascript",
      functionName: "solve",
      starterCode: "function solve(str) {\n  // your code here\n}",
      timeLimitMs: 4000,
      testCases: [
        { id: "t1", args: ["abcabcbb"], expected: 3 },
        { id: "t2", args: ["bbbbb"], expected: 1 },
        { id: "t3", args: ["pwwkew"], expected: 3 },
        { id: "t4", args: [""], expected: 0, hidden: true },
        { id: "t5", args: ["dvdf"], expected: 3, hidden: true },
      ],
      variants: {
        python: {
          starterCode: `def solve(s):\n    # return the length of the longest substring without repeated characters\n    pass\n`,
        },
        java: {
          starterCode: `class Solution {\n  static int solve(String s) {\n    // your code here\n    return 0;\n  }\n}\n`,
          driver: `class Main {\n  public static void main(String[] args) {\n    String[] tests = {"abcabcbb", "bbbbb", "pwwkew", "", "dvdf"};\n    StringBuilder out = new StringBuilder("[");\n    for (int i = 0; i < tests.length; i++) {\n      if (i > 0) out.append(',');\n      out.append(Canon.j(Solution.solve(tests[i])));\n    }\n    out.append(']');\n    System.out.println("__PEDRO__" + out);\n  }\n}\n`,
        },
        c: {
          starterCode: `/* Return the length of the longest substring of s that contains\n   no repeated characters. */\nint solve(const char* s) {\n  /* your code here */\n  return 0;\n}\n`,
          driver: `int main(void) {\n  printf("__PEDRO__[%d,%d,%d,%d,%d]\\n",\n    solve("abcabcbb"), solve("bbbbb"), solve("pwwkew"), solve(""), solve("dvdf"));\n  return 0;\n}\n`,
        },
      },
    },
  },
  {
    id: "capstone-ui-ux-design",
    domainId: "ui-ux-design",
    lessonId: "lesson-ui-ux-design-day3",
    day: 7,
    title: "Design an onboarding concept",
    description: "Design a richer onboarding screen concept, pulling together everything from Day 3.",
    instructions:
      "This is your Day 7 independent build in UI/UX Design. Design a single onboarding screen concept for a new app of your choice. Include an illustration placeholder, a heading, short supporting text, a progress indicator (for a multi-step flow), and a clear call-to-action button.\n\nAim for more polish and intentional spacing than the Day 3 login screen.",
    difficulty: "challenge",
    estimatedMinutes: 30,
    learningObjectives: ["Composition at higher fidelity", "Onboarding patterns"],
    prerequisiteConcepts: ["layout", "hierarchy", "components"],
    passingScore: 65,
    order: 1,
    basePoints: 150,
    hints: [
      { order: 1, text: "Place the illustration placeholder in the top half, and keep text and the button anchored toward the bottom." },
      { order: 2, text: "A row of small dots or bars makes a clear, simple progress indicator." },
    ],
    config: {
      type: "design",
      canvasSize: { width: 375, height: 700 },
      referenceDescription: "An onboarding screen: illustration area, heading, supporting text, progress indicator, CTA button.",
      minElements: 6,
      checklist: [
        { id: "has-illustration", label: "Includes an illustration or image placeholder" },
        { id: "has-heading", label: "Includes a heading" },
        { id: "has-subtext", label: "Includes short supporting text" },
        { id: "has-progress", label: "Includes a progress indicator" },
        { id: "has-cta", label: "Includes a clear call-to-action button" },
        { id: "uses-six-elements", label: "Uses at least 6 elements total" },
      ],
    },
  },
  {
    id: "capstone-data-analytics",
    domainId: "data-analytics",
    lessonId: "lesson-data-analytics-day4",
    day: 7,
    title: "Build a mini dashboard",
    description: "Pull together several queries into a small dashboard with at least two charts.",
    instructions:
      "This is your Day 7 independent build in Data & Analytics. Using the same orders dataset, write at least two different queries that each surface a useful metric (for example: revenue by city, orders by category, average rating by restaurant). Chart the results and summarize what the dashboard tells you in a few sentences.",
    difficulty: "challenge",
    estimatedMinutes: 30,
    learningObjectives: ["Multi-metric analysis", "Dashboard thinking"],
    prerequisiteConcepts: ["aggregation", "GROUP BY", "charts"],
    passingScore: 65,
    order: 1,
    basePoints: 150,
    hints: [
      { order: 1, text: "Pick two genuinely different metrics rather than two variations of the same query." },
      { order: 2, text: "Rating and revenue often tell different stories - a restaurant can be popular but not highly rated, or vice versa." },
    ],
    config: {
      type: "sql",
      datasetId: "food-delivery",
      starterQuery: "SELECT city, category, COUNT(*) AS orders, AVG(rating) AS avg_rating\nFROM orders\nGROUP BY city, category\nORDER BY orders DESC;",
      expectedQueryDescription: "Two or more queries covering different metrics, charted and summarized.",
      requiresChart: true,
      validate: {
        mode: "open-ended",
        minResultRows: 1,
        findingPrompt: "Summarize what your dashboard shows - mention at least two distinct metrics you looked at.",
        minFindingLength: 40,
      },
    },
  },
  {
    id: "capstone-cloud-devops",
    domainId: "cloud-devops",
    lessonId: "lesson-cloud-devops-day5",
    day: 7,
    title: "Deploy and stabilize paymentsvc",
    description: "paymentsvc is crash-looping in the sandbox. Diagnose it and get it running.",
    instructions:
      "This is your Day 7 independent build in Cloud & DevOps. `paymentsvc` keeps crashing immediately after starting. Investigate the logs, find the root cause, and fix it so the service stays active.",
    difficulty: "challenge",
    estimatedMinutes: 20,
    learningObjectives: ["Environment configuration", "Crash-loop diagnosis"],
    prerequisiteConcepts: ["Linux basics", "troubleshooting method"],
    passingScore: 70,
    order: 1,
    basePoints: 150,
    hints: [
      { order: 1, text: "Check the service status, then read its log for the exact failure reason." },
      { order: 2, text: "`systemctl set-env <service> KEY=VALUE` sets a missing environment variable before you restart." },
    ],
    config: {
      type: "terminal",
      motd: "Mission: paymentsvc is crash-looping. Diagnose the sandbox and deploy a stable fix.\nType `help` to see available commands.",
      initialCwd: "/home/student",
      directories: ["/", "/home", "/home/student", "/var", "/var/log", "/var/log/paymentsvc"],
      files: [
        { path: "/home/student/README.txt", content: "Deploy paymentsvc. It is currently crash-looping on startup." },
        {
          path: "/var/log/paymentsvc/app.log",
          content:
            "2026-08-09T11:00:01Z FATAL DB_HOST environment variable is not set. Exiting.\n" +
            "2026-08-09T11:00:04Z INFO  paymentsvc restarting (attempt 14)\n" +
            "2026-08-09T11:00:05Z FATAL DB_HOST environment variable is not set. Exiting.\n" +
            "2026-08-09T11:00:08Z INFO  paymentsvc restarting (attempt 15)\n" +
            "2026-08-09T11:00:09Z FATAL DB_HOST environment variable is not set. Exiting.",
        },
      ],
      services: [
        {
          name: "paymentsvc",
          initialStatus: "failed",
          failureMessage: "paymentsvc.service: Main process exited, code=exited, status=1/FAILURE (crash loop)",
        },
      ],
      processes: [{ pid: 1, command: "/sbin/init" }],
      netstatEntries: [],
      goalServiceName: "paymentsvc",
      findings: [
        { id: "checked-status", description: "Checked paymentsvc's service status", requiredCommandPattern: "^systemctl\\s+status\\s+paymentsvc" },
        { id: "viewed-logs", description: "Read paymentsvc's application log", requiredCommandPattern: "^(cat\\s+/var/log/paymentsvc/app\\.log|journalctl\\s+-u\\s+paymentsvc)" },
      ],
      fixSteps: [
        {
          id: "set-env",
          description: "Set the missing DB_HOST environment variable",
          commandPattern: "^systemctl\\s+set-env\\s+paymentsvc\\s+DB_HOST=\\S+$",
          effect: "set-env",
          targetService: "paymentsvc",
        },
        {
          id: "restart-paymentsvc",
          description: "Restart paymentsvc",
          commandPattern: "^systemctl\\s+(restart|start)\\s+paymentsvc$",
          requiresFixStepIds: ["set-env"],
          effect: "restart-service",
          targetService: "paymentsvc",
        },
      ],
    },
  },
  {
    id: "capstone-cybersecurity",
    domainId: "cybersecurity",
    lessonId: "lesson-cybersecurity-day6",
    day: 7,
    title: "Investigate a data-export incident",
    description: "A larger, multi-part investigation into an authorization flaw.",
    instructions:
      "This is your Day 7 independent build in Cybersecurity. An internal export tool was used to pull far more customer data than expected. Review the log and the endpoint's code, then answer the questions.",
    difficulty: "challenge",
    estimatedMinutes: 20,
    learningObjectives: ["Authorization vs. authentication", "Recognizing IDOR patterns"],
    prerequisiteConcepts: ["authentication", "authorization", "common security mistakes"],
    passingScore: 70,
    order: 1,
    basePoints: 150,
    hints: [
      { order: 1, text: "The requests are all authenticated (the same session). The question is whether they should all be allowed." },
      { order: 2, text: "Look at how the endpoint decides which user's data to return." },
    ],
    config: {
      type: "security",
      briefing: "A privacy audit flagged unusually broad data access from one internal session token.",
      exhibits: [
        {
          kind: "log",
          title: "export-api.log (excerpt)",
          lines: [
            "sess-9f21 GET /api/export?userId=482 200",
            "sess-9f21 GET /api/export?userId=1 200",
            "sess-9f21 GET /api/export?userId=2 200",
            "sess-9f21 GET /api/export?userId=3 200",
            "sess-9f21 GET /api/export?userId=4 200",
            "sess-9f21 GET /api/export?userId=5 200",
            "... (sess-9f21 continues sequentially through userId=1918) ...",
          ],
        },
        {
          kind: "code",
          title: "routes/export.js",
          language: "javascript",
          code:
            "app.get('/api/export', requireAuth, async (req, res) => {\n" +
            "  // requireAuth only checks that the caller is logged in\n" +
            "  const data = await db.getUserData(req.query.userId);\n" +
            "  res.json(data);\n" +
            "});",
        },
      ],
      questions: [
        {
          id: "q1",
          prompt: "What is the underlying vulnerability class here?",
          kind: "single-choice",
          options: [
            { id: "a", label: "Insecure Direct Object Reference (broken object-level authorization)" },
            { id: "b", label: "SQL injection" },
            { id: "c", label: "Cross-site scripting (XSS)" },
            { id: "d", label: "Denial of service" },
          ],
          correctOptionIds: ["a"],
          explanation:
            "The endpoint authenticates the caller but never checks whether the requested userId belongs to them (or that they're an admin) - a textbook Insecure Direct Object Reference / broken object-level authorization flaw.",
        },
        {
          id: "q2",
          prompt: "Which request parameter is being abused to enumerate other users' data?",
          kind: "short-text",
          correctText: ["userid", "userId", "the userid parameter", "user id"],
          explanation: "`userId` is incremented sequentially across requests with no ownership check.",
        },
        {
          id: "q3",
          prompt: "Which pieces of evidence support the conclusion? Select all that apply.",
          kind: "multi-choice",
          options: [
            { id: "a", label: "Sequential userId values requested from a single session" },
            { id: "b", label: "The route checks that the caller is logged in, but never that they own the requested record" },
            { id: "c", label: "Every request in the log returned a 500 error" },
            { id: "d", label: "The endpoint requires authentication" },
          ],
          correctOptionIds: ["a", "b"],
          explanation:
            "(a) and (b) are the actual evidence of the flaw. (c) is false - the requests succeeded (200), which is the problem. (d) is true but irrelevant on its own: authentication without authorization is exactly the gap being exploited.",
        },
      ],
    },
  },
];
