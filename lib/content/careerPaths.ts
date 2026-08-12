import type { DomainCareerMap } from "@/types/paths";

// ---------------------------------------------------------------------------
// Career-path decision trees for all six domains. Authored content: a learner
// walks from a domain into concrete roles by making real technology decisions,
// and each destination carries a validated roadmap plus learning resources.
// Kept factual and non-promissory - "in demand" notes describe the field, not
// a guarantee.
// ---------------------------------------------------------------------------

const softwareDevelopment: DomainCareerMap = {
  domainId: "software-development",
  intro:
    "Software development splits into a few very different daily lives. The first fork is the biggest: what kind of thing do you want to build? Web pages people visit, apps people install, or the servers behind them.",
  techMap: [
    { id: "javascript", name: "JavaScript" },
    { id: "typescript", name: "TypeScript" },
    { id: "react", name: "React" },
    { id: "vue", name: "Vue" },
    { id: "nextjs", name: "Next.js" },
    { id: "flutter", name: "Flutter" },
    { id: "kotlin", name: "Kotlin" },
    { id: "swift", name: "Swift" },
    { id: "react", name: "React Native" },
    { id: "nodejs", name: "Node.js" },
    { id: "python", name: "Python" },
    { id: "go", name: "Go" },
    { id: "spring", name: "Spring" },
    { id: "postgresql", name: "PostgreSQL" },
    { id: "docker", name: "Docker" },
  ],
  root: {
    question: "What do you most want to build?",
    hint: "There's no wrong answer - each leads somewhere real.",
    choices: [
      {
        id: "web",
        label: "Web apps",
        tagline: "Things people open in a browser - dashboards, shops, tools.",
        tech: { id: "html5", name: "Web" },
        whatIsIt:
          "Web development builds what runs in the browser. It has two halves: the front end (what users see and click) and the back end (the server that feeds it data). You can specialize in either or do both.",
        next: {
          question: "Front of the app, or behind it?",
          hint: "Front end = what users see. Back end = the logic and data behind it.",
          choices: [
            {
              id: "frontend",
              label: "Front end",
              tagline: "The visible, interactive part users touch.",
              tech: { id: "react", name: "React" },
              whatIsIt:
                "Front-end developers turn designs into working, interactive screens. HTML gives structure, CSS gives style, and JavaScript gives behaviour - then a framework like React organizes it all as your app grows.",
              outcome: {
                role: "Front-End Developer",
                summary:
                  "You build the screens people actually use - forms, dashboards, animations - and make them fast, accessible, and correct across devices.",
                whyThisFits:
                  "You chose the visible, interactive side of the web. Front end is where design meets code, and it rewards attention to detail and empathy for the user.",
                coreTech: [
                  { id: "html5", name: "HTML" },
                  { id: "css", name: "CSS" },
                  { id: "javascript", name: "JavaScript" },
                  { id: "typescript", name: "TypeScript" },
                  { id: "react", name: "React" },
                  { id: "nextjs", name: "Next.js" },
                ],
                roadmap: [
                  { title: "HTML & CSS", detail: "Structure and style a static page. Learn the box model, flexbox, and grid before any framework." },
                  { title: "JavaScript", detail: "The language of the browser: variables, functions, arrays, and manipulating the page (the DOM)." },
                  { title: "React", detail: "Build UIs as reusable components with state. This is the most in-demand front-end skill." },
                  { title: "TypeScript", detail: "JavaScript with type-checking - catches whole classes of bugs and is now standard on serious teams." },
                  { title: "A framework like Next.js", detail: "Adds routing, server rendering, and structure so your React app is production-ready." },
                ],
                resources: [
                  { label: "MDN Web Docs", kind: "Docs", url: "https://developer.mozilla.org/", free: true },
                  { label: "freeCodeCamp - Responsive Web Design", kind: "Course", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", free: true },
                  { label: "React official tutorial", kind: "Docs", url: "https://react.dev/learn", free: true },
                  { label: "The Odin Project - Full Stack JS", kind: "Course", url: "https://www.theodinproject.com/", free: true },
                ],
                demandNote: "Consistently one of the highest-volume roles in software hiring.",
              },
            },
            {
              id: "backend",
              label: "Back end",
              tagline: "Servers, databases, and the logic users never see.",
              tech: { id: "nodejs", name: "Node.js" },
              whatIsIt:
                "Back-end developers build the server: the code that validates requests, enforces the rules, and talks to the database. It's less visual, more about correctness, data, and scale.",
              next: {
                question: "Which back-end ecosystem pulls you?",
                hint: "All three are excellent. This mostly decides which language you'll live in.",
                choices: [
                  {
                    id: "node",
                    label: "Node.js",
                    tagline: "JavaScript on the server - one language front to back.",
                    tech: { id: "nodejs", name: "Node.js" },
                    whatIsIt:
                      "Node.js runs JavaScript outside the browser, so a web developer can use one language everywhere. Paired with Express, it's the fastest on-ramp to back-end work if you already know JS.",
                    outcome: {
                      role: "Back-End Developer (Node.js)",
                      summary:
                        "You design APIs, model data, and keep the server fast and correct - in the same JavaScript you'd use on the front end.",
                      whyThisFits:
                        "You want server-side work without switching languages. Node keeps you in JavaScript end to end, which makes full-stack roles a natural next step.",
                      coreTech: [
                        { id: "nodejs", name: "Node.js" },
                        { id: "express", name: "Express" },
                        { id: "typescript", name: "TypeScript" },
                        { id: "postgresql", name: "PostgreSQL" },
                        { id: "docker", name: "Docker" },
                      ],
                      roadmap: [
                        { title: "JavaScript deeply", detail: "Async/await, promises, and how the event loop works - the heart of Node." },
                        { title: "Node + Express", detail: "Build a REST API: routes, request handling, middleware." },
                        { title: "Databases & SQL", detail: "Model data in PostgreSQL and query it safely (parameterized queries!)." },
                        { title: "Auth & security", detail: "Sessions, tokens, hashing passwords, validating input on the server." },
                        { title: "Docker & deployment", detail: "Package the server so it runs the same everywhere, then ship it." },
                      ],
                      resources: [
                        { label: "Node.js official docs", kind: "Docs", url: "https://nodejs.org/en/learn", free: true },
                        { label: "Express guide", kind: "Docs", url: "https://expressjs.com/en/guide/routing.html", free: true },
                        { label: "The Odin Project - Node course", kind: "Course", url: "https://www.theodinproject.com/paths/full-stack-javascript", free: true },
                        { label: "PostgreSQL Tutorial", kind: "Practice", url: "https://www.postgresqltutorial.com/", free: true },
                      ],
                    },
                  },
                  {
                    id: "python",
                    label: "Python",
                    tagline: "Readable, everywhere - web, data, and AI all speak it.",
                    tech: { id: "python", name: "Python" },
                    whatIsIt:
                      "Python is famously readable and used far beyond web - data science, automation, and AI too. For web back ends, Django gives you everything batteries-included; FastAPI is the modern, fast choice for APIs.",
                    outcome: {
                      role: "Back-End Developer (Python)",
                      summary:
                        "You build server logic and APIs in Python - and open doors toward data and AI work, since they share the same language.",
                      whyThisFits:
                        "You want a versatile language. Python back-end skills transfer directly into data analytics and machine learning if you drift that way later.",
                      coreTech: [
                        { id: "python", name: "Python" },
                        { id: "django", name: "Django" },
                        { id: "fastapi", name: "FastAPI" },
                        { id: "postgresql", name: "PostgreSQL" },
                        { id: "docker", name: "Docker" },
                      ],
                      roadmap: [
                        { title: "Python fundamentals", detail: "Data structures, functions, classes, and the standard library." },
                        { title: "A web framework", detail: "Django for full-featured apps, or FastAPI for lean, fast APIs." },
                        { title: "Databases & ORMs", detail: "Model data and query it with an ORM instead of raw SQL strings." },
                        { title: "APIs & auth", detail: "Design REST endpoints, handle authentication, validate inputs." },
                        { title: "Testing & deployment", detail: "Write automated tests, containerize with Docker, deploy." },
                      ],
                      resources: [
                        { label: "Python official tutorial", kind: "Docs", url: "https://docs.python.org/3/tutorial/", free: true },
                        { label: "Django - Getting Started", kind: "Docs", url: "https://docs.djangoproject.com/en/stable/intro/", free: true },
                        { label: "FastAPI tutorial", kind: "Docs", url: "https://fastapi.tiangolo.com/tutorial/", free: true },
                        { label: "CS50 Web with Python & JS", kind: "Course", url: "https://cs50.harvard.edu/web/", free: true },
                      ],
                    },
                  },
                  {
                    id: "go",
                    label: "Go",
                    tagline: "Built for fast, scalable services. Loved at big infra shops.",
                    tech: { id: "go", name: "Go" },
                    whatIsIt:
                      "Go (Golang) was made by Google for simple, fast, concurrent servers. It's the language behind Docker and Kubernetes, and a favourite for high-scale back ends and cloud tooling.",
                    outcome: {
                      role: "Back-End / Systems Developer (Go)",
                      summary:
                        "You build fast, concurrent services that handle serious scale - the kind that power infrastructure and high-traffic APIs.",
                      whyThisFits:
                        "You're drawn to performance and scale. Go is small, fast, and central to cloud-native infrastructure - a strong bridge toward DevOps too.",
                      coreTech: [
                        { id: "go", name: "Go" },
                        { id: "postgresql", name: "PostgreSQL" },
                        { id: "docker", name: "Docker" },
                        { id: "kubernetes", name: "Kubernetes" },
                      ],
                      roadmap: [
                        { title: "Go fundamentals", detail: "The language is small by design - learn the whole thing in a week." },
                        { title: "Concurrency", detail: "Goroutines and channels: Go's superpower for handling many things at once." },
                        { title: "Build an HTTP API", detail: "The standard library alone is enough for production servers." },
                        { title: "Databases", detail: "Connect to PostgreSQL, write efficient queries." },
                        { title: "Containers & cloud", detail: "Go binaries are tiny and deploy beautifully - lean into Docker/K8s." },
                      ],
                      resources: [
                        { label: "A Tour of Go", kind: "Practice", url: "https://go.dev/tour/", free: true },
                        { label: "Go by Example", kind: "Docs", url: "https://gobyexample.com/", free: true },
                        { label: "Learn Go with Tests", kind: "Book", url: "https://quii.gitbook.io/learn-go-with-tests/", free: true },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        id: "mobile",
        label: "Mobile apps",
        tagline: "Apps people install on their phones - iOS and Android.",
        tech: { id: "flutter", name: "Flutter" },
        whatIsIt:
          "Mobile development builds apps that live on phones. The big decision is reach vs. depth: one codebase for both platforms (cross-platform), or native code tuned for a single platform's best experience.",
        next: {
          question: "One codebase for both phones, or go native?",
          hint: "Cross-platform ships to iOS + Android at once. Native goes deep on one.",
          choices: [
            {
              id: "flutter",
              label: "Flutter",
              tagline: "One codebase, both platforms. Google's toolkit, uses Dart.",
              tech: { id: "flutter", name: "Flutter" },
              whatIsIt:
                "Flutter is Google's framework for building iOS and Android (and web/desktop) apps from a single codebase, using the Dart language. It draws its own UI, so apps look consistent everywhere and run fast.",
              outcome: {
                role: "Flutter Developer",
                summary:
                  "You ship one codebase to both iOS and Android, building smooth, custom-designed apps in Dart - great for startups moving fast.",
                whyThisFits:
                  "You want maximum reach for your effort. Flutter's single codebase is the most efficient way to reach every phone, and its design flexibility is unmatched cross-platform.",
                coreTech: [
                  { id: "flutter", name: "Flutter" },
                  { id: "dart", name: "Dart" },
                  { id: "androidstudio", name: "Android Studio" },
                  { id: "git", name: "Git" },
                ],
                roadmap: [
                  { title: "Dart basics", detail: "A clean, familiar language - if you know any C-style language, this is quick." },
                  { title: "Flutter widgets", detail: "Everything in Flutter is a widget. Learn layout, then stateful widgets." },
                  { title: "State management", detail: "Provider or Riverpod to manage data as your app grows." },
                  { title: "APIs & storage", detail: "Fetch data from a server, cache it, and store things locally." },
                  { title: "Publish", detail: "Build and submit to the App Store and Google Play." },
                ],
                resources: [
                  { label: "Flutter official docs", kind: "Docs", url: "https://docs.flutter.dev/", free: true },
                  { label: "Dart language tour", kind: "Docs", url: "https://dart.dev/language", free: true },
                  { label: "Flutter codelabs", kind: "Practice", url: "https://docs.flutter.dev/codelabs", free: true },
                  { label: "The Net Ninja - Flutter (YouTube)", kind: "Video", url: "https://www.youtube.com/c/TheNetNinja", free: true },
                ],
                demandNote: "Especially strong at startups and agencies building for both platforms.",
              },
            },
            {
              id: "reactnative",
              label: "React Native",
              tagline: "One codebase in React. Best if you already know web.",
              tech: { id: "react", name: "React Native" },
              whatIsIt:
                "React Native builds real iOS and Android apps using React and JavaScript. If you already know React from the web, you can reuse most of that knowledge to ship mobile apps. Expo makes getting started painless.",
              outcome: {
                role: "React Native Developer",
                summary:
                  "You build cross-platform mobile apps in React and JavaScript, reusing web skills - a natural jump for front-end developers.",
                whyThisFits:
                  "You lean toward the JavaScript/React world. React Native lets your existing web skills carry straight into mobile with the least new learning.",
                coreTech: [
                  { id: "react", name: "React Native" },
                  { id: "javascript", name: "JavaScript" },
                  { id: "typescript", name: "TypeScript" },
                  { id: "expo", name: "Expo" },
                ],
                roadmap: [
                  { title: "React first", detail: "React Native is React - learn components, props, and state on the web first." },
                  { title: "React Native core", detail: "Native components, styling, and navigation between screens." },
                  { title: "Expo", detail: "The fastest way to build, preview on a real phone, and ship." },
                  { title: "Device features", detail: "Camera, notifications, storage - the things that make it feel native." },
                  { title: "Publish", detail: "Build for the stores with Expo's build service." },
                ],
                resources: [
                  { label: "React Native docs", kind: "Docs", url: "https://reactnative.dev/docs/getting-started", free: true },
                  { label: "Expo docs", kind: "Docs", url: "https://docs.expo.dev/", free: true },
                  { label: "React official tutorial", kind: "Docs", url: "https://react.dev/learn", free: true },
                ],
              },
            },
            {
              id: "native",
              label: "Native (one platform)",
              tagline: "Go deep on iOS or Android for the best experience.",
              tech: { id: "kotlin", name: "Kotlin / Swift" },
              whatIsIt:
                "Native development uses each platform's own language and tools: Kotlin for Android, Swift for iOS. It's more work to cover both, but you get the deepest access to the device and the smoothest possible experience.",
              next: {
                question: "Which platform is home for you?",
                hint: "Android reaches more of the world; iOS users tend to spend more.",
                choices: [
                  {
                    id: "android",
                    label: "Android",
                    tagline: "Kotlin + Android Studio. The world's most-used OS.",
                    tech: { id: "kotlin", name: "Kotlin" },
                    whatIsIt:
                      "Android apps are written in Kotlin (a modern, concise language that replaced Java as Google's favourite) using Android Studio. You'll use Jetpack Compose, the modern way to build Android UIs.",
                    outcome: {
                      role: "Android Developer",
                      summary:
                        "You build native Android apps in Kotlin, tuned for the huge, diverse range of Android devices worldwide.",
                      whyThisFits:
                        "You want depth on the platform with the largest global reach. Native Android gives you full device access and the smoothest UX Android can offer.",
                      coreTech: [
                        { id: "kotlin", name: "Kotlin" },
                        { id: "androidstudio", name: "Android Studio" },
                        { id: "git", name: "Git" },
                      ],
                      roadmap: [
                        { title: "Kotlin", detail: "Modern, concise, null-safe. Pleasant to learn even as a first language." },
                        { title: "Android Studio & the lifecycle", detail: "Activities, the app lifecycle, and how Android runs your code." },
                        { title: "Jetpack Compose", detail: "The modern, declarative way to build Android UIs." },
                        { title: "Data & networking", detail: "Room for local storage, Retrofit for talking to servers." },
                        { title: "Publish to Play", detail: "Sign, build, and release on the Google Play Store." },
                      ],
                      resources: [
                        { label: "Android Basics with Compose", kind: "Course", url: "https://developer.android.com/courses/android-basics-compose/course", free: true },
                        { label: "Kotlin docs", kind: "Docs", url: "https://kotlinlang.org/docs/home.html", free: true },
                        { label: "Android developer guides", kind: "Docs", url: "https://developer.android.com/guide", free: true },
                      ],
                    },
                  },
                  {
                    id: "ios",
                    label: "iOS",
                    tagline: "Swift + Xcode. Polished apps for iPhone and iPad.",
                    tech: { id: "swift", name: "Swift" },
                    whatIsIt:
                      "iOS apps are written in Swift (Apple's fast, safe, modern language) using Xcode on a Mac. SwiftUI is the current way to build interfaces. Apple's ecosystem is tightly controlled, which means consistency and polish.",
                    outcome: {
                      role: "iOS Developer",
                      summary:
                        "You build polished native apps for iPhone and iPad in Swift, working within Apple's high-quality, tightly-integrated ecosystem.",
                      whyThisFits:
                        "You value polish and a curated ecosystem. iOS users engage and spend more on average, and the platform prizes craft.",
                      coreTech: [
                        { id: "swift", name: "Swift" },
                        { id: "xcode", name: "Xcode" },
                        { id: "git", name: "Git" },
                      ],
                      roadmap: [
                        { title: "Swift", detail: "Safe, expressive, and modern. Apple's playground apps make it fun to start." },
                        { title: "Xcode & SwiftUI", detail: "Build interfaces declaratively with SwiftUI, Apple's modern UI framework." },
                        { title: "App architecture", detail: "State, data flow, and navigation the SwiftUI way." },
                        { title: "Data & networking", detail: "Persist data and call APIs; handle Apple's app lifecycle." },
                        { title: "Ship to the App Store", detail: "Provisioning, signing, and submitting for review." },
                      ],
                      resources: [
                        { label: "Apple - Develop apps for iOS", kind: "Course", url: "https://developer.apple.com/tutorials/app-dev-training", free: true },
                        { label: "Swift language guide", kind: "Docs", url: "https://docs.swift.org/swift-book/", free: true },
                        { label: "Hacking with Swift (100 Days)", kind: "Course", url: "https://www.hackingwithswift.com/100/swiftui", free: true },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        id: "backend-systems",
        label: "The engine room",
        tagline: "APIs, databases, and the systems that hold it all up.",
        tech: { id: "docker", name: "Systems" },
        whatIsIt:
          "Beyond any single app, someone builds the shared foundations: the APIs many apps call, the databases that never lose data, the services that scale to millions. This is systems-leaning software engineering.",
        outcome: {
          role: "Software Engineer (Systems & APIs)",
          summary:
            "You design the shared back-end systems and APIs whole products depend on - focused on correctness, data integrity, and scale.",
          whyThisFits:
            "You're drawn to the foundations rather than the surface. This path values rigorous thinking and leads naturally toward senior engineering and architecture.",
          coreTech: [
            { id: "python", name: "Python" },
            { id: "go", name: "Go" },
            { id: "postgresql", name: "PostgreSQL" },
            { id: "docker", name: "Docker" },
            { id: "kubernetes", name: "Kubernetes" },
          ],
          roadmap: [
            { title: "One strong language", detail: "Go or Python, learned deeply - not just syntax but idioms and tooling." },
            { title: "Data structures & algorithms", detail: "The Problem Solving day's material, taken further - this path leans on it." },
            { title: "Databases", detail: "Relational modeling, indexes, transactions, and when to reach for something else." },
            { title: "API & system design", detail: "How to design services that stay correct and fast as they grow." },
            { title: "Infrastructure basics", detail: "Containers, deployment, observability - how software actually runs in production." },
          ],
          resources: [
            { label: "System Design Primer", kind: "Book", url: "https://github.com/donnemartin/system-design-primer", free: true },
            { label: "CS50 (Harvard)", kind: "Course", url: "https://cs50.harvard.edu/x/", free: true },
            { label: "PostgreSQL Tutorial", kind: "Practice", url: "https://www.postgresqltutorial.com/", free: true },
          ],
        },
      },
    ],
  },
};

const problemSolving: DomainCareerMap = {
  domainId: "problem-solving",
  intro:
    "Strong problem-solving and algorithms open a few distinct doors. The question is where you want that skill to point: passing tough technical interviews, competing for sport, or applying it to data and AI.",
  techMap: [
    { id: "python", name: "Python" },
    { id: "cplusplus", name: "C++" },
    { id: "java", name: "Java" },
    { id: "leetcode", name: "LeetCode" },
    { id: "codeforces", name: "Codeforces" },
    { id: "hackerrank", name: "HackerRank" },
  ],
  root: {
    question: "Where do you want this skill to take you?",
    hint: "Problem-solving is a multiplier - it makes every technical path stronger.",
    choices: [
      {
        id: "interviews",
        label: "Ace the interviews",
        tagline: "Land roles at top companies by mastering the interview loop.",
        tech: { id: "leetcode", name: "LeetCode" },
        whatIsIt:
          "Most competitive software roles gate on a data-structures-and-algorithms interview. Getting good at these unlocks the highest-paying engineering jobs - it's a learnable skill, not raw talent.",
        outcome: {
          role: "Engineer who clears the DSA bar",
          summary:
            "You can confidently solve algorithmic interview problems, opening doors to competitive software roles that would otherwise be closed.",
          whyThisFits:
            "You want the skill that most directly changes which jobs you can get. Interview prep is concrete, measurable, and pays off fast.",
          coreTech: [
            { id: "python", name: "Python" },
            { id: "java", name: "Java" },
            { id: "leetcode", name: "LeetCode" },
          ],
          roadmap: [
            { title: "Core data structures", detail: "Arrays, hash maps, stacks, queues, trees, graphs - know them cold." },
            { title: "The patterns", detail: "Two pointers, sliding window, BFS/DFS, recursion, dynamic programming." },
            { title: "Complexity", detail: "Analyze time and space so you can pick the right approach under pressure." },
            { title: "Timed practice", detail: "Solve problems on a clock; explain your thinking out loud as you go." },
            { title: "Mock interviews", detail: "Practice the human part - communicating while you solve." },
          ],
          resources: [
            { label: "NeetCode 150", kind: "Practice", url: "https://neetcode.io/practice", free: true },
            { label: "LeetCode", kind: "Practice", url: "https://leetcode.com/", free: true },
            { label: "Grokking Algorithms", kind: "Book", url: "https://www.manning.com/books/grokking-algorithms", free: false },
            { label: "AlgoExpert / Tech Interview Handbook", kind: "Docs", url: "https://www.techinterviewhandbook.org/", free: true },
          ],
          demandNote: "The single most reused skill across nearly every software hiring pipeline.",
        },
      },
      {
        id: "competitive",
        label: "Competitive programming",
        tagline: "Solve hard problems fast, for sport and mastery.",
        tech: { id: "codeforces", name: "Codeforces" },
        whatIsIt:
          "Competitive programming is the sport of solving algorithmic puzzles against the clock, often in C++ for speed. It builds extraordinary problem-solving depth and looks striking on a resume.",
        outcome: {
          role: "Competitive Programmer",
          summary:
            "You solve algorithmically hard problems quickly and correctly under time pressure - a deep skill that transfers to any hard engineering.",
          whyThisFits:
            "You enjoy the challenge itself. Competitive programming pushes your algorithmic ceiling higher than interview prep alone, and it's genuinely fun for the right mind.",
          coreTech: [
            { id: "cplusplus", name: "C++" },
            { id: "codeforces", name: "Codeforces" },
          ],
          roadmap: [
            { title: "C++ & the STL", detail: "The competitive standard - fast, with a rich standard library of data structures." },
            { title: "Foundational algorithms", detail: "Sorting, searching, graph traversal, greedy, dynamic programming." },
            { title: "Advanced topics", detail: "Segment trees, number theory, advanced DP, graph algorithms." },
            { title: "Contest practice", detail: "Enter timed rounds regularly; upsolve the problems you missed." },
          ],
          resources: [
            { label: "Codeforces", kind: "Practice", url: "https://codeforces.com/", free: true },
            { label: "CP-Algorithms", kind: "Docs", url: "https://cp-algorithms.com/", free: true },
            { label: "USACO Guide", kind: "Course", url: "https://usaco.guide/", free: true },
            { label: "AtCoder", kind: "Practice", url: "https://atcoder.jp/", free: true },
          ],
        },
      },
      {
        id: "applied",
        label: "Apply it to AI & data",
        tagline: "Turn algorithmic thinking into machine-learning work.",
        tech: { id: "python", name: "Python" },
        whatIsIt:
          "Algorithmic maturity is the foundation under machine learning and data science. If you like the reasoning but want it aimed at real-world data and models, this is where problem-solving meets AI.",
        outcome: {
          role: "Toward Machine Learning / Data Science",
          summary:
            "You point your problem-solving at data and models - the reasoning skills here are exactly what ML work is built on.",
          whyThisFits:
            "You want your algorithmic skill applied to real problems. ML and data science reward the same structured thinking, plus math and Python.",
          coreTech: [
            { id: "python", name: "Python" },
            { id: "pandas", name: "pandas" },
            { id: "scikitlearn", name: "scikit-learn" },
            { id: "pytorch", name: "PyTorch" },
          ],
          roadmap: [
            { title: "Python + math", detail: "Python fluency plus linear algebra, probability, and statistics." },
            { title: "Data handling", detail: "pandas and NumPy to clean, shape, and explore data." },
            { title: "Classic ML", detail: "scikit-learn: regression, classification, evaluation - the fundamentals." },
            { title: "Deep learning", detail: "PyTorch or TensorFlow for neural networks once the basics are solid." },
          ],
          resources: [
            { label: "fast.ai - Practical Deep Learning", kind: "Course", url: "https://course.fast.ai/", free: true },
            { label: "Kaggle Learn", kind: "Practice", url: "https://www.kaggle.com/learn", free: true },
            { label: "Andrew Ng - Machine Learning", kind: "Course", url: "https://www.coursera.org/specializations/machine-learning-introduction", free: false },
            { label: "scikit-learn tutorials", kind: "Docs", url: "https://scikit-learn.org/stable/tutorial/index.html", free: true },
          ],
        },
      },
    ],
  },
};

const uiuxDesign: DomainCareerMap = {
  domainId: "ui-ux-design",
  intro:
    "Design careers split by where you sit on the line from research to pixels. Do you want to shape how a product works (UX), how it looks and feels (UI), or bridge design and code?",
  techMap: [
    { id: "figma", name: "Figma" },
    { id: "sketch", name: "Sketch" },
    { id: "framer", name: "Framer" },
    { id: "html5", name: "HTML" },
    { id: "css", name: "CSS" },
  ],
  root: {
    question: "Which part of design pulls you most?",
    hint: "Most designers lean one way but touch all of it.",
    choices: [
      {
        id: "ux",
        label: "UX - how it works",
        tagline: "Research, flows, and structure. Make products make sense.",
        tech: { id: "figma", name: "Figma" },
        whatIsIt:
          "UX (user experience) design is about how a product works: understanding users, mapping their journeys, and structuring flows so the right thing is easy. Less about pixels, more about decisions and evidence.",
        outcome: {
          role: "UX Designer",
          summary:
            "You research users, map their journeys, and design the structure and flows that make a product genuinely usable before it's ever styled.",
          whyThisFits:
            "You care about how things work more than how they look. UX rewards empathy, logic, and evidence over decoration.",
          coreTech: [
            { id: "figma", name: "Figma" },
          ],
          roadmap: [
            { title: "UX fundamentals", detail: "User-centered design, information architecture, and heuristics." },
            { title: "Research methods", detail: "Interviews, usability testing, and turning findings into decisions." },
            { title: "Flows & wireframes", detail: "Map journeys and structure screens in low fidelity first." },
            { title: "Figma", detail: "The industry-standard tool for wireframes, prototypes, and handoff." },
            { title: "Portfolio", detail: "Two or three deep case studies showing your process, not just outcomes." },
          ],
          resources: [
            { label: "Google UX Design Certificate", kind: "Course", url: "https://www.coursera.org/professional-certificates/google-ux-design", free: false },
            { label: "Nielsen Norman Group articles", kind: "Docs", url: "https://www.nngroup.com/articles/", free: true },
            { label: "Figma - Learn design", kind: "Course", url: "https://www.figma.com/resource-library/", free: true },
            { label: "Laws of UX", kind: "Docs", url: "https://lawsofux.com/", free: true },
          ],
        },
      },
      {
        id: "ui",
        label: "UI - how it looks",
        tagline: "Visual design, type, color, and polished interfaces.",
        tech: { id: "figma", name: "Figma" },
        whatIsIt:
          "UI (user interface) design is the craft of the visible: layout, typography, color, spacing, and the small interactions that make an interface feel right. It's where visual skill and systems thinking meet.",
        outcome: {
          role: "UI / Product Designer",
          summary:
            "You turn structure into beautiful, consistent interfaces - building design systems, choosing type and color, and sweating the details users feel but never name.",
          whyThisFits:
            "You have an eye for the visual and enjoy craft. UI design pairs aesthetic sense with the discipline of design systems.",
          coreTech: [
            { id: "figma", name: "Figma" },
            { id: "framer", name: "Framer" },
          ],
          roadmap: [
            { title: "Visual fundamentals", detail: "Typography, color theory, spacing, and hierarchy - the Day 3 material, deeper." },
            { title: "Figma mastery", detail: "Components, auto-layout, variants, and building reusable systems." },
            { title: "Design systems", detail: "Tokens, component libraries, and consistency at scale." },
            { title: "Interaction & motion", detail: "Prototyping and micro-interactions in Figma or Framer." },
            { title: "Portfolio", detail: "Polished work with a clear point of view on craft." },
          ],
          resources: [
            { label: "Refactoring UI", kind: "Book", url: "https://www.refactoringui.com/", free: false },
            { label: "Figma resource library", kind: "Course", url: "https://www.figma.com/resource-library/", free: true },
            { label: "Material Design guidelines", kind: "Docs", url: "https://m3.material.io/", free: true },
            { label: "Framer - Learn", kind: "Docs", url: "https://www.framer.com/academy/", free: true },
          ],
        },
      },
      {
        id: "designeng",
        label: "Design + code",
        tagline: "Bridge design and engineering. Build what you design.",
        tech: { id: "css", name: "CSS" },
        whatIsIt:
          "Design engineers (or UX engineers) sit between design and development - they design in code, build design systems, and make sure the beautiful mockup survives the trip to production. Rare and highly valued.",
        outcome: {
          role: "Design Engineer",
          summary:
            "You design and build - translating mockups into real, polished front-end code and owning the design system where the two worlds meet.",
          whyThisFits:
            "You want to make what you design, not hand it off. This hybrid role is scarce and prized on modern product teams.",
          coreTech: [
            { id: "figma", name: "Figma" },
            { id: "html5", name: "HTML" },
            { id: "css", name: "CSS" },
            { id: "react", name: "React" },
          ],
          roadmap: [
            { title: "Design foundations", detail: "Enough UI craft to make good visual decisions yourself." },
            { title: "HTML & CSS deeply", detail: "The real material of the web - layout, responsive design, accessibility." },
            { title: "A component framework", detail: "React or similar, focused on building UI components." },
            { title: "Design systems in code", detail: "Turn Figma components into a real, reusable code library." },
            { title: "Motion & polish", detail: "Animations and interactions that make interfaces feel alive." },
          ],
          resources: [
            { label: "MDN Web Docs", kind: "Docs", url: "https://developer.mozilla.org/", free: true },
            { label: "web.dev - Learn CSS", kind: "Course", url: "https://web.dev/learn/css/", free: true },
            { label: "Refactoring UI", kind: "Book", url: "https://www.refactoringui.com/", free: false },
            { label: "Josh Comeau - CSS for JS Devs", kind: "Course", url: "https://css-for-js.dev/", free: false },
          ],
        },
      },
    ],
  },
};

const dataAnalytics: DomainCareerMap = {
  domainId: "data-analytics",
  intro:
    "Working with data spans from answering business questions to building the pipelines that move data at scale to training predictive models. Where on that spectrum do you want to live?",
  techMap: [
    { id: "sql", name: "SQL" },
    { id: "python", name: "Python" },
    { id: "pandas", name: "pandas" },
    { id: "tableau", name: "Tableau" },
    { id: "powerbi", name: "Power BI" },
    { id: "snowflake", name: "Snowflake" },
    { id: "spark", name: "Spark" },
    { id: "airflow", name: "Airflow" },
    { id: "scikitlearn", name: "scikit-learn" },
    { id: "pytorch", name: "PyTorch" },
  ],
  root: {
    question: "What do you want to do with data?",
    hint: "All three start with SQL - then they diverge sharply.",
    choices: [
      {
        id: "analyst",
        label: "Answer questions",
        tagline: "Turn data into insights that drive decisions.",
        tech: { id: "tableau", name: "Tableau" },
        whatIsIt:
          "Data analysts answer real business questions with data: writing SQL, exploring trends, and building dashboards that help people decide. It's the most accessible entry point into the data field.",
        outcome: {
          role: "Data Analyst",
          summary:
            "You query data, find the story in it, and present it clearly - dashboards and analyses that change what a business does next.",
          whyThisFits:
            "You like finding answers and communicating them. Analytics is the fastest way into data work and pairs SQL with clear storytelling.",
          coreTech: [
            { id: "sql", name: "SQL" },
            { id: "python", name: "Python" },
            { id: "tableau", name: "Tableau" },
            { id: "powerbi", name: "Power BI" },
          ],
          roadmap: [
            { title: "SQL", detail: "The core skill - SELECT, JOIN, GROUP BY, and window functions. The Day 4 material, extended." },
            { title: "Spreadsheets & stats", detail: "Excel/Sheets fluency and enough statistics to avoid fooling yourself." },
            { title: "Visualization", detail: "Tableau or Power BI to turn queries into dashboards people trust." },
            { title: "Python for analysis", detail: "pandas to go beyond what SQL and BI tools can do alone." },
            { title: "Communication", detail: "The real skill: telling a clear, honest story with the numbers." },
          ],
          resources: [
            { label: "Google Data Analytics Certificate", kind: "Course", url: "https://www.coursera.org/professional-certificates/google-data-analytics", free: false },
            { label: "Mode SQL Tutorial", kind: "Practice", url: "https://mode.com/sql-tutorial/", free: true },
            { label: "Kaggle - Data Visualization", kind: "Course", url: "https://www.kaggle.com/learn/data-visualization", free: true },
            { label: "SQLBolt", kind: "Practice", url: "https://sqlbolt.com/", free: true },
          ],
          demandNote: "The most common first job in the data field.",
        },
      },
      {
        id: "engineer",
        label: "Build the pipelines",
        tagline: "Move and shape data at scale so others can use it.",
        tech: { id: "spark", name: "Spark" },
        whatIsIt:
          "Data engineers build the plumbing: pipelines that pull data from many sources, clean it, and load it where analysts and models can reach it - reliably, at scale. More software engineering than analysis.",
        outcome: {
          role: "Data Engineer",
          summary:
            "You build and run the pipelines and warehouses that everyone else's data work depends on - reliability and scale are your craft.",
          whyThisFits:
            "You like building systems more than making charts. Data engineering is software engineering aimed at data, and it's in heavy demand.",
          coreTech: [
            { id: "python", name: "Python" },
            { id: "sql", name: "SQL" },
            { id: "spark", name: "Spark" },
            { id: "airflow", name: "Airflow" },
            { id: "snowflake", name: "Snowflake" },
          ],
          roadmap: [
            { title: "SQL + Python", detail: "Strong SQL and Python are non-negotiable foundations." },
            { title: "Data warehouses", detail: "How Snowflake/BigQuery store and serve analytical data." },
            { title: "Pipelines (ETL/ELT)", detail: "Move and transform data reliably; orchestrate with Airflow." },
            { title: "Big data tools", detail: "Spark for processing data too large for one machine." },
            { title: "Cloud & infra", detail: "The pipelines run in the cloud - Docker and a cloud provider help." },
          ],
          resources: [
            { label: "Data Engineering Zoomcamp", kind: "Course", url: "https://github.com/DataTalksClub/data-engineering-zoomcamp", free: true },
            { label: "dbt fundamentals", kind: "Course", url: "https://learn.getdbt.com/", free: true },
            { label: "SQL for Data Engineers (Mode)", kind: "Practice", url: "https://mode.com/sql-tutorial/", free: true },
          ],
        },
      },
      {
        id: "scientist",
        label: "Predict & model",
        tagline: "Build models that forecast and find patterns.",
        tech: { id: "scikitlearn", name: "scikit-learn" },
        whatIsIt:
          "Data scientists go beyond describing the past to predicting the future: building statistical and machine-learning models to forecast, classify, and uncover patterns. Heavier on math and Python.",
        outcome: {
          role: "Data Scientist",
          summary:
            "You build models that predict and explain - combining statistics, machine learning, and Python to answer questions that plain analysis can't.",
          whyThisFits:
            "You want to go past 'what happened' to 'what will happen'. Data science rewards curiosity, math, and rigorous experimentation.",
          coreTech: [
            { id: "python", name: "Python" },
            { id: "pandas", name: "pandas" },
            { id: "scikitlearn", name: "scikit-learn" },
            { id: "pytorch", name: "PyTorch" },
          ],
          roadmap: [
            { title: "Stats & math", detail: "Probability, statistics, and linear algebra - the foundation under every model." },
            { title: "Python & pandas", detail: "Wrangle and explore data fluently." },
            { title: "Machine learning", detail: "scikit-learn: the classic algorithms and how to evaluate them honestly." },
            { title: "Deep learning", detail: "PyTorch/TensorFlow for problems that need neural networks." },
            { title: "Communication", detail: "A model no one trusts is useless - explaining results is half the job." },
          ],
          resources: [
            { label: "Kaggle Learn", kind: "Practice", url: "https://www.kaggle.com/learn", free: true },
            { label: "Andrew Ng - Machine Learning", kind: "Course", url: "https://www.coursera.org/specializations/machine-learning-introduction", free: false },
            { label: "StatQuest (YouTube)", kind: "Video", url: "https://www.youtube.com/c/joshstarmer", free: true },
            { label: "fast.ai", kind: "Course", url: "https://course.fast.ai/", free: true },
          ],
        },
      },
    ],
  },
};

const cloudDevops: DomainCareerMap = {
  domainId: "cloud-devops",
  intro:
    "Cloud and operations work is about how software actually runs and stays up. It branches by focus: automating delivery, mastering a cloud platform, or the reliability discipline that keeps giants online.",
  techMap: [
    { id: "linux", name: "Linux" },
    { id: "bash", name: "Bash" },
    { id: "docker", name: "Docker" },
    { id: "kubernetes", name: "Kubernetes" },
    { id: "terraform", name: "Terraform" },
    { id: "ansible", name: "Ansible" },
    { id: "githubactions", name: "GitHub Actions" },
    { id: "jenkins", name: "Jenkins" },
    { id: "aws", name: "AWS" },
    { id: "azure", name: "Azure" },
    { id: "googlecloud", name: "GCP" },
    { id: "prometheus", name: "Prometheus" },
    { id: "grafana", name: "Grafana" },
  ],
  root: {
    question: "Which side of running software draws you?",
    hint: "All of it stands on Linux and containers - then it specializes.",
    choices: [
      {
        id: "devops",
        label: "Automate delivery",
        tagline: "CI/CD, containers, infrastructure as code.",
        tech: { id: "docker", name: "Docker" },
        whatIsIt:
          "DevOps engineers automate the path from code to production: build pipelines, containerize apps, and define infrastructure as code so deployments are fast, repeatable, and safe. The connective tissue of modern software.",
        outcome: {
          role: "DevOps Engineer",
          summary:
            "You automate how software is built, tested, and shipped - pipelines, containers, and infrastructure-as-code that let teams deploy safely, many times a day.",
          whyThisFits:
            "You like making things run smoothly and hate doing anything twice. DevOps turns manual, error-prone steps into reliable automation.",
          coreTech: [
            { id: "linux", name: "Linux" },
            { id: "docker", name: "Docker" },
            { id: "kubernetes", name: "Kubernetes" },
            { id: "terraform", name: "Terraform" },
            { id: "githubactions", name: "GitHub Actions" },
          ],
          roadmap: [
            { title: "Linux & the shell", detail: "The Day 5 material, deeper - you live in the terminal here." },
            { title: "Containers", detail: "Docker to package apps, then Kubernetes to run them at scale." },
            { title: "CI/CD", detail: "GitHub Actions or Jenkins to automate build, test, and deploy." },
            { title: "Infrastructure as code", detail: "Terraform to define cloud infrastructure in version-controlled files." },
            { title: "A cloud provider", detail: "Go deep on one of AWS, Azure, or GCP." },
          ],
          resources: [
            { label: "roadmap.sh - DevOps", kind: "Docs", url: "https://roadmap.sh/devops", free: true },
            { label: "Docker - Getting Started", kind: "Docs", url: "https://docs.docker.com/get-started/", free: true },
            { label: "Kubernetes tutorials", kind: "Docs", url: "https://kubernetes.io/docs/tutorials/", free: true },
            { label: "KodeKloud labs", kind: "Practice", url: "https://kodekloud.com/", free: false },
          ],
          demandNote: "One of the most in-demand and well-paid operations tracks.",
        },
      },
      {
        id: "cloud",
        label: "Master a cloud",
        tagline: "Architect systems on AWS, Azure, or GCP.",
        tech: { id: "aws", name: "AWS" },
        whatIsIt:
          "Cloud engineers and architects design how systems live on a cloud platform - choosing the right services, wiring them securely, and keeping costs sane. Deep platform knowledge, backed by certifications.",
        outcome: {
          role: "Cloud Engineer / Architect",
          summary:
            "You design and run systems on a major cloud - picking services, securing them, and balancing performance against cost.",
          whyThisFits:
            "You like the big picture of how whole systems fit together. Cloud expertise is portable, certifiable, and universally needed.",
          coreTech: [
            { id: "aws", name: "AWS" },
            { id: "terraform", name: "Terraform" },
            { id: "docker", name: "Docker" },
            { id: "linux", name: "Linux" },
          ],
          roadmap: [
            { title: "Cloud fundamentals", detail: "Compute, storage, networking, and identity on your chosen platform." },
            { title: "One provider, deeply", detail: "AWS is the market leader; Azure and GCP are close. Pick one and certify." },
            { title: "Networking & security", detail: "VPCs, security groups, IAM - how to keep cloud systems safe." },
            { title: "Infrastructure as code", detail: "Terraform so your architecture is repeatable, not clicked-together." },
            { title: "Cost & reliability", detail: "Architecting for uptime without burning money." },
          ],
          resources: [
            { label: "AWS Cloud Practitioner Essentials", kind: "Course", url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/", free: true },
            { label: "AWS Skill Builder", kind: "Practice", url: "https://skillbuilder.aws/", free: true },
            { label: "Microsoft Learn - Azure", kind: "Course", url: "https://learn.microsoft.com/en-us/training/azure/", free: true },
            { label: "Google Cloud Skills Boost", kind: "Practice", url: "https://www.cloudskillsboost.google/", free: true },
          ],
        },
      },
      {
        id: "sre",
        label: "Keep it reliable",
        tagline: "Reliability, monitoring, and incident response at scale.",
        tech: { id: "prometheus", name: "Prometheus" },
        whatIsIt:
          "Site Reliability Engineers (SRE) treat reliability as an engineering problem: they measure it, monitor everything, respond to incidents, and build systems that heal themselves. Born at Google, now everywhere.",
        outcome: {
          role: "Site Reliability Engineer",
          summary:
            "You keep large systems online - instrumenting them, catching problems early, leading incident response, and engineering away whole classes of failure.",
          whyThisFits:
            "You're calm under pressure and like rigorous, measured thinking. SRE blends software engineering with operations at the highest level.",
          coreTech: [
            { id: "linux", name: "Linux" },
            { id: "kubernetes", name: "Kubernetes" },
            { id: "prometheus", name: "Prometheus" },
            { id: "grafana", name: "Grafana" },
            { id: "python", name: "Python" },
          ],
          roadmap: [
            { title: "Strong systems + DevOps base", detail: "Linux, containers, and automation come first." },
            { title: "Observability", detail: "Metrics, logs, and traces - Prometheus and Grafana to see inside systems." },
            { title: "Reliability practice", detail: "SLOs, error budgets, and designing for graceful failure." },
            { title: "Incident response", detail: "Detect, respond, and run blameless postmortems." },
            { title: "Coding for automation", detail: "Python or Go to build the tools that keep systems healthy." },
          ],
          resources: [
            { label: "Google SRE Book (free online)", kind: "Book", url: "https://sre.google/books/", free: true },
            { label: "Prometheus docs", kind: "Docs", url: "https://prometheus.io/docs/introduction/overview/", free: true },
            { label: "roadmap.sh - DevOps", kind: "Docs", url: "https://roadmap.sh/devops", free: true },
          ],
        },
      },
    ],
  },
};

const cybersecurity: DomainCareerMap = {
  domainId: "cybersecurity",
  intro:
    "Security work divides by which side of the fence you're on: breaking in to find weaknesses (offense), defending and responding (defense), or the specialized craft of digital investigation.",
  techMap: [
    { id: "linux", name: "Linux" },
    { id: "kalilinux", name: "Kali Linux" },
    { id: "burpsuite", name: "Burp Suite" },
    { id: "metasploit", name: "Metasploit" },
    { id: "nmap", name: "Nmap" },
    { id: "wireshark", name: "Wireshark" },
    { id: "splunk", name: "Splunk" },
    { id: "owasp", name: "OWASP" },
    { id: "tryhackme", name: "TryHackMe" },
    { id: "hackthebox", name: "Hack The Box" },
    { id: "python", name: "Python" },
  ],
  root: {
    question: "Which side of security is yours?",
    hint: "All of it stands on networking and Linux fundamentals.",
    choices: [
      {
        id: "offense",
        label: "Break in (ethically)",
        tagline: "Penetration testing and red-teaming to find holes first.",
        tech: { id: "kalilinux", name: "Kali Linux" },
        whatIsIt:
          "Offensive security - penetration testers and red teamers - legally attack systems to find weaknesses before criminals do. Hands-on, technical, and endlessly curious work, always under authorization.",
        outcome: {
          role: "Penetration Tester / Red Teamer",
          summary:
            "You legally attack systems - web apps, networks, whole companies - to find and report the holes before real attackers do.",
          whyThisFits:
            "You have the investigator's curiosity and like taking things apart. Offensive security turns that instinct into a career, ethically and under authorization.",
          coreTech: [
            { id: "kalilinux", name: "Kali Linux" },
            { id: "burpsuite", name: "Burp Suite" },
            { id: "metasploit", name: "Metasploit" },
            { id: "nmap", name: "Nmap" },
            { id: "python", name: "Python" },
          ],
          roadmap: [
            { title: "Networking & Linux", detail: "How networks and systems actually work - you can't break what you don't understand." },
            { title: "Web security", detail: "The OWASP Top 10: injection, broken auth, and friends. Burp Suite to test." },
            { title: "Hands-on hacking", detail: "TryHackMe and Hack The Box - practice on legal, deliberately vulnerable targets." },
            { title: "Tools & scripting", detail: "Nmap, Metasploit, and Python to automate your own tools." },
            { title: "Certify", detail: "OSCP is the respected hands-on standard for pentesters." },
          ],
          resources: [
            { label: "TryHackMe", kind: "Practice", url: "https://tryhackme.com/", free: true },
            { label: "Hack The Box Academy", kind: "Practice", url: "https://academy.hackthebox.com/", free: true },
            { label: "PortSwigger Web Security Academy", kind: "Course", url: "https://portswigger.net/web-security", free: true },
            { label: "OWASP Top 10", kind: "Docs", url: "https://owasp.org/www-project-top-ten/", free: true },
          ],
        },
      },
      {
        id: "defense",
        label: "Defend & respond",
        tagline: "Monitor, detect, and stop attacks in real time.",
        tech: { id: "splunk", name: "Splunk" },
        whatIsIt:
          "Defensive security - the blue team - watches for attacks, investigates alerts, and responds when something's wrong. Analysts in a Security Operations Center (SOC) are the front line of most organizations.",
        outcome: {
          role: "Security Analyst (Blue Team / SOC)",
          summary:
            "You watch for threats, investigate suspicious activity, and respond to incidents - the front-line defense most security careers start with.",
          whyThisFits:
            "You're pattern-focused and level-headed - exactly what reading logs and catching intrusions rewards. It's the most common entry point into security.",
          coreTech: [
            { id: "splunk", name: "Splunk" },
            { id: "wireshark", name: "Wireshark" },
            { id: "linux", name: "Linux" },
            { id: "python", name: "Python" },
          ],
          roadmap: [
            { title: "Networking & OS basics", detail: "How traffic flows and how systems log - the raw material of defense." },
            { title: "Security fundamentals", detail: "Threats, the CIA triad, and common attack patterns (CompTIA Security+)." },
            { title: "SIEM & log analysis", detail: "Splunk to hunt through logs; Wireshark to read network traffic." },
            { title: "Incident response", detail: "Triage alerts, contain threats, and document what happened." },
            { title: "Scripting", detail: "Python to automate detection and response tasks." },
          ],
          resources: [
            { label: "TryHackMe - SOC Level 1", kind: "Course", url: "https://tryhackme.com/", free: true },
            { label: "CompTIA Security+ (Professor Messer)", kind: "Video", url: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/", free: true },
            { label: "Blue Team Labs Online", kind: "Practice", url: "https://blueteamlabs.online/", free: true },
            { label: "Splunk - Free training", kind: "Course", url: "https://www.splunk.com/en_us/training/free-courses/overview.html", free: true },
          ],
          demandNote: "SOC analyst is the most common first job in security.",
        },
      },
      {
        id: "forensics",
        label: "Investigate",
        tagline: "Digital forensics - reconstruct what attackers did.",
        tech: { id: "wireshark", name: "Wireshark" },
        whatIsIt:
          "Digital forensics and incident response (DFIR) is detective work: after a breach, reconstruct exactly what happened from the evidence left behind - disks, memory, logs, and network captures. Meticulous and deep.",
        outcome: {
          role: "Digital Forensics / DFIR Analyst",
          summary:
            "You reconstruct incidents from the digital evidence they leave - piecing together how an attacker got in, what they touched, and how to prove it.",
          whyThisFits:
            "You have patience and an eye for detail, and you like following a trail to its end. Forensics is the most investigative corner of security.",
          coreTech: [
            { id: "wireshark", name: "Wireshark" },
            { id: "linux", name: "Linux" },
            { id: "python", name: "Python" },
          ],
          roadmap: [
            { title: "Systems deeply", detail: "File systems, memory, and how operating systems record activity." },
            { title: "Evidence handling", detail: "Acquiring and preserving evidence without altering it - chain of custody." },
            { title: "Analysis tools", detail: "Disk and memory forensics; Wireshark for network evidence." },
            { title: "Malware basics", detail: "Enough reverse-engineering to understand what a sample does." },
            { title: "Reporting", detail: "Clear, defensible write-ups - findings often end up in court." },
          ],
          resources: [
            { label: "DFIR training (13Cubed, YouTube)", kind: "Video", url: "https://www.youtube.com/c/13cubed", free: true },
            { label: "TryHackMe - Digital Forensics", kind: "Practice", url: "https://tryhackme.com/", free: true },
            { label: "Wireshark - Getting Started", kind: "Docs", url: "https://www.wireshark.org/docs/", free: true },
          ],
        },
      },
    ],
  },
};

export const CAREER_MAPS: DomainCareerMap[] = [
  softwareDevelopment,
  problemSolving,
  uiuxDesign,
  dataAnalytics,
  cloudDevops,
  cybersecurity,
];

export function getCareerMap(domainId: string): DomainCareerMap | undefined {
  return CAREER_MAPS.find((m) => m.domainId === domainId);
}
