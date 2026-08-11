import "server-only";

import { adminDb } from "@/lib/firebase/admin";
import type { DomainDefinition, LessonDefinition, TaskDefinition } from "@/types/content";
import { notFound } from "@/lib/server/apiError";

// Firestore is the runtime source of truth for content (so admin edits take
// effect without a redeploy, per PRD §27). lib/content/* holds the seed data
// that scripts/seed.ts loads in here once; nothing outside that script
// should import lib/content directly at request time.

const DOMAINS = "domains";
const LESSONS = "lessons";
const TASKS = "tasks";

// Firestore rejects arrays nested directly inside arrays ("invalid nested
// entity") and task configs legitimately contain them (e.g. code test-case
// args). Store config as a JSON string and decode on read.
function encodeTask(task: TaskDefinition): Record<string, unknown> {
  return { ...task, config: JSON.stringify(task.config) };
}

function decodeTask(data: FirebaseFirestore.DocumentData): TaskDefinition {
  return {
    ...data,
    config: typeof data.config === "string" ? JSON.parse(data.config) : data.config,
  } as TaskDefinition;
}

export async function listDomains(activeOnly = false): Promise<DomainDefinition[]> {
  const snap = await adminDb.collection(DOMAINS).orderBy("order", "asc").get();
  const domains = snap.docs.map((d) => d.data() as DomainDefinition);
  return activeOnly ? domains.filter((d) => d.active) : domains;
}

export async function getDomain(id: string): Promise<DomainDefinition | null> {
  const doc = await adminDb.collection(DOMAINS).doc(id).get();
  return doc.exists ? (doc.data() as DomainDefinition) : null;
}

export async function requireDomain(id: string): Promise<DomainDefinition> {
  const domain = await getDomain(id);
  if (!domain) throw notFound("Domain");
  return domain;
}

export async function upsertDomain(domain: DomainDefinition): Promise<void> {
  await adminDb.collection(DOMAINS).doc(domain.id).set(domain);
}

export async function deleteDomain(id: string): Promise<void> {
  await adminDb.collection(DOMAINS).doc(id).delete();
}

export async function listLessonsForDay(day: number): Promise<LessonDefinition[]> {
  const snap = await adminDb.collection(LESSONS).where("day", "==", day).get();
  return snap.docs.map((d) => d.data() as LessonDefinition).sort((a, b) => a.order - b.order);
}

export async function getLesson(id: string): Promise<LessonDefinition | null> {
  const doc = await adminDb.collection(LESSONS).doc(id).get();
  return doc.exists ? (doc.data() as LessonDefinition) : null;
}

export async function requireLesson(id: string): Promise<LessonDefinition> {
  const lesson = await getLesson(id);
  if (!lesson) throw notFound("Lesson");
  return lesson;
}

export async function upsertLesson(lesson: LessonDefinition): Promise<void> {
  await adminDb.collection(LESSONS).doc(lesson.id).set(lesson);
}

export async function deleteLesson(id: string): Promise<void> {
  await adminDb.collection(LESSONS).doc(id).delete();
}

export async function listAllLessons(): Promise<LessonDefinition[]> {
  const snap = await adminDb.collection(LESSONS).get();
  return snap.docs.map((d) => d.data() as LessonDefinition).sort((a, b) => a.day - b.day || a.order - b.order);
}

export async function listTasksForDay(day: number): Promise<TaskDefinition[]> {
  const snap = await adminDb.collection(TASKS).where("day", "==", day).get();
  return snap.docs.map((d) => decodeTask(d.data())).sort((a, b) => a.order - b.order);
}

export async function listTasksForDomain(domainId: string): Promise<TaskDefinition[]> {
  const snap = await adminDb.collection(TASKS).where("domainId", "==", domainId).get();
  return snap.docs.map((d) => decodeTask(d.data())).sort((a, b) => a.day - b.day || a.order - b.order);
}

export async function getTask(id: string): Promise<TaskDefinition | null> {
  const doc = await adminDb.collection(TASKS).doc(id).get();
  return doc.exists ? decodeTask(doc.data()!) : null;
}

export async function requireTask(id: string): Promise<TaskDefinition> {
  const task = await getTask(id);
  if (!task) throw notFound("Task");
  return task;
}

export async function upsertTask(task: TaskDefinition): Promise<void> {
  await adminDb.collection(TASKS).doc(task.id).set(encodeTask(task));
}

export async function deleteTask(id: string): Promise<void> {
  await adminDb.collection(TASKS).doc(id).delete();
}

export async function listAllTasks(): Promise<TaskDefinition[]> {
  const snap = await adminDb.collection(TASKS).get();
  return snap.docs.map((d) => decodeTask(d.data())).sort((a, b) => a.day - b.day || a.order - b.order);
}

export async function getDomainForDay(day: number): Promise<DomainDefinition | null> {
  const snap = await adminDb.collection(DOMAINS).where("day", "==", day).limit(1).get();
  return snap.empty ? null : (snap.docs[0].data() as DomainDefinition);
}

export async function getCapstoneTask(domainId: string): Promise<TaskDefinition | null> {
  const snap = await adminDb
    .collection(TASKS)
    .where("day", "==", 7)
    .where("domainId", "==", domainId)
    .limit(1)
    .get();
  return snap.empty ? null : decodeTask(snap.docs[0].data());
}
