import type { TaskDefinition } from "@/types/content";
import { DEFAULT_BASE_POINTS } from "@/types/content";
import type { XpAward, XpBonus } from "@/types/entities";

// Reward design notes (PRD addendum, user request):
//
// - XP is awarded ONCE per task, on the first passing attempt. Re-running a
//   passed task earns nothing, so there is no grind incentive.
// - Every pass earns at least one bonus by construction: "clean solve"
//   (passed on the very first run) and "iterated" (passed after reworking)
//   are mutually exclusive but between them cover every path to success.
//   Variable, always-positive rewards are what make completion feel good.
// - The bonuses deliberately reward *process* signals - working without
//   hints, coming back after repeated failures, spending real time in the
//   workspace - so pasting a ready-made answer visibly earns less than
//   engaging with the task. Nothing is ever deducted; shortcuts simply
//   leave points on the table.
// - "deep-focus" uses a floor of realistic working time. It exists to make
//   a sub-minute copy-paste pass feel incomplete, not to punish fast
//   solvers of genuinely short warm-ups, hence the modest 60s floor.

export interface XpContext {
  attemptNumber: number;
  hintCount: number;
  timeSpentSeconds: number;
  /** Journey streak (consecutive active days) at submit time. */
  streak: number;
}

export function basePointsFor(task: TaskDefinition): number {
  return task.basePoints ?? DEFAULT_BASE_POINTS[task.difficulty];
}

export function computeXpAward(task: TaskDefinition, ctx: XpContext): XpAward {
  const base = basePointsFor(task);
  const bonuses: XpBonus[] = [];

  if (ctx.attemptNumber === 1) {
    bonuses.push({ id: "clean-solve", label: "Clean solve - passed on your first run", points: Math.round(base * 0.25) });
  } else {
    bonuses.push({ id: "iterated", label: "Worked through it - revised until it passed", points: Math.round(base * 0.2) });
  }

  if (ctx.hintCount === 0) {
    bonuses.push({ id: "no-hints", label: "Solved without hints", points: Math.round(base * 0.15) });
  }

  if (ctx.attemptNumber >= 3) {
    bonuses.push({ id: "comeback", label: "Persistence pays - kept going after setbacks", points: Math.round(base * 0.2) });
  }

  const focusFloorSeconds = Math.max(60, Math.round(task.estimatedMinutes * 60 * 0.25));
  if (ctx.timeSpentSeconds >= focusFloorSeconds) {
    bonuses.push({ id: "deep-focus", label: "Deep focus - took real time with the problem", points: Math.round(base * 0.15) });
  }

  if (ctx.streak >= 2) {
    bonuses.push({ id: "streak", label: `Day streak x${ctx.streak}`, points: 10 });
  }

  const total = base + bonuses.reduce((sum, b) => sum + b.points, 0);
  return { base, bonuses, total };
}
