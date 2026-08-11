import { z } from "zod";
import { withAuth } from "@/lib/server/apiHandler";
import { ApiError, badRequest } from "@/lib/server/apiError";
import { requireTask } from "@/lib/server/dal/content";
import { getOrInitJourney, touchActivity } from "@/lib/server/dal/journey";
import { isDayUnlocked, checkAndAdvanceDay } from "@/lib/server/journeyEngine";
import { createAttempt, listAttemptsForUserTask, submitAttempt } from "@/lib/server/dal/attempts";
import { incrementUserXp } from "@/lib/server/dal/users";
import { computeXpAward } from "@/lib/server/scoring/xp";
import type { XpAward } from "@/types/entities";
import { insertEvents } from "@/lib/server/dal/telemetry";
import { checkRateLimit } from "@/lib/server/rateLimit";
import { runCodeTask } from "@/lib/server/sandbox/codeRunner";
import { runPolyglotTask } from "@/lib/server/sandbox/polyglotRunner";
import { evaluateSqlTask } from "@/lib/server/sandbox/sqlRunner";
import { evaluateDesignTask } from "@/lib/server/sandbox/designScoring";
import { evaluateTerminalTask, getInitialSession, type TerminalSessionState } from "@/lib/server/sandbox/terminalEngine";
import { evaluateSecurityTask } from "@/lib/server/sandbox/securityScoring";
import { scoreFromBreakdown } from "@/lib/server/sandbox/shared";
import { recomputeDomainScore } from "@/lib/server/scoring/orchestrate";
import type { EvaluationDetail } from "@/types/entities";

const designElementSchema = z.object({
  id: z.string().max(64),
  kind: z.enum([
    "heading",
    "subtext",
    "email-field",
    "password-field",
    "text-field",
    "button",
    "card",
    "image-placeholder",
    "progress-dots",
    "nav-bar",
    "icon",
    "divider",
  ]),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  label: z.string().max(200).optional(),
  background: z.string().max(20).optional(),
  textColor: z.string().max(20).optional(),
});

const submitBodySchema = z.object({
  code: z.string().max(20_000).optional(),
  language: z.enum(["javascript", "python", "java", "c"]).optional(),
  query: z.string().max(4000).optional(),
  findingText: z.string().max(2000).optional(),
  chartCreated: z.boolean().optional(),
  scene: z
    .object({
      elements: z.array(designElementSchema).max(60),
      canvasWidth: z.number(),
      canvasHeight: z.number(),
      iterationCount: z.number().max(10_000),
    })
    .optional(),
  answers: z
    .array(
      z.object({
        questionId: z.string().max(64),
        selectedOptionIds: z.array(z.string().max(64)).max(10).optional(),
        text: z.string().max(500).optional(),
      })
    )
    .max(20)
    .optional(),
});

export const POST = withAuth(async (req, auth, ctx) => {
  const { taskId } = await ctx.params;
  checkRateLimit(`task-submit:${auth.uid}`, 30, 60_000);

  const task = await requireTask(taskId);
  const journey = await getOrInitJourney(auth.uid);
  if (!isDayUnlocked(journey, task.day)) throw new ApiError(403, "This task isn't unlocked yet.");
  if (task.day === 7 && journey.day7Choice !== task.domainId) {
    throw new ApiError(403, "This isn't your chosen Day 7 domain.");
  }

  const body = submitBodySchema.parse(await req.json().catch(() => ({})));

  const priorAttempts = await listAttemptsForUserTask(auth.uid, taskId);
  const alreadyPassed = priorAttempts.some((a) => a.status === "passed");
  let attempt = priorAttempts.length ? priorAttempts[priorAttempts.length - 1] : null;
  if (!attempt || attempt.status !== "in_progress") {
    attempt = await createAttempt({ uid: auth.uid, taskId, domainId: task.domainId, day: task.day });
  }

  let evaluation: EvaluationDetail;
  let submission: unknown;

  switch (task.config.type) {
    case "code": {
      if (!body.code) throw badRequest("Submit your code first.");
      const language = body.language ?? "javascript";
      if (language !== "javascript" && !task.config.variants?.[language]) {
        throw badRequest(`This task doesn't support ${language}.`);
      }
      const result =
        language === "javascript"
          ? await runCodeTask(task.config, body.code)
          : await runPolyglotTask(task.config, language, body.code);
      evaluation = result.evaluation;
      submission = { code: body.code, language, logs: result.logs.slice(0, 50) };
      break;
    }
    case "sql": {
      if (!body.query) throw badRequest("Write a query first.");
      const result = await evaluateSqlTask(task.config, {
        query: body.query,
        findingText: body.findingText,
        chartCreated: body.chartCreated,
      });
      evaluation = result.evaluation;
      submission = { query: body.query, findingText: body.findingText, chartCreated: body.chartCreated };
      break;
    }
    case "design": {
      if (!body.scene) throw badRequest("Add at least one element to the canvas first.");
      evaluation = evaluateDesignTask(task.config, body.scene);
      submission = body.scene;
      break;
    }
    case "terminal": {
      const session = (attempt.submission as TerminalSessionState | undefined) ?? getInitialSession(task.config);
      evaluation = evaluateTerminalTask(task.config, session);
      submission = session;
      break;
    }
    case "security": {
      if (!body.answers) throw badRequest("Answer the questions first.");
      evaluation = evaluateSecurityTask(task.config, body.answers);
      submission = body.answers;
      break;
    }
    default:
      throw new ApiError(500, "Unknown task type.");
  }

  const score = scoreFromBreakdown(evaluation.breakdown);
  const status = evaluation.passed ? "passed" : "failed";
  const timeSpentSeconds = Math.max(0, Math.round((Date.now() - new Date(attempt.startedAt).getTime()) / 1000));

  // XP is awarded once per task - on the first passing attempt only.
  // Deep-focus looks at cumulative time across every run of this task, so
  // iterating doesn't reset the clock.
  let xpAward: XpAward | undefined;
  if (evaluation.passed && !alreadyPassed) {
    const cumulativeSeconds =
      timeSpentSeconds +
      priorAttempts.filter((a) => a.id !== attempt.id).reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0);
    xpAward = computeXpAward(task, {
      attemptNumber: attempt.attemptNumber,
      hintCount: attempt.hintCount,
      timeSpentSeconds: cumulativeSeconds,
      streak: journey.streak ?? 0,
    });
  }

  const updatedAttempt = await submitAttempt(attempt.id, {
    status,
    score,
    submission,
    evaluationDetail: evaluation,
    timeSpentSeconds,
    ...(xpAward ? { xpAward } : {}),
  });

  if (xpAward) await incrementUserXp(auth.uid, xpAward.total);

  const { dayCompleted } = await checkAndAdvanceDay(auth.uid, task.day);

  await Promise.all([
    touchActivity(auth.uid),
    insertEvents(auth.uid, [
      { sessionId: auth.uid, taskId, eventType: "task_submitted", timestamp: new Date().toISOString(), metadata: { attemptNumber: attempt.attemptNumber, score } },
      {
        sessionId: auth.uid,
        taskId,
        eventType: evaluation.passed ? "task_completed" : "task_failed",
        timestamp: new Date().toISOString(),
        metadata: { score },
      },
      ...(dayCompleted
        ? [{ sessionId: auth.uid, eventType: "day_completed" as const, timestamp: new Date().toISOString(), metadata: { day: task.day } }]
        : []),
    ]),
    recomputeDomainScore(auth.uid, task.domainId),
  ]);

  return Response.json({ evaluation, score, status, attempt: updatedAttempt, dayCompleted, xpAward: xpAward ?? null });
});
