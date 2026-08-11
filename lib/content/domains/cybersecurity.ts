import type { DomainDefinition, LessonDefinition, TaskDefinition } from "@/types/content";

export const cybersecurityDomain: DomainDefinition = {
  id: "cybersecurity",
  name: "Cybersecurity",
  tagline: "Investigation, attention to detail, security reasoning",
  description:
    "Read logs and code the way an investigator would. Today looks at pattern recognition and attention to detail, entirely inside a safe sandbox.",
  day: 6,
  accentToken: "cream",
  primarySkills: ["Investigation", "Attention to detail", "Security reasoning"],
  active: true,
  order: 6,
};

export const cybersecurityLesson: LessonDefinition = {
  id: "lesson-cybersecurity-day6",
  domainId: "cybersecurity",
  day: 6,
  title: "Cybersecurity",
  summary:
    "Authentication, authorization, HTTP basics, and how logs reveal suspicious activity and common mistakes.",
  estimatedMinutes: 30,
  order: 1,
  sections: [
    {
      heading: "Authentication vs. authorization",
      visualId: "auth",
      body: "Authentication answers \"who are you?\" (logging in). Authorization answers \"what are you allowed to do?\" (permissions). A system can authenticate someone correctly and still make an authorization mistake, like letting a regular user reach an admin-only page.",
    },
    {
      heading: "HTTP basics",
      visualId: "http",
      body: "Every web request has a method (GET reads, POST submits), a path, and a status code in the response. 2xx means success, 4xx means the client did something wrong (401 unauthorized, 404 not found), 5xx means the server failed. Logs are usually just a timestamped list of these.",
    },
    {
      heading: "Reading logs for suspicious activity",
      visualId: "logs",
      body: "One failed login is nothing. A pattern - the same account succeeding from several countries minutes apart, or hundreds of login attempts against one endpoint - is what investigation is about. You're looking for patterns across many rows, not judging any single row in isolation.",
    },
    {
      heading: "Common security mistakes",
      visualId: "security-mistakes",
      body: "A short list that causes a disproportionate number of real incidents: trusting user input directly in a database query (SQL injection), storing or comparing passwords in plaintext, and returning more data in a response than the caller actually needs.",
    },
  ],
};

export const cybersecurityTasks: TaskDefinition[] = [
  {
    id: "sec-01-suspicious-login",
    domainId: "cybersecurity",
    lessonId: "lesson-cybersecurity-day6",
    day: 6,
    title: "Identify suspicious login activity",
    description: "Review a login log and identify which account shows signs of compromise.",
    instructions:
      "Below is a log of recent login attempts across several accounts. Look for a pattern that doesn't fit normal behaviour, then answer the questions.",
    difficulty: "beginner",
    estimatedMinutes: 12,
    learningObjectives: ["Reading structured logs", "Recognizing impossible-travel patterns"],
    prerequisiteConcepts: ["HTTP basics", "authentication"],
    passingScore: 70,
    order: 1,
    basePoints: 50,
    hints: [
      { order: 1, text: "Sort mentally by username - does any one account's login locations make geographic sense within the time window?" },
      { order: 2, text: "A single failed-then-success from the same place is normal (a typo). Logins from multiple countries minutes apart is not." },
    ],
    config: {
      type: "security",
      briefing: "Security monitoring flagged unusual activity in the last hour. Review the login log below.",
      exhibits: [
        {
          kind: "table",
          title: "Login events - last 60 minutes",
          columns: ["Time (UTC)", "Username", "IP Address", "Location", "Result"],
          rows: [
            ["08:01:11", "a.khan", "102.4.5.6", "Karachi, PK", "Success"],
            ["08:14:32", "r.silva", "88.9.1.2", "Lisbon, PT", "Success"],
            ["08:22:05", "j.wilson", "44.201.10.5", "Austin, US", "Success"],
            ["08:24:47", "j.wilson", "185.23.44.9", "Bucharest, RO", "Success"],
            ["08:26:10", "j.wilson", "41.77.12.3", "Lagos, NG", "Success"],
            ["08:30:00", "m.chen", "102.4.5.6", "Karachi, PK", "Failed"],
            ["08:30:22", "m.chen", "102.4.5.6", "Karachi, PK", "Success"],
            ["08:41:18", "s.patel", "71.12.9.4", "Toronto, CA", "Success"],
            ["08:52:03", "r.silva", "88.9.1.2", "Lisbon, PT", "Success"],
            ["09:03:44", "j.wilson", "44.201.10.5", "Austin, US", "Failed"],
          ],
        },
      ],
      questions: [
        {
          id: "q1",
          prompt: "Which username shows the clearest sign of a compromised account?",
          kind: "single-choice",
          options: [
            { id: "a", label: "a.khan" },
            { id: "b", label: "r.silva" },
            { id: "c", label: "j.wilson" },
            { id: "d", label: "m.chen" },
            { id: "e", label: "s.patel" },
          ],
          correctOptionIds: ["c"],
          explanation:
            "j.wilson shows three successful logins from three different countries within four minutes - physically impossible travel, a strong sign the account credentials were compromised and used from multiple locations.",
        },
        {
          id: "q2",
          prompt: "Which signals support that conclusion? Select all that apply.",
          kind: "multi-choice",
          options: [
            { id: "a", label: "Successful logins from three countries within four minutes" },
            { id: "b", label: "A failed login immediately followed by a success from the same location" },
            { id: "c", label: "The legitimate user's own login failing shortly after the suspicious activity" },
            { id: "d", label: "Several different usernames logging in during the same hour" },
          ],
          correctOptionIds: ["a", "c"],
          explanation:
            "The impossible-travel pattern (a) and the real user later failing to log in from their normal location (c) - likely because the attacker changed the password - are the meaningful signals. A single failed-then-success (b) is ordinary typo behaviour, and multiple users logging in during the same hour (d) is completely normal.",
        },
        {
          id: "q3",
          prompt: "In one or two words, what is this type of attack usually called?",
          kind: "short-text",
          correctText: ["account takeover", "credential compromise", "impossible travel", "compromised account", "credential stuffing", "account compromise"],
          explanation: "This pattern is commonly called account takeover (or described as \"impossible travel\").",
        },
      ],
    },
  },
  {
    id: "sec-02-code-mistake",
    domainId: "cybersecurity",
    lessonId: "lesson-cybersecurity-day6",
    day: 6,
    title: "Find the security mistake",
    description: "Review a simulated login endpoint and identify the mistakes in it.",
    instructions:
      "Below is a simulated login route from a small application. Read it closely and answer the questions - you are not asked to attack any real system, only to review the code shown.",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    learningObjectives: ["Spotting SQL injection", "Recognizing plaintext password handling", "Data over-exposure"],
    prerequisiteConcepts: ["common security mistakes"],
    passingScore: 70,
    order: 2,
    basePoints: 75,
    hints: [
      { order: 1, text: "Look closely at how `username` and `password` end up inside the SQL string." },
      { order: 2, text: "Consider what's returned to the client in `res.json(...)` - is it more than the client needs?" },
    ],
    config: {
      type: "security",
      briefing: "This route was flagged during a code review. Find what's wrong with it.",
      exhibits: [
        {
          kind: "code",
          title: "routes/login.js",
          language: "javascript",
          code:
            "app.post('/login', async (req, res) => {\n" +
            "  const { username, password } = req.body;\n\n" +
            "  const query =\n" +
            "    \"SELECT * FROM users WHERE username = '\" + username +\n" +
            "    \"' AND password = '\" + password + \"'\";\n\n" +
            "  const result = await db.query(query);\n\n" +
            "  if (result.rows.length > 0) {\n" +
            "    res.json({ success: true, user: result.rows[0] });\n" +
            "  } else {\n" +
            "    res.status(401).json({ success: false });\n" +
            "  }\n" +
            "});",
        },
      ],
      questions: [
        {
          id: "q1",
          prompt: "Which mistakes are present in this code? Select all that apply.",
          kind: "multi-choice",
          options: [
            { id: "a", label: "User input is inserted directly into the SQL query string" },
            { id: "b", label: "Passwords are compared as plaintext rather than a hashed value" },
            { id: "c", label: "The route is defined with async/await" },
            { id: "d", label: "The response includes the full user record instead of only what's needed" },
            { id: "e", label: "The route uses the POST method" },
          ],
          correctOptionIds: ["a", "b", "d"],
          explanation:
            "Building the SQL string by concatenating raw input (a) allows SQL injection. Comparing `password` directly rather than a hashed value (b) means a database leak exposes real passwords. Returning `result.rows[0]` (d) sends the entire user row - including the password field - back to the client. Using async/await (c) and POST (e) are both correct, ordinary choices, not mistakes.",
        },
        {
          id: "q2",
          prompt: "What could an attacker type as the username to log in without knowing any password?",
          kind: "short-text",
          correctText: ["' or '1'='1", "or 1=1", "' or 1=1 --", "admin'--", "' or true --", "' or '1' = '1"],
          explanation:
            "Entering something like `' OR '1'='1` turns the WHERE clause into something that's always true, bypassing the password check entirely - the classic SQL injection payload for this pattern.",
        },
      ],
    },
  },
  {
    id: "sec-03-incident-logs",
    domainId: "cybersecurity",
    lessonId: "lesson-cybersecurity-day6",
    day: 6,
    title: "Analyze logs and identify the incident",
    description: "Review an HTTP access log and classify the likely security incident.",
    instructions: "Below is a slice of a web server's access log. Identify what's happening and which IP is responsible.",
    difficulty: "challenge",
    estimatedMinutes: 15,
    learningObjectives: ["HTTP status codes", "Recognizing brute-force patterns", "Filtering noise from signal"],
    prerequisiteConcepts: ["HTTP basics", "reading logs"],
    passingScore: 70,
    order: 3,
    basePoints: 100,
    hints: [
      { order: 1, text: "Group the log lines mentally by IP address first." },
      { order: 2, text: "One IP is guessing admin paths and repeatedly POSTing to a login endpoint - what does that pattern usually mean?" },
    ],
    config: {
      type: "security",
      briefing: "Your monitoring dashboard flagged unusual traffic overnight. Review the access log below.",
      exhibits: [
        {
          kind: "log",
          title: "access.log (excerpt)",
          lines: [
            "203.0.113.55 GET /admin 401",
            "203.0.113.55 GET /administrator 404",
            "203.0.113.55 GET /wp-admin 404",
            "203.0.113.55 GET /admin.php 404",
            "203.0.113.55 GET /admin/login 401",
            "198.51.100.7 GET /products 200",
            "203.0.113.55 POST /admin/login 401",
            "198.51.100.7 GET /cart 200",
            "203.0.113.55 POST /admin/login 401",
            "203.0.113.55 POST /admin/login 401",
            "203.0.113.55 POST /admin/login 200",
            "203.0.113.55 GET /admin/dashboard 200",
          ],
        },
      ],
      questions: [
        {
          id: "q1",
          prompt: "What type of incident does this pattern most likely represent?",
          kind: "single-choice",
          options: [
            { id: "a", label: "Brute-force login attempt against the admin panel" },
            { id: "b", label: "A normal customer browsing session" },
            { id: "c", label: "A distributed denial-of-service (DDoS) attack" },
            { id: "d", label: "A cross-site scripting (XSS) attack" },
          ],
          correctOptionIds: ["a"],
          explanation:
            "Repeated path guesses against admin URLs followed by multiple failed POSTs to a login endpoint, ending in a success, is the signature of a brute-force (or credential-guessing) attack that ultimately succeeded.",
        },
        {
          id: "q2",
          prompt: "Which IP address should be investigated and likely blocked?",
          kind: "short-text",
          correctText: ["203.0.113.55"],
          explanation: "203.0.113.55 accounts for every suspicious line; 198.51.100.7 is ordinary customer traffic.",
        },
        {
          id: "q3",
          prompt: "Which pieces of evidence support that conclusion? Select all that apply.",
          kind: "multi-choice",
          options: [
            { id: "a", label: "Repeated POST requests to the same login endpoint from one IP" },
            { id: "b", label: "A run of 401/404 responses followed by an eventual 200" },
            { id: "c", label: "Requests to unrelated paths like /products and /cart" },
            { id: "d", label: "Several 404s for common admin path guesses" },
          ],
          correctOptionIds: ["a", "b", "d"],
          explanation:
            "(a), (b), and (d) all come from the attacking IP and form the attack pattern. (c) is unrelated normal traffic from a different visitor and should be treated as noise.",
        },
      ],
    },
  },
];
