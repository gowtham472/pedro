import type { DomainId } from "./content";

export type { DomainId } from "./content";

// Runtime entity types: what actually lives in Firestore, written and read
// exclusively by lib/server/dal/* through the Admin SDK.

export type UserRole = "user" | "admin";
export type UserStatus = "active" | "deleted";

export interface BaselineAnswers {
  triedBefore: string[];
  confidenceProgramming: number;
  confidenceLogic: number;
  confidenceDesign: number;
  confidenceData: number;
  curiosityCloud: number;
  interestSecurity: number;
  submittedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  createdAt: string;
  timezone: string;
  status: UserStatus;
  role: UserRole;
  onboardingCompleted: boolean;
  baseline?: BaselineAnswers;
  reminderOptIn: boolean;
  /** Total experience points across the journey. Awarded once per task, on first pass. */
  xp?: number;
}

export interface XpBonus {
  id: "clean-solve" | "iterated" | "no-hints" | "comeback" | "deep-focus" | "streak";
  label: string;
  points: number;
}

export interface XpAward {
  base: number;
  bonuses: XpBonus[];
  total: number;
}

export interface ConsentRecord {
  userId: string;
  analyticsConsent: boolean;
  interactionConsent: boolean;
  gazeConsent: boolean;
  researchConsent: boolean;
  updatedAt: string;
  history: { changedAt: string; snapshot: Omit<ConsentRecord, "history" | "userId"> }[];
}

export type DayStatus = "locked" | "not_started" | "in_progress" | "completed";

export interface JourneyState {
  userId: string;
  currentDay: number;
  dayStatus: Record<number, DayStatus>;
  day7Choice: DomainId | null;
  startedAt: string;
  completedAt?: string;
  streak: number;
  lastActivityAt: string;
}

export type EventType =
  | "session_started"
  | "lesson_started"
  | "lesson_completed"
  | "task_started"
  | "task_paused"
  | "task_resumed"
  | "task_submitted"
  | "task_completed"
  | "task_failed"
  | "hint_opened"
  | "hint_completed"
  | "retry_started"
  | "code_run"
  | "code_error"
  | "design_created"
  | "design_modified"
  | "query_executed"
  | "terminal_command"
  | "navigation"
  | "scroll"
  | "click"
  | "reflection_submitted"
  | "day_completed";

export interface TelemetryEvent {
  id: string;
  userId: string;
  sessionId: string;
  taskId?: string;
  eventType: EventType;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface InteractionSummary {
  id: string;
  userId: string;
  taskId: string;
  clickCount: number;
  activeInteractionSeconds: number;
  scrollDistance: number;
  retryCount: number;
  createdAt: string;
}

export type CalibrationQuality = "none" | "low" | "medium" | "high";

export interface GazeSummary {
  id: string;
  userId: string;
  taskId: string;
  calibrationQuality: CalibrationQuality;
  presenceRatio: number;
  regionDistribution: Record<string, number>;
  sampleCount: number;
  createdAt: string;
}

export type AttemptStatus = "in_progress" | "submitted" | "passed" | "failed";

export interface EvaluationBreakdownItem {
  label: string;
  passed: boolean;
  detail?: string;
}

export interface TestResult {
  id: string;
  passed: boolean;
  actual?: string;
  expected?: string;
  error?: string;
  hidden?: boolean;
}

export interface EvaluationDetail {
  summary: string;
  passed: boolean;
  breakdown: EvaluationBreakdownItem[];
  testResults?: TestResult[];
  /** Non-fatal compiler diagnostics (Java/C) - the code still ran and was graded. */
  warnings?: string;
}

export interface TaskAttempt {
  id: string;
  userId: string;
  taskId: string;
  domainId: DomainId;
  day: number;
  attemptNumber: number;
  status: AttemptStatus;
  startedAt: string;
  completedAt?: string;
  timeSpentSeconds: number;
  hintCount: number;
  score: number;
  submission?: unknown;
  evaluationDetail?: EvaluationDetail;
  /** Present only on the attempt that first passed the task. */
  xpAward?: XpAward;
}

export interface Reflection {
  id: string;
  userId: string;
  taskId: string;
  domainId: DomainId;
  day: number;
  enjoyment: number;
  difficulty: number;
  curiosity: number;
  persistence: number;
  futureInterest: number;
  comment?: string;
  submittedAt: string;
}

export type ConfidenceLevel = "low" | "medium" | "high";

export interface DomainEvidence {
  tasksCompleted: number;
  tasksTotal: number;
  averageAttempts: number;
  scoreProgression: number[];
  averageEnjoyment: number;
  averageCuriosity: number;
  averageFutureInterest: number;
  totalActiveSeconds: number;
  chosenOnDay7: boolean;
  highlights: string[];
}

export interface DomainScore {
  userId: string;
  domainId: DomainId;
  performanceScore: number;
  learningScore: number;
  engagementScore: number;
  preferenceScore: number;
  overallScore: number;
  confidence: ConfidenceLevel;
  evidence: DomainEvidence;
  computedAt: string;
}

export interface ScoringWeights {
  performance: number;
  learningVelocity: number;
  engagement: number;
  preference: number;
  updatedAt: string;
  updatedBy?: string;
}

export interface ReportTopDomain {
  domainId: DomainId;
  score: number;
  confidence: ConfidenceLevel;
}

export interface CareerReport {
  userId: string;
  generatedAt: string;
  topDomains: ReportTopDomain[];
  comparison: DomainScore[];
  strengthProfile: string[];
  growthAreas: string[];
  explorationPath: {
    primary: string;
    secondary: string;
    explore: string;
    improve: string;
  };
  narrative: {
    executiveSummary: string;
    workingStyle: string;
    domainNarratives: Record<string, string>;
  };
  qualityRating?: { accurate: number; helpful: number; ratedAt: string };
}

export interface AuditLogEntry {
  id: string;
  actorUid: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}
