import { z } from "zod";

// Admins are trusted operators (gated by the `admin` custom claim), so
// content CRUD validates the top-level shape strictly but trusts the
// type-specific `config` payload structurally rather than re-deriving the
// full types/content.ts union in zod - a deliberate scope cut for the MVP
// admin CMS. Runtime `type` is still checked so a malformed config can't
// silently corrupt a task's evaluation type.
export const domainSchema = z.object({
  id: z.string().min(1).max(64),
  name: z.string().min(1).max(100),
  tagline: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  day: z.number().int().min(1).max(7),
  accentToken: z.enum(["mint", "cream", "cyan", "lavender", "white"]),
  primarySkills: z.array(z.string().max(100)).max(10),
  active: z.boolean(),
  order: z.number().int().min(0).max(100),
});

const lessonSectionSchema = z.object({
  heading: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
});

export const lessonSchema = z.object({
  id: z.string().min(1).max(64),
  domainId: z.string().min(1).max(64),
  day: z.number().int().min(1).max(7),
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  sections: z.array(lessonSectionSchema).min(1).max(20),
  estimatedMinutes: z.number().int().min(1).max(600),
  order: z.number().int().min(0).max(100),
});

const hintSchema = z.object({
  order: z.number().int().min(1).max(20),
  text: z.string().min(1).max(1000),
});

export const taskSchema = z.object({
  id: z.string().min(1).max(64),
  domainId: z.string().min(1).max(64),
  lessonId: z.string().min(1).max(64),
  day: z.number().int().min(1).max(7),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  instructions: z.string().min(1).max(10_000),
  difficulty: z.enum(["beginner", "intermediate", "challenge"]),
  estimatedMinutes: z.number().int().min(1).max(600),
  learningObjectives: z.array(z.string().max(200)).max(20),
  prerequisiteConcepts: z.array(z.string().max(200)).max(20),
  hints: z.array(hintSchema).max(10),
  passingScore: z.number().int().min(0).max(100),
  order: z.number().int().min(0).max(100),
  config: z
    .object({ type: z.enum(["code", "sql", "design", "terminal", "security"]) })
    .passthrough(),
});

export const scoringWeightsSchema = z
  .object({
    performance: z.number().min(0).max(1),
    learningVelocity: z.number().min(0).max(1),
    engagement: z.number().min(0).max(1),
    preference: z.number().min(0).max(1),
  })
  .refine((w) => Math.abs(w.performance + w.learningVelocity + w.engagement + w.preference - 1) < 0.01, {
    message: "Weights must sum to 1.0",
  });
