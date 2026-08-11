import type { TaskDefinition } from "@/types/content";
import type { EvaluationDetail, TaskAttempt, XpAward } from "@/types/entities";

export interface SubmitResponse {
  evaluation: EvaluationDetail;
  score: number;
  status: string;
  attempt: TaskAttempt;
  dayCompleted: boolean;
  xpAward: XpAward | null;
}

export interface WorkspaceProps {
  task: TaskDefinition;
  onEvaluated: (result: SubmitResponse, isRetry: boolean) => void;
  previousResult: SubmitResponse | null;
}
