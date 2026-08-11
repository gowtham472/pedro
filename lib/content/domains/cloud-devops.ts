import type { DomainDefinition, LessonDefinition, TaskDefinition } from "@/types/content";

export const cloudDevopsDomain: DomainDefinition = {
  id: "cloud-devops",
  name: "Cloud & DevOps",
  tagline: "Linux, systems, automation, troubleshooting",
  description:
    "A service is down. Investigate a simulated Linux environment, find the root cause, and restore it. No real infrastructure involved.",
  day: 5,
  accentToken: "mint",
  primarySkills: ["Linux fundamentals", "Troubleshooting", "Systems thinking"],
  active: true,
  order: 5,
};

export const cloudDevopsLesson: LessonDefinition = {
  id: "lesson-cloud-devops-day5",
  domainId: "cloud-devops",
  day: 5,
  title: "Cloud & DevOps",
  summary:
    "Linux basics, files & permissions, processes, networking fundamentals, Docker, and CI/CD - enough vocabulary to investigate a broken service.",
  estimatedMinutes: 35,
  order: 1,
  sections: [
    {
      heading: "Linux basics",
      visualId: "linux",
      body: "Most servers run Linux and are operated through a terminal, not a mouse. A handful of commands cover most investigation work: `ls` lists files, `cd` changes directory, `cat` prints a file's contents, `pwd` shows where you are.",
    },
    {
      heading: "Processes and services",
      visualId: "processes",
      body: "A service is a program the operating system manages for you (start, stop, restart, keep running). `systemctl status <name>` tells you whether a service is active or failed. `ps` lists every process currently running, each with a process ID (PID).",
    },
    {
      heading: "Networking fundamentals",
      visualId: "networking",
      body: "A service that accepts connections \"listens\" on a port. Two programs can't listen on the exact same port at once - if one is already bound to it, the next one to try will fail to start. `netstat` shows which process holds which port.",
    },
    {
      heading: "Docker & cloud concepts",
      visualId: "docker",
      body: "Containers package an application with everything it needs to run, so it behaves the same everywhere. Cloud platforms provide the servers, storage, and networking that containers run on, on demand rather than owning physical hardware.",
    },
    {
      heading: "CI/CD concepts",
      visualId: "cicd",
      body: "Continuous Integration/Continuous Deployment automates testing and releasing code, so changes reach production through a repeatable pipeline instead of a manual, error-prone process.",
    },
    {
      heading: "Troubleshooting method",
      visualId: "troubleshoot",
      body: "A reliable order: check the service's status, read its logs, form a hypothesis about the cause, verify it (don't just guess-and-restart), then apply the smallest fix that addresses the root cause.",
    },
  ],
};

export const cloudDevopsTasks: TaskDefinition[] = [
  {
    id: "devops-00-first-restart",
    domainId: "cloud-devops",
    lessonId: "lesson-cloud-devops-day5",
    day: 5,
    title: "Bring a service back up",
    description: "statuspage went down after a traffic spike. Find out what happened and bring it back.",
    instructions:
      "The team's public status page (`statuspage`) stopped responding a few minutes ago. Use the terminal to check what state the service is in, read its log to see what happened, and bring it back up.\n\nType `help` in the terminal at any time to see the available commands.",
    difficulty: "beginner",
    estimatedMinutes: 10,
    learningObjectives: ["systemctl basics", "Reading service logs", "Restarting a service"],
    prerequisiteConcepts: ["Linux basics"],
    passingScore: 70,
    order: 1,
    basePoints: 50,
    hints: [
      { order: 1, text: "`systemctl status statuspage` shows whether the service is running and why it stopped." },
      { order: 2, text: "The log at `/var/log/statuspage/app.log` tells you what happened - read it with `cat`." },
      { order: 3, text: "The crash was a one-off memory spike. `systemctl restart statuspage` brings it back." },
    ],
    config: {
      type: "terminal",
      motd:
        "Mission: the public status page is down. Find out what happened and bring it back online.\nType `help` to see available commands.",
      initialCwd: "/home/student",
      directories: ["/", "/home", "/home/student", "/var", "/var/log", "/var/log/statuspage"],
      files: [
        {
          path: "/home/student/README.txt",
          content:
            "The statuspage service serves status.example.com.\nIt stopped responding a few minutes ago. Start by checking its status.",
        },
        {
          path: "/var/log/statuspage/app.log",
          content:
            "2026-08-09T21:02:11Z INFO  statuspage listening on port 8080 (pid 3320)\n" +
            "2026-08-09T21:44:53Z WARN  request queue climbing: 1,204 pending (traffic spike)\n" +
            "2026-08-09T21:45:10Z ERROR out of memory: allocation failed\n" +
            "2026-08-09T21:45:10Z ERROR process exiting - safe to restart once traffic normalises",
        },
      ],
      services: [
        {
          name: "statuspage",
          initialStatus: "failed",
          failureMessage: "statuspage.service: main process exited (out of memory). Not restarted automatically.",
        },
        { name: "nginx", initialStatus: "active", failureMessage: "" },
      ],
      processes: [
        { pid: 1, command: "/sbin/init" },
        { pid: 812, command: "nginx: master process /usr/sbin/nginx", port: 80 },
      ],
      netstatEntries: [{ port: 80, pid: 812, program: "nginx" }],
      goalServiceName: "statuspage",
      findings: [
        { id: "checked-status", description: "Checked statuspage's service status", requiredCommandPattern: "^systemctl\\s+status\\s+statuspage" },
        { id: "viewed-logs", description: "Read statuspage's application log", requiredCommandPattern: "^(cat\\s+/var/log/statuspage/app\\.log|journalctl\\s+-u\\s+statuspage)" },
      ],
      fixSteps: [
        {
          id: "restart-statuspage",
          description: "Restart statuspage",
          commandPattern: "^systemctl\\s+(restart|start)\\s+statuspage$",
          effect: "restart-service",
          targetService: "statuspage",
        },
      ],
    },
  },
  {
    id: "devops-01-port-conflict",
    domainId: "cloud-devops",
    lessonId: "lesson-cloud-devops-day5",
    day: 5,
    title: "Find the broken service",
    description: "orderapi is down and checkout is failing. Investigate the sandbox and restore it.",
    instructions:
      "A customer reported that checkout is failing. The `orderapi` service is down. Use the terminal to investigate: check its status, read its logs, and figure out why it won't start - then fix it.\n\nType `help` in the terminal at any time to see the available commands.",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    learningObjectives: ["systemctl", "Reading logs", "Diagnosing port conflicts", "ps / netstat"],
    prerequisiteConcepts: ["Linux basics", "processes", "networking fundamentals"],
    passingScore: 70,
    order: 2,
    basePoints: 75,
    hints: [
      { order: 1, text: "Start with `systemctl status orderapi`, then read its log with `cat /var/log/orderapi/app.log`." },
      { order: 2, text: "The log mentions the port orderapi tries to use. Check what's already listening on it with `netstat`." },
      { order: 3, text: "Once you find the process squatting on the port, terminate it with `kill <pid>`, then restart orderapi." },
    ],
    config: {
      type: "terminal",
      motd:
        "Mission: orderapi is failing and customers can't check out. Investigate the sandbox and restore the service.\nType `help` to see available commands.",
      initialCwd: "/home/student",
      directories: ["/", "/home", "/home/student", "/var", "/var/log", "/var/log/orderapi", "/etc", "/etc/orderapi"],
      files: [
        {
          path: "/home/student/README.txt",
          content:
            "Welcome. A customer reported checkout errors.\nThe orderapi service handles checkout. Start by checking its status.",
        },
        {
          path: "/var/log/orderapi/app.log",
          content:
            "2026-08-09T22:14:01Z INFO  orderapi starting up (pid 4421)\n" +
            "2026-08-09T22:14:01Z ERROR listen EADDRINUSE: address already in use :::4000\n" +
            "2026-08-09T22:14:01Z ERROR orderapi failed to bind to port 4000, exiting\n" +
            "2026-08-09T22:09:47Z WARN  previous deploy did not shut down cleanly (worker process orphaned)",
        },
        {
          path: "/etc/orderapi/config.yml",
          content: "service: orderapi\nport: 4000\nenv: production\nlog_level: info\n",
        },
      ],
      services: [
        {
          name: "orderapi",
          initialStatus: "failed",
          failureMessage:
            "Job for orderapi.service failed because the control process exited with error code.\nlisten EADDRINUSE: address already in use :::4000",
        },
        { name: "nginx", initialStatus: "active", failureMessage: "" },
        { name: "postgres", initialStatus: "active", failureMessage: "" },
      ],
      processes: [
        { pid: 1, command: "/sbin/init" },
        { pid: 812, command: "nginx: master process /usr/sbin/nginx", port: 80 },
        { pid: 900, command: "postgres -D /var/lib/postgresql/data", port: 5432 },
        { pid: 8842, command: "node ghost-worker.js", port: 4000 },
      ],
      netstatEntries: [
        { port: 80, pid: 812, program: "nginx" },
        { port: 5432, pid: 900, program: "postgres" },
        { port: 4000, pid: 8842, program: "ghost-worker.js" },
      ],
      goalServiceName: "orderapi",
      findings: [
        { id: "checked-status", description: "Checked orderapi's service status", requiredCommandPattern: "^systemctl\\s+status\\s+orderapi" },
        { id: "viewed-logs", description: "Read orderapi's application log", requiredCommandPattern: "^(cat\\s+/var/log/orderapi/app\\.log|journalctl\\s+-u\\s+orderapi)" },
        { id: "checked-network", description: "Inspected listening ports", requiredCommandPattern: "^netstat" },
        { id: "checked-processes", description: "Listed running processes", requiredCommandPattern: "^ps" },
      ],
      fixSteps: [
        {
          id: "kill-ghost",
          description: "Terminate the orphaned process holding port 4000",
          commandPattern: "^kill\\s+(-9\\s+)?8842$",
          effect: "kill-process",
          targetPid: 8842,
        },
        {
          id: "restart-orderapi",
          description: "Restart orderapi",
          commandPattern: "^systemctl\\s+(restart|start)\\s+orderapi$",
          requiresFixStepIds: ["kill-ghost"],
          effect: "restart-service",
          targetService: "orderapi",
        },
      ],
    },
  },
  {
    id: "devops-02-disk-full",
    domainId: "cloud-devops",
    lessonId: "lesson-cloud-devops-day5",
    day: 5,
    title: "Space ran out",
    description: "billingapi crashed and won't restart. Find out why and restore it.",
    instructions:
      "The `billingapi` service has crashed and refuses to restart. Investigate what's wrong - this time the cause isn't in the process table.",
    difficulty: "challenge",
    estimatedMinutes: 15,
    learningObjectives: ["Disk usage diagnostics", "du / df", "Log rotation basics"],
    prerequisiteConcepts: ["Linux basics", "troubleshooting method"],
    passingScore: 70,
    order: 3,
    basePoints: 100,
    hints: [
      { order: 1, text: "Not every outage is a process problem. Check disk space with `df`." },
      { order: 2, text: "`du` shows what's actually using the space - look inside `/var/log/app`." },
      { order: 3, text: "`truncate <path>` empties a file. Clear the oversized log, then restart billingapi." },
    ],
    config: {
      type: "terminal",
      motd:
        "Mission: billingapi crashed and won't come back up. Investigate the sandbox and restore the service.\nType `help` to see available commands.",
      initialCwd: "/home/student",
      directories: ["/", "/home", "/home/student", "/var", "/var/log", "/var/log/app"],
      files: [
        {
          path: "/home/student/README.txt",
          content: "Customers report billing is down. Investigate billingapi.",
        },
        {
          path: "/var/log/app/error.log",
          content:
            "2026-08-09T03:11:02Z FATAL could not write to disk: No space left on device\n" +
            "2026-08-09T03:11:03Z FATAL could not write to disk: No space left on device\n" +
            "2026-08-09T03:11:04Z FATAL billingapi exiting after repeated write failures",
        },
        {
          path: "/var/log/app/access.log",
          content: "(2.3G - file too large to display. Use `du` to inspect its size.)",
        },
      ],
      services: [
        {
          name: "billingapi",
          initialStatus: "failed",
          failureMessage: "Job for billingapi.service failed: could not write to disk (no space left on device).",
        },
      ],
      processes: [{ pid: 1, command: "/sbin/init" }],
      netstatEntries: [],
      diskUsage: [
        { mount: "/", usedPercent: 62 },
        { mount: "/var", usedPercent: 100 },
      ],
      duEntries: [
        { path: "/var/log/app/access.log", sizeLabel: "2.3G" },
        { path: "/var/log/app/error.log", sizeLabel: "4.1M" },
      ],
      goalServiceName: "billingapi",
      findings: [
        { id: "checked-disk", description: "Checked disk usage", requiredCommandPattern: "^df" },
        { id: "found-large-file", description: "Found the file consuming disk space", requiredCommandPattern: "^du" },
        { id: "checked-logs", description: "Read billingapi's error log", requiredCommandPattern: "^cat\\s+/var/log/app/error\\.log" },
      ],
      fixSteps: [
        {
          id: "truncate-log",
          description: "Clear the oversized access log",
          commandPattern: "^truncate\\s+/var/log/app/access\\.log$",
          effect: "truncate-file",
          targetFile: "/var/log/app/access.log",
        },
        {
          id: "restart-billingapi",
          description: "Restart billingapi",
          commandPattern: "^systemctl\\s+(restart|start)\\s+billingapi$",
          requiresFixStepIds: ["truncate-log"],
          effect: "restart-service",
          targetService: "billingapi",
        },
      ],
    },
  },
];
