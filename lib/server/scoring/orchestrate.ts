import "server-only";

import type { DomainId } from "@/types/entities";
import type { TaskDefinition } from "@/types/content";
import { listTasksForDomain } from "@/lib/server/dal/content";
import { listAttemptsForUserDomain } from "@/lib/server/dal/attempts";
import { listReflectionsForUserDomain } from "@/lib/server/dal/reflections";
import { getScoringWeights, upsertDomainScore, getReport, upsertReport } from "@/lib/server/dal/scoring";
import { getOrInitJourney } from "@/lib/server/dal/journey";
import { computeDomainScore } from "./engine";
import { buildCareerReport } from "./recommendation";

/** Day 7 capstone tasks only count toward the domain the user actually
 * chose - otherwise every domain would perpetually show one unattemptable
 * task and cap out below 100% completion. */
function scorableTasksForDomain(domainId: DomainId, allTasks: TaskDefinition[], day7Choice: DomainId | null): TaskDefinition[] {
  return allTasks.filter((t) => t.day !== 7 || day7Choice === domainId);
}

export async function recomputeDomainScore(uid: string, domainId: DomainId) {
  const [journey, allTasks, attempts, reflections, weights] = await Promise.all([
    getOrInitJourney(uid),
    listTasksForDomain(domainId),
    listAttemptsForUserDomain(uid, domainId),
    listReflectionsForUserDomain(uid, domainId),
    getScoringWeights(),
  ]);

  const tasks = scorableTasksForDomain(domainId, allTasks, journey.day7Choice);
  const score = computeDomainScore({
    userId: uid,
    domainId,
    tasks,
    attempts,
    reflections,
    chosenOnDay7: journey.day7Choice === domainId,
    weights,
  });

  await upsertDomainScore(score);
  return score;
}

export async function recomputeAllDomainScores(uid: string, domainIds: DomainId[]) {
  return Promise.all(domainIds.map((id) => recomputeDomainScore(uid, id)));
}

export async function generateCareerReport(uid: string, domainIds: DomainId[]) {
  const journey = await getOrInitJourney(uid);
  const scores = await recomputeAllDomainScores(uid, domainIds);
  const report = buildCareerReport(uid, scores, journey.day7Choice);
  await upsertReport(report);
  return report;
}

export async function getOrGenerateReport(uid: string, domainIds: DomainId[], forceRefresh: boolean) {
  if (!forceRefresh) {
    const existing = await getReport(uid);
    if (existing) return existing;
  }
  return generateCareerReport(uid, domainIds);
}
