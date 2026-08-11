import "server-only";

import type { TaskConfig, TaskDefinition } from "@/types/content";

// Strips answer-revealing fields from task content before it ever reaches
// the client. Grading always happens server-side (code sandbox, SQL runner,
// terminal engine, security scoring) so the client never needs these values
// - this function is what guarantees they're never sent, not just unused.
function sanitizeConfig(config: TaskConfig): TaskConfig {
  switch (config.type) {
    case "code":
      return {
        ...config,
        testCases: config.testCases.map((tc) =>
          tc.hidden ? { id: tc.id, args: [], expected: null, hidden: true, description: tc.description } : tc
        ),
        // Drivers embed every test case's inputs (including hidden ones) -
        // the client only needs each language's starter code.
        ...(config.variants
          ? {
              variants: Object.fromEntries(
                Object.entries(config.variants).map(([lang, v]) => [lang, { starterCode: v.starterCode }])
              ),
            }
          : {}),
      };
    case "sql":
      // The expected rows/scalar are the answer key and stay server-side -
      // grading happens entirely in the submit route. Genuinely open-ended
      // tasks keep their real `validate` (findingPrompt is instructions, not
      // an answer); row-match/scalar tasks get a blank placeholder. The
      // client tells the two apart by checking for a non-empty
      // findingPrompt, which only ever appears on real open-ended tasks.
      return {
        type: "sql",
        datasetId: config.datasetId,
        starterQuery: config.starterQuery,
        expectedQueryDescription: config.expectedQueryDescription,
        requiresChart: config.requiresChart,
        validate:
          config.validate.mode === "open-ended"
            ? config.validate
            : { mode: "open-ended" as const, minResultRows: 0, findingPrompt: "", minFindingLength: 0 },
      };
    case "design":
      return config; // checklist is guidance, not a secret
    case "terminal":
      // The whole scenario (files/services/processes/fixSteps) stays
      // server-side; the client only ever sees command output via the
      // terminal command endpoint, exactly like a real remote shell.
      return {
        type: "terminal",
        motd: config.motd,
        initialCwd: config.initialCwd,
        files: [],
        directories: [],
        services: [],
        processes: [],
        netstatEntries: [],
        goalServiceName: "",
        findings: [],
        fixSteps: [],
      };
    case "security":
      return {
        type: "security",
        briefing: config.briefing,
        exhibits: config.exhibits,
        questions: config.questions.map((q) => ({
          id: q.id,
          prompt: q.prompt,
          kind: q.kind,
          options: q.options,
          // Answer key fields (correctOptionIds/correctText/explanation) are
          // intentionally withheld until after submission.
          explanation: "",
        })),
      };
    default:
      return config;
  }
}

export function sanitizeTaskForClient(task: TaskDefinition): TaskDefinition {
  return { ...task, config: sanitizeConfig(task.config) };
}
