import type { DomainDefinition, LessonDefinition, TaskDefinition } from "@/types/content";

export const softwareDevelopmentDomain: DomainDefinition = {
  id: "software-development",
  name: "Software Development",
  tagline: "Building, debugging, shipping software",
  description:
    "Fix a failing function, review a teammate's code, make design calls, and ship a small feature from a ticket - the actual daily loop of building software.",
  day: 1,
  accentToken: "mint",
  primarySkills: ["Code fluency", "Debugging", "System thinking"],
  active: true,
  order: 1,
};

export const softwareDevelopmentLesson: LessonDefinition = {
  id: "lesson-software-development-day1",
  domainId: "software-development",
  day: 1,
  title: "How software gets built",
  summary:
    "What software is actually made of, how features go from idea to shipped, and exactly enough code to fix a bug, review a change, and build a feature yourself.",
  estimatedMinutes: 45,
  order: 1,
  sections: [
    {
      heading: "What software is actually made of",
      visualId: "software-anatomy",
      body: "Every app you've used - food delivery, messaging, games - is the same three parts having a conversation: the **app** on your device (what you see and tap), a **server** somewhere (which runs the rules), and a **database** (which remembers everything permanently).\n\nTap \"Place order\" and the app sends a request to the server; the server checks the rules - is the promo code valid? is the restaurant open? - stores the order in the database, and sends back a response the app can show. Software development is building those parts and the conversations between them.",
    },
    {
      heading: "How a feature gets built",
      body: "A real feature rarely starts with a blank file. It starts with a **ticket** - a short description of what should exist: \"users can apply a promo code at checkout\". A developer picks it up and works a loop:\n\n- **Read** the existing code to see where the change belongs\n- **Write** a small change - often just one function\n- **Test** it - run automated checks that catch mistakes\n- **Review** - a teammate reads the change and questions it\n- **Ship** - the change goes live\n\nNotice how little of that is typing new code. Developers spend most of their day *reading* code, and the review step exists because fresh eyes catch what the author can't. Today you'll do every step of this loop.",
    },
    {
      heading: "Code: the building blocks you'll need",
      visualId: "program",
      body: "To do today's work you need three ideas, and only three. A **variable** is a named box holding a value. A **condition** (`if`/`else`) picks between paths - and never takes both. A **loop** repeats a block, usually once per item or number.\n\nA program runs top to bottom, doing exactly what each line says - computers never guess. Pick your language below; every example on this page and the task workspace will follow your choice.",
      codeExample: {
        title: "Variable, loop, condition - one tiny program",
        code: {
          javascript: `let stock = 3;                        // a variable: a named value\n\nfor (let i = 1; i <= stock; i++) {    // a loop: repeat the block\n  if (i === stock) {                  // a condition: pick a path\n    console.log("last one!");\n  } else {\n    console.log("item " + i);\n  }\n}\n// prints: item 1, item 2, last one!`,
          python: `stock = 3                       # a variable: a named value\n\nfor i in range(1, stock + 1):   # a loop: repeat the block\n    if i == stock:              # a condition: pick a path\n        print("last one!")\n    else:\n        print("item", i)\n\n# prints: item 1, item 2, last one!`,
          java: `int stock = 3;                        // a variable: a named value\n\nfor (int i = 1; i <= stock; i++) {    // a loop: repeat the block\n  if (i == stock) {                   // a condition: pick a path\n    System.out.println("last one!");\n  } else {\n    System.out.println("item " + i);\n  }\n}\n// prints: item 1, item 2, last one!`,
          c: `int stock = 3;                        /* a variable: a named value */\n\nfor (int i = 1; i <= stock; i++) {    /* a loop: repeat the block */\n  if (i == stock) {                   /* a condition: pick a path */\n    printf("last one!\\n");\n  } else {\n    printf("item %d\\n", i);\n  }\n}\n/* prints: item 1, item 2, last one! */`,
        },
      },
    },
    {
      heading: "Functions and arrays: the working tools",
      visualId: "functions",
      body: "A **function** is a named piece of work: inputs go in, one answer comes back out via `return`. Every task today has you completing a function called `solve` - automated tests call it with different inputs and check what it returns.\n\nAn **array** (Python: list) holds many values in order, counted from **zero** - the first item is `[0]`. That zero matters today: a loop that starts at 1 silently skips the first item. It's one of the most common real-world bugs.",
      codeExample: {
        title: "A function that walks an array",
        code: {
          javascript: `const prices = [120, 80, 45];   // an array - first item is prices[0]\n\nfunction total(list) {\n  let sum = 0;\n  for (let i = 0; i < list.length; i++) {\n    sum += list[i];             // visit every slot, carry a sum\n  }\n  return sum;                   // hand the answer back\n}\n\ntotal(prices);                  // 245`,
          python: `prices = [120, 80, 45]     # a list - first item is prices[0]\n\ndef total(items):\n    sum = 0\n    for p in items:        # visit every item, carry a sum\n        sum += p\n    return sum             # hand the answer back\n\ntotal(prices)              # 245`,
          java: `int[] prices = {120, 80, 45};   // an array - first item is prices[0]\n\nstatic int total(int[] list) {\n  int sum = 0;\n  for (int i = 0; i < list.length; i++) {\n    sum += list[i];             // visit every slot, carry a sum\n  }\n  return sum;                   // hand the answer back\n}\n\ntotal(prices);                  // 245`,
          c: `int prices[] = {120, 80, 45};   /* first item is prices[0] */\n\nint total(const int* list, int len) {\n  int sum = 0;\n  for (int i = 0; i < len; i++) {\n    sum += list[i];             /* visit every slot */\n  }\n  return sum;                   /* hand the answer back */\n}\n\ntotal(prices, 3);               /* 245 */`,
        },
      },
    },
    {
      heading: "Strings: handling text",
      body: "Features constantly handle text - usernames, promo codes, search boxes. A **string** is a sequence of characters you can walk like an array: check its length, read one character, and ask what *kind* of character it is - letter? digit? something else?\n\nThose category checks are how real validation code works: \"usernames may only contain letters and digits\" becomes a loop that inspects each character and rejects the string the moment one breaks the rule.",
      codeExample: {
        title: "Length, characters, and category checks",
        code: {
          javascript: `const u = "ada_99";\nu.length;                    // 6\nu[0];                        // "a"\n\n// what kind of character is it?\nfunction isLetter(ch) {\n  const c = ch.toLowerCase();\n  return c >= "a" && c <= "z";\n}\nfunction isDigit(ch) {\n  return ch >= "0" && ch <= "9";\n}\n\nisLetter(u[0]);              // true\nisDigit(u[3]);               // false - "_" isn't a digit`,
          python: `u = "ada_99"\nlen(u)               # 6\nu[0]                 # "a"\n\n# what kind of character is it?\nu[0].isalpha()       # True  - a letter?\nu[3].isdigit()       # False - "_" isn't a digit\nu[4].isalnum()       # True  - letter OR digit`,
          java: `String u = "ada_99";\nu.length();                             // 6\nu.charAt(0);                            // 'a'\n\n// what kind of character is it?\nCharacter.isLetter(u.charAt(0));        // true\nCharacter.isDigit(u.charAt(3));         // false - '_'\nCharacter.isLetterOrDigit(u.charAt(4)); // true`,
          c: `#include <string.h>\n#include <ctype.h>\n\nconst char* u = "ada_99";\nstrlen(u);                       /* 6 */\nu[0];                            /* 'a' */\n\n/* what kind of character is it? */\nisalpha((unsigned char)u[0]);    /* nonzero = a letter */\nisdigit((unsigned char)u[3]);    /* 0 - '_' isn't a digit */\nisalnum((unsigned char)u[4]);    /* letter OR digit */`,
        },
      },
    },
    {
      heading: "Reading code you didn't write",
      body: "Here's the developer's secret: most of the job is reading. Before you can fix, extend, or review anything, you have to understand what it *actually* does - which may differ from what its author intended, and from what its name claims.\n\nThe technique is **tracing**: pick a concrete input, then play computer - walk the code line by line with a piece of paper, writing down each variable's value as it changes. If the traced answer surprises you, you've found either your misunderstanding or the bug. Never skim code and assume; trace it.",
    },
    {
      heading: "Debugging: the daily loop",
      visualId: "debugging",
      body: "Code breaks constantly - for professionals too. What separates experienced developers isn't fewer bugs, it's a calmer loop: **read the failure message** (it names what went wrong and usually where), **print the values** you assumed at that point, **fix one thing**, run again.\n\nToday's workspace shows you exactly which tests pass and fail on every run. Failing tests aren't a judgment - they're the to-do list.",
      codeExample: {
        title: "Print-debugging in each language",
        code: {
          javascript: `console.log("i is", i);\nconsole.log("total so far:", total);`,
          python: `print("i is", i)\nprint("total so far:", total)`,
          java: `System.out.println("i is " + i);\nSystem.out.println("total so far: " + total);`,
          c: `printf("i is %d\\n", i);        /* %d = number, %s = text */\nprintf("total so far: %d\\n", total);`,
        },
      },
    },
    {
      heading: "Servers, databases, and APIs",
      visualId: "http",
      body: "Back to the three-part picture, because two rules drive real design decisions. **Rule 1: never trust the app.** Anyone can tamper with what runs on their own phone, so every important check - is this promo valid? is this price right? - must happen on the **server**. **Rule 2: memory that matters lives in the database.** Phones die and apps close; anything that must survive goes in permanent storage.\n\nThe app and server talk through an **API**: an agreed menu of requests the server answers, like `POST /orders` meaning \"place an order\". Designing that conversation - who checks what, who remembers what - is as much a part of the craft as writing code, and it's one of today's activities.",
    },
    {
      heading: "Today: a developer's day, compressed",
      body: "Today's activities mirror a real working day, in order:\n\n- **Fix the bug** - a teammate's function fails its tests. Read, trace, repair.\n- **Code review** - read a change and catch what's wrong before it ships.\n- **Design decisions** - decide where checks and data belong in a small system.\n- **Ship a feature** - turn a ticket into working, tested code yourself.\n\nEverything above is enough to complete all four - and the last one deliberately leaves the thinking to you. By the end you'll have touched each part of the loop developers run every day: that's the experience this domain is measuring.",
    },
  ],
};

export const softwareDevelopmentTasks: TaskDefinition[] = [
  {
    id: "swdev-01-fix-the-bug",
    domainId: "software-development",
    lessonId: "lesson-software-development-day1",
    day: 1,
    title: "Fix the bug",
    description: "A teammate's cart-total function is failing its tests. Find the bugs and repair it.",
    instructions:
      "The function below computes an order total: **add up every price, then subtract the discount - and the result must never go below 0.**\n\nIt's failing tests. Run them, read which cases fail, and fix the function. This is repair work, not a rewrite - the structure is fine, the details aren't. There are **two** separate bugs.",
    difficulty: "beginner",
    estimatedMinutes: 10,
    learningObjectives: ["Reading existing code", "Tracing a loop", "Boundary conditions"],
    prerequisiteConcepts: ["variables", "loops", "conditions"],
    passingScore: 70,
    order: 1,
    basePoints: 50,
    hints: [
      { order: 1, text: "Run the tests first and look at the failing cases - the single-item cart fails. Trace the loop by hand with `[40]`: which slots does it visit?" },
      { order: 2, text: "Arrays start at index 0. Where does this loop start?" },
      { order: 3, text: "\"Never below 0\" isn't handled anywhere yet - add a condition before returning." },
    ],
    config: {
      type: "code",
      language: "javascript",
      functionName: "solve",
      starterCode:
        "// Add up every price, then subtract the discount.\n// The result must never go below 0.\nfunction solve(prices, discount) {\n  let total = 0;\n  for (let i = 1; i < prices.length; i++) {\n    total += prices[i];\n  }\n  return total - discount;\n}",
      timeLimitMs: 4000,
      testCases: [
        { id: "t1", args: [[10, 20, 30], 5], expected: 55 },
        { id: "t2", args: [[40], 0], expected: 40, description: "a single-item cart" },
        { id: "t3", args: [[10], 20], expected: 0, description: "discount bigger than the total" },
        { id: "t4", args: [[5, 5, 5], 30], expected: 0, hidden: true },
        { id: "t5", args: [[100, 50], 25], expected: 125, hidden: true },
      ],
      variants: {
        python: {
          starterCode: `# Add up every price, then subtract the discount.\n# The result must never go below 0.\ndef solve(prices, discount):\n    total = 0\n    for i in range(1, len(prices)):\n        total += prices[i]\n    return total - discount\n`,
        },
        java: {
          starterCode: `class Solution {\n  // Add up every price, then subtract the discount.\n  // The result must never go below 0.\n  static int solve(int[] prices, int discount) {\n    int total = 0;\n    for (int i = 1; i < prices.length; i++) {\n      total += prices[i];\n    }\n    return total - discount;\n  }\n}\n`,
          driver: `class Main {\n  public static void main(String[] args) {\n    int[][] tests = {{10, 20, 30}, {40}, {10}, {5, 5, 5}, {100, 50}};\n    int[] discounts = {5, 0, 20, 30, 25};\n    StringBuilder out = new StringBuilder("[");\n    for (int i = 0; i < tests.length; i++) {\n      if (i > 0) out.append(',');\n      out.append(Canon.j(Solution.solve(tests[i], discounts[i])));\n    }\n    out.append(']');\n    System.out.println("__PEDRO__" + out);\n  }\n}\n`,
        },
        c: {
          starterCode: `/* Add up every price, then subtract the discount.\n   The result must never go below 0. */\nint solve(const int* prices, int len, int discount) {\n  int total = 0;\n  for (int i = 1; i < len; i++) {\n    total += prices[i];\n  }\n  return total - discount;\n}\n`,
          driver: `int main(void) {\n  int t1[] = {10, 20, 30};\n  int t2[] = {40};\n  int t3[] = {10};\n  int t4[] = {5, 5, 5};\n  int t5[] = {100, 50};\n  printf("__PEDRO__[%d,%d,%d,%d,%d]\\n",\n    solve(t1, 3, 5), solve(t2, 1, 0), solve(t3, 1, 20), solve(t4, 3, 30), solve(t5, 2, 25));\n  return 0;\n}\n`,
        },
      },
    },
  },
  {
    id: "swdev-02-code-review",
    domainId: "software-development",
    lessonId: "lesson-software-development-day1",
    day: 1,
    title: "Review a teammate's change",
    description: "Read a small function heading to production, trace what it really does, and catch the mistake before it ships.",
    instructions:
      "A teammate asked you to review this change before it ships. Trace the code with the input shown - by hand, line by line - then answer the questions. Reviews aren't about style; they're about catching what the author couldn't see.",
    difficulty: "beginner",
    estimatedMinutes: 8,
    learningObjectives: ["Tracing code by hand", "Spotting logic errors", "Thinking in test cases"],
    prerequisiteConcepts: ["functions", "variables"],
    passingScore: 70,
    order: 2,
    basePoints: 60,
    hints: [
      { order: 1, text: "Don't read what the function is *supposed* to do - trace what it *actually* does. Write down `discount`'s value for total = 200, percent = 10." },
      { order: 2, text: "A discount should make the total smaller. Does it?" },
    ],
    config: {
      type: "security",
      eyebrow: "Code review",
      briefing: "This change is about to ship to the checkout flow. The author says it \"applies a percentage discount to an order total.\"",
      exhibits: [
        {
          kind: "code",
          title: "The change under review",
          language: "javascript",
          code: "function applyDiscount(total, percent) {\n  const discount = total * percent / 100;\n  return total + discount;\n}\n\n// example call from checkout:\napplyDiscount(200, 10);",
        },
      ],
      questions: [
        {
          id: "q1",
          prompt: "Trace it: what does applyDiscount(200, 10) actually return?",
          kind: "single-choice",
          options: [
            { id: "a", label: "180" },
            { id: "b", label: "220" },
            { id: "c", label: "20" },
            { id: "d", label: "210" },
          ],
          correctOptionIds: ["b"],
          explanation:
            "discount = 200 × 10 / 100 = 20, and the function returns total + discount = 220. A \"discount\" that increases the price - exactly the kind of thing tracing catches and skimming misses.",
        },
        {
          id: "q2",
          prompt: "Where is the bug?",
          kind: "single-choice",
          options: [
            { id: "a", label: "The line computing `discount` - the math is wrong" },
            { id: "b", label: "The `return` line - it adds the discount instead of subtracting it" },
            { id: "c", label: "There is no bug - the function is correct" },
          ],
          correctOptionIds: ["b"],
          explanation:
            "The discount is computed correctly (10% of 200 is 20). The return line should be `total - discount`. One character - real production incidents have shipped on less.",
        },
        {
          id: "q3",
          prompt: "Which inputs would be worth testing before this ships? Select all that apply.",
          kind: "multi-choice",
          options: [
            { id: "a", label: "percent = 0 (no discount at all)" },
            { id: "b", label: "percent = 100 (fully free order)" },
            { id: "c", label: "A negative percent" },
            { id: "d", label: "Renaming the function to discountApply" },
          ],
          correctOptionIds: ["a", "b", "c"],
          explanation:
            "Edge inputs - zero, the maximum, and nonsense values like negatives - are where bugs hide. Renaming changes nothing about behaviour, so it tests nothing.",
        },
      ],
    },
  },
  {
    id: "swdev-03-system-design",
    domainId: "software-development",
    lessonId: "lesson-software-development-day1",
    day: 1,
    title: "Design decisions: where does each piece live?",
    description: "You're building a food-delivery app. Decide which part of the system handles what - and why it matters.",
    instructions:
      "You're the developer for a small food-delivery app: an app on the customer's phone, an API server, and a database. Below is the system and one of its API requests. Make the calls a developer makes every week - remember the two rules: never trust the app, and memory that matters lives in the database.",
    difficulty: "intermediate",
    estimatedMinutes: 10,
    learningObjectives: ["Client/server/database roles", "Trust boundaries", "What an API is"],
    prerequisiteConcepts: ["how software is structured"],
    passingScore: 70,
    order: 3,
    basePoints: 75,
    hints: [
      { order: 1, text: "Anything running on the customer's device can be tampered with by the customer. Which checks would you be comfortable letting them skip?" },
      { order: 2, text: "The phone can die, lose signal, or uninstall the app. What still has to be true afterwards - and where must that live?" },
    ],
    config: {
      type: "security",
      eyebrow: "Design decisions",
      briefing: "The team is deciding which component is responsible for what. Wrong answers here become security holes and lost data later.",
      exhibits: [
        {
          kind: "table",
          title: "The system's parts",
          columns: ["Component", "What it is"],
          rows: [
            ["The app", "Runs on the customer's phone - what they see and tap"],
            ["The API server", "Runs on our machines - answers the app's requests"],
            ["The database", "Permanent storage the server reads and writes"],
          ],
        },
        {
          kind: "code",
          title: "One API request: placing an order",
          language: "http",
          code: "POST /orders\n{ \"items\": [\"Biryani\", \"Lassi\"], \"promoCode\": \"SAVE10\" }\n\n→ 200 OK\n{ \"orderId\": 8412, \"total\": 262 }",
        },
      ],
      questions: [
        {
          id: "q1",
          prompt: "The customer taps \"Place order\" with promo code SAVE10. Which component must check the code is genuinely valid?",
          kind: "single-choice",
          options: [
            { id: "a", label: "The app, so the customer gets instant feedback" },
            { id: "b", label: "The API server, when the request arrives" },
            { id: "c", label: "The database, since it stores the promo codes" },
            { id: "d", label: "No check needed if the app's code list is up to date" },
          ],
          correctOptionIds: ["b"],
          explanation:
            "The server must do the real check. The app can *also* validate for instant feedback, but anything on the customer's device can be tampered with - a modified app could claim any promo it likes. The database stores data; it doesn't enforce business rules. Never trust the client.",
        },
        {
          id: "q2",
          prompt: "The customer's phone battery dies right after ordering. Why does the order still appear when they charge up and reopen the app?",
          kind: "single-choice",
          options: [
            { id: "a", label: "The app saved it on the phone before dying" },
            { id: "b", label: "The server keeps every order in its running memory" },
            { id: "c", label: "The order was written to the database, and the app re-fetches it" },
            { id: "d", label: "The delivery rider's app has a copy" },
          ],
          correctOptionIds: ["c"],
          explanation:
            "The database is the system's permanent memory. Phones die and even servers restart - anything that must survive gets written to storage, and apps re-fetch it on demand. This is why \"where does this data live?\" is one of the first questions in any design discussion.",
        },
        {
          id: "q3",
          prompt: "Which of these are the API server's job? Select all that apply.",
          kind: "multi-choice",
          options: [
            { id: "a", label: "Checking that the request is valid" },
            { id: "b", label: "Calculating the final price" },
            { id: "c", label: "Drawing the confirmation screen" },
            { id: "d", label: "Physically storing rows on disk" },
          ],
          correctOptionIds: ["a", "b"],
          explanation:
            "The server validates and runs business logic like pricing. Drawing screens is the app's job; physical storage is the database's. Blurring these boundaries is how systems become unmaintainable - keeping them crisp is the design skill.",
        },
        {
          id: "q4",
          prompt: "The agreed set of requests a server understands - like POST /orders above - is called an ___ (one word, three letters).",
          kind: "short-text",
          correctText: ["api", "an api", "the api", "API"],
          explanation:
            "An API (Application Programming Interface) - the contract between app and server. As long as both sides honour it, either can be rebuilt without breaking the other.",
        },
      ],
    },
  },
  {
    id: "swdev-04-ship-a-feature",
    domainId: "software-development",
    lessonId: "lesson-software-development-day1",
    day: 1,
    title: "Ship a feature",
    description: "Turn a real ticket into working code: implement username validation for the signup flow.",
    instructions:
      "The ticket, exactly as a developer would receive it:\n\n**TICKET-482: Validate usernames at signup**\n\n- Between **3 and 15 characters** long (inclusive)\n- Must **start with a letter**\n- May contain only **letters, digits, and underscores**\n\nImplement `solve(username)` returning `true` if the username is acceptable, `false` otherwise. The tests include cases the ticket doesn't spell out - like real life, part of the job is thinking of the edges yourself.",
    difficulty: "challenge",
    estimatedMinutes: 20,
    learningObjectives: ["Implementing from a spec", "String validation", "Edge-case thinking"],
    prerequisiteConcepts: ["strings", "conditions", "loops"],
    passingScore: 70,
    order: 4,
    basePoints: 150,
    hints: [
      { order: 1, text: "Three rules - check them one at a time, and return false the moment any rule breaks. Length is the cheapest check, so do it first." },
      { order: 2, text: "The first character has a stricter rule than the rest. Check it separately, then loop over the remaining characters." },
      { order: 3, text: "For each remaining character: is it a letter, a digit, or an underscore? Anything else fails. The lesson's strings section shows the category checks in your language." },
    ],
    config: {
      type: "code",
      language: "javascript",
      functionName: "solve",
      starterCode: "function solve(username) {\n  // your code here\n}",
      timeLimitMs: 4000,
      testCases: [
        { id: "t1", args: ["ada_99"], expected: true },
        { id: "t2", args: ["ab"], expected: false, description: "too short" },
        { id: "t3", args: ["9lives"], expected: false, description: "must start with a letter" },
        { id: "t4", args: ["Ada"], expected: true, description: "exactly 3 characters is fine" },
        { id: "t5", args: ["a_very_long_username_x"], expected: false, hidden: true },
        { id: "t6", args: ["has space"], expected: false, hidden: true },
        { id: "t7", args: ["under_score_ok"], expected: true, hidden: true },
        { id: "t8", args: ["x__9"], expected: true, hidden: true },
      ],
      variants: {
        python: {
          starterCode: `def solve(username):\n    # your code here - return True or False\n    pass\n`,
        },
        java: {
          starterCode: `class Solution {\n  static boolean solve(String username) {\n    // your code here\n    return false;\n  }\n}\n`,
          driver: `class Main {\n  public static void main(String[] args) {\n    String[] tests = {"ada_99", "ab", "9lives", "Ada", "a_very_long_username_x", "has space", "under_score_ok", "x__9"};\n    StringBuilder out = new StringBuilder("[");\n    for (int i = 0; i < tests.length; i++) {\n      if (i > 0) out.append(',');\n      out.append(Canon.j(Solution.solve(tests[i])));\n    }\n    out.append(']');\n    System.out.println("__PEDRO__" + out);\n  }\n}\n`,
        },
        c: {
          starterCode: `/* Return 1 if the username is acceptable, otherwise 0. */\nint solve(const char* username) {\n  /* your code here */\n  return 0;\n}\n`,
          driver: `static void run_case(const char* u, int first) {\n  if (!first) putchar(',');\n  printf("%s", solve(u) ? "true" : "false");\n}\nint main(void) {\n  printf("__PEDRO__[");\n  run_case("ada_99", 1);\n  run_case("ab", 0);\n  run_case("9lives", 0);\n  run_case("Ada", 0);\n  run_case("a_very_long_username_x", 0);\n  run_case("has space", 0);\n  run_case("under_score_ok", 0);\n  run_case("x__9", 0);\n  printf("]\\n");\n  return 0;\n}\n`,
        },
      },
    },
  },
];
