// Content types: the data-driven definitions for domains, lessons and tasks
// (PRD §27 Content Management). These live as typed data in lib/content and
// are seeded into Firestore by scripts/seed.ts so admins can edit them
// without a rebuild.

export type DomainId =
  | "software-development"
  | "problem-solving"
  | "ui-ux-design"
  | "data-analytics"
  | "cloud-devops"
  | "cybersecurity";

export const DOMAIN_IDS: DomainId[] = [
  "software-development",
  "problem-solving",
  "ui-ux-design",
  "data-analytics",
  "cloud-devops",
  "cybersecurity",
];

export type AccentToken = "mint" | "cream" | "cyan" | "lavender" | "white";

export interface DomainDefinition {
  id: DomainId;
  name: string;
  tagline: string;
  description: string;
  day: number;
  accentToken: AccentToken;
  primarySkills: string[];
  active: boolean;
  order: number;
}

export interface LessonSection {
  heading: string;
  body: string;
  /** Optional animated concept visual (see components/visuals/registry.tsx). */
  visualId?: string;
  /**
   * Optional multi-language code example rendered as a tabbed snippet.
   * Learners pick one language and every snippet on the page follows -
   * the same choice the task workspace's language tabs use.
   */
  codeExample?: LessonCodeExample;
}

export interface LessonCodeExample {
  /** Small caption above the snippet, e.g. "Declaring variables". */
  title?: string;
  code: Record<CodeLanguage, string>;
}

export interface LessonDefinition {
  id: string;
  domainId: DomainId;
  day: number;
  title: string;
  summary: string;
  sections: LessonSection[];
  estimatedMinutes: number;
  order: number;
}

export type Difficulty = "beginner" | "intermediate" | "challenge";

export interface Hint {
  order: number;
  text: string;
}

export interface CodeTestCase {
  id: string;
  args: unknown[];
  expected: unknown;
  hidden?: boolean;
  description?: string;
}

export type CodeLanguage = "javascript" | "python" | "java" | "c";

/**
 * A non-JavaScript language option for a code task. JavaScript runs in the
 * local in-process sandbox; these run through the external execution service
 * (see lib/server/sandbox/polyglotRunner.ts).
 *
 * - `starterCode` is what the learner sees and edits.
 * - `driver` (java/c only - Python's is generated from testCases) is the
 *   server-side main/test harness appended to the learner's code. It embeds
 *   the test-case inputs and prints one canonical `__PEDRO__<json>` line the
 *   grader compares against `testCases[].expected`. NOTE: if an admin edits
 *   testCases, the java/c drivers must be updated to match.
 */
export interface CodeLanguageVariant {
  starterCode: string;
  driver?: string;
}

export interface CodeTaskConfig {
  type: "code";
  language: "javascript";
  functionName: string;
  starterCode: string;
  testCases: CodeTestCase[];
  timeLimitMs?: number;
  /** Additional selectable languages beyond JavaScript. */
  variants?: Partial<Record<Exclude<CodeLanguage, "javascript">, CodeLanguageVariant>>;
}

export interface SqlRowMatchValidation {
  mode: "row-match";
  expectedRows: Record<string, unknown>[];
  orderMatters?: boolean;
}

export interface SqlScalarValidation {
  mode: "scalar";
  expectedValue: number;
  tolerance?: number;
}

export interface SqlOpenEndedValidation {
  mode: "open-ended";
  minResultRows?: number;
  findingPrompt: string;
  minFindingLength?: number;
}

export interface SqlTaskConfig {
  type: "sql";
  datasetId: "food-delivery";
  starterQuery: string;
  expectedQueryDescription: string;
  validate: SqlRowMatchValidation | SqlScalarValidation | SqlOpenEndedValidation;
  requiresChart?: boolean;
}

export interface DesignChecklistItem {
  id: string;
  label: string;
}

export interface DesignTaskConfig {
  type: "design";
  checklist: DesignChecklistItem[];
  canvasSize: { width: number; height: number };
  referenceDescription: string;
  minElements: number;
}

export interface VfsFileDef {
  path: string;
  content: string;
}

export interface ServiceDef {
  name: string;
  initialStatus: "active" | "failed";
  failureMessage: string;
}

export interface ProcessDef {
  pid: number;
  command: string;
  port?: number;
}

export interface NetstatEntryDef {
  port: number;
  pid: number;
  program: string;
}

export interface DiskUsageDef {
  mount: string;
  usedPercent: number;
}

export interface DuEntryDef {
  path: string;
  sizeLabel: string;
}

export interface TerminalFinding {
  id: string;
  description: string;
  requiredCommandPattern: string;
}

export type TerminalFixEffect =
  | "kill-process"
  | "restart-service"
  | "truncate-file"
  | "set-env";

export interface TerminalFixStep {
  id: string;
  description: string;
  commandPattern: string;
  requiresFixStepIds?: string[];
  effect: TerminalFixEffect;
  targetPid?: number;
  targetService?: string;
  targetFile?: string;
}

export interface TerminalTaskConfig {
  type: "terminal";
  motd: string;
  initialCwd: string;
  files: VfsFileDef[];
  directories: string[];
  services: ServiceDef[];
  processes: ProcessDef[];
  netstatEntries: NetstatEntryDef[];
  diskUsage?: DiskUsageDef[];
  duEntries?: DuEntryDef[];
  goalServiceName: string;
  findings: TerminalFinding[];
  fixSteps: TerminalFixStep[];
}

export type SecurityQuestionKind = "single-choice" | "multi-choice" | "short-text";

export interface SecurityQuestionOption {
  id: string;
  label: string;
}

export interface SecurityQuestion {
  id: string;
  prompt: string;
  kind: SecurityQuestionKind;
  options?: SecurityQuestionOption[];
  correctOptionIds?: string[];
  correctText?: string[];
  explanation: string;
}

export interface SecurityExhibitTable {
  kind: "table";
  title: string;
  columns: string[];
  rows: string[][];
}

export interface SecurityExhibitLog {
  kind: "log";
  title: string;
  lines: string[];
}

export interface SecurityExhibitCode {
  kind: "code";
  title: string;
  language: string;
  code: string;
}

export type SecurityExhibit =
  | SecurityExhibitTable
  | SecurityExhibitLog
  | SecurityExhibitCode;

/**
 * Despite the name, this is a general "read exhibits, answer questions"
 * engine - it also powers code-review and system-design activities in the
 * software development day.
 */
export interface SecurityTaskConfig {
  type: "security";
  /** Workspace eyebrow label; defaults to "Investigation" when omitted. */
  eyebrow?: string;
  briefing: string;
  exhibits: SecurityExhibit[];
  questions: SecurityQuestion[];
}

export type TaskConfig =
  | CodeTaskConfig
  | SqlTaskConfig
  | DesignTaskConfig
  | TerminalTaskConfig
  | SecurityTaskConfig;

export type TaskEvaluationType = TaskConfig["type"];

export interface TaskDefinition {
  id: string;
  domainId: DomainId;
  lessonId: string;
  day: number;
  title: string;
  description: string;
  instructions: string;
  // Internal only - drives scoring and the base-point ramp. Never shown to
  // learners: the difficulty ramp within a day is intentionally invisible so
  // each task reads as "the next step", not "a harder problem".
  difficulty: Difficulty;
  estimatedMinutes: number;
  learningObjectives: string[];
  prerequisiteConcepts: string[];
  hints: Hint[];
  passingScore: number;
  order: number;
  /** XP awarded on first pass, before bonuses. Defaults by difficulty when unset. */
  basePoints?: number;
  config: TaskConfig;
}

export const DEFAULT_BASE_POINTS: Record<Difficulty, number> = {
  beginner: 50,
  intermediate: 75,
  challenge: 100,
};
