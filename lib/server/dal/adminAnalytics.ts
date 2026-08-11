import "server-only";

import type { TaskAttempt } from "@/types/entities";
import { listAllTasks } from "./content";
import { listAllAttemptsForAnalytics } from "./attempts";
import { listJourneysForAdmin } from "./journey";
import { listUsersForAdmin } from "./users";
import { adminDb } from "@/lib/firebase/admin";

export interface DayFunnelEntry {
  day: number;
  locked: number;
  notStarted: number;
  inProgress: number;
  completed: number;
}

export interface TaskStat {
  taskId: string;
  title: string;
  domainId: string;
  day: number;
  studentsAttempted: number;
  studentsPassed: number;
  passRate: number;
  avgScore: number;
  avgAttempts: number;
}

export interface AdminAnalyticsSummary {
  totalUsers: number;
  onboardedUsers: number;
  journeysStarted: number;
  journeysCompleted: number;
  dayFunnel: DayFunnelEntry[];
  taskStats: TaskStat[];
  reflectionCompletionRate: number;
  reportsGenerated: number;
}

function latestAttemptPerUser(attempts: TaskAttempt[]): TaskAttempt[] {
  const byUser = new Map<string, TaskAttempt>();
  for (const attempt of attempts) {
    const existing = byUser.get(attempt.userId);
    if (!existing || attempt.attemptNumber > existing.attemptNumber) {
      byUser.set(attempt.userId, attempt);
    }
  }
  return [...byUser.values()];
}

export async function computeAdminAnalytics(): Promise<AdminAnalyticsSummary> {
  const [users, journeys, attempts, tasks, reflectionsCountSnap, reportsCountSnap] = await Promise.all([
    listUsersForAdmin(1000),
    listJourneysForAdmin(1000),
    listAllAttemptsForAnalytics(10000),
    listAllTasks(),
    adminDb.collection("reflections").count().get(),
    adminDb.collection("reports").count().get(),
  ]);

  const dayFunnel: DayFunnelEntry[] = [];
  for (let day = 1; day <= 7; day++) {
    const entry: DayFunnelEntry = { day, locked: 0, notStarted: 0, inProgress: 0, completed: 0 };
    for (const journey of journeys) {
      const status = journey.dayStatus[day] ?? "locked";
      if (status === "locked") entry.locked++;
      else if (status === "not_started") entry.notStarted++;
      else if (status === "in_progress") entry.inProgress++;
      else entry.completed++;
    }
    dayFunnel.push(entry);
  }

  const attemptsByTask = new Map<string, TaskAttempt[]>();
  for (const attempt of attempts) {
    const list = attemptsByTask.get(attempt.taskId) ?? [];
    list.push(attempt);
    attemptsByTask.set(attempt.taskId, list);
  }

  const taskStats: TaskStat[] = tasks.map((task) => {
    const taskAttempts = attemptsByTask.get(task.id) ?? [];
    const latest = latestAttemptPerUser(taskAttempts);
    const studentsAttempted = latest.length;
    const studentsPassed = latest.filter((a) => a.status === "passed").length;
    const avgScore = studentsAttempted
      ? Math.round(latest.reduce((sum, a) => sum + a.score, 0) / studentsAttempted)
      : 0;
    const avgAttempts = studentsAttempted ? Number((taskAttempts.length / studentsAttempted).toFixed(1)) : 0;
    return {
      taskId: task.id,
      title: task.title,
      domainId: task.domainId,
      day: task.day,
      studentsAttempted,
      studentsPassed,
      passRate: studentsAttempted ? Math.round((studentsPassed / studentsAttempted) * 100) : 0,
      avgScore,
      avgAttempts,
    };
  });

  const totalTerminalAttempts = attempts.filter((a) => a.status !== "in_progress").length;

  return {
    totalUsers: users.length,
    onboardedUsers: users.filter((u) => u.onboardingCompleted).length,
    journeysStarted: journeys.length,
    journeysCompleted: journeys.filter((j) => j.completedAt).length,
    dayFunnel,
    taskStats,
    reflectionCompletionRate: totalTerminalAttempts
      ? Math.round((reflectionsCountSnap.data().count / totalTerminalAttempts) * 100)
      : 0,
    reportsGenerated: reportsCountSnap.data().count,
  };
}
