"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PedroButton, PedroCard, PedroCardEyebrow, PedroInput, PedroPill } from "@/components/pedro";
import { PedroTextarea } from "@/components/pedro/PedroInput";
import { api, ApiClientError } from "@/lib/client/api";
import { useToast } from "@/lib/client/useToast";
import type { Difficulty, TaskDefinition } from "@/types/content";

const BLANK = {
  id: "",
  domainId: "software-development",
  lessonId: "",
  day: 1,
  title: "",
  description: "",
  instructions: "",
  difficulty: "beginner" as Difficulty,
  estimatedMinutes: 15,
  learningObjectives: [] as string[],
  prerequisiteConcepts: [] as string[],
  hints: [] as { order: number; text: string }[],
  passingScore: 70,
  order: 1,
  config: { type: "code", language: "javascript", functionName: "solve", starterCode: "function solve() {}", testCases: [] },
};

// Admin form state uses plain strings for id/domainId/lessonId (free text
// until saved and validated server-side) and an untyped config object
// (edited directly as JSON — see the rationale in lib/server/validation/content.ts).
type FormState = Omit<TaskDefinition, "config" | "id" | "domainId" | "lessonId"> & {
  id: string;
  domainId: string;
  lessonId: string;
  config: unknown;
};

export default function AdminTasksPage() {
  const { show } = useToast();
  const [tasks, setTasks] = useState<TaskDefinition[]>([]);
  const [form, setForm] = useState<FormState | null>(null);
  const [configText, setConfigText] = useState("");
  const [configError, setConfigError] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await api.get<{ tasks: TaskDefinition[] }>("/api/admin/tasks");
    setTasks(res.tasks.sort((a, b) => a.day - b.day || a.order - b.order));
  }

  useEffect(() => {
    let cancelled = false;
    api.get<{ tasks: TaskDefinition[] }>("/api/admin/tasks").then((res) => {
      if (!cancelled) setTasks(res.tasks.sort((a, b) => a.day - b.day || a.order - b.order));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function edit(task: FormState, asNew: boolean) {
    setForm(task);
    setConfigText(JSON.stringify(task.config, null, 2));
    setConfigError(null);
    setIsNew(asNew);
  }

  async function save() {
    if (!form) return;
    let config: unknown;
    try {
      config = JSON.parse(configText);
    } catch {
      setConfigError("Config isn't valid JSON.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, config };
      if (isNew) await api.post("/api/admin/tasks", payload);
      else await api.put(`/api/admin/tasks/${form.id}`, payload);
      show("Task saved.", "success");
      setForm(null);
      await load();
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't save task.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(`Delete task "${id}"?`)) return;
    try {
      await api.delete(`/api/admin/tasks/${id}`);
      show("Deleted.", "success");
      await load();
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't delete.", "error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <PedroCard padding="lg">
        <div className="flex items-center justify-between">
          <PedroCardEyebrow>Tasks</PedroCardEyebrow>
          <PedroButton size="sm" variant="secondary" onClick={() => edit({ ...BLANK }, true)}>
            <Plus className="size-4" aria-hidden />
            New
          </PedroButton>
        </div>
        <ul className="flex flex-col gap-2">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-center justify-between rounded-pd-md border border-border-subtle px-3 py-2.5">
              <button className="text-left flex-1" onClick={() => edit(t, false)}>
                <p className="text-sm font-medium">{t.title}</p>
                <p className="text-xs text-text-muted">
                  Day {t.day} · {t.domainId} · {t.config.type}
                </p>
              </button>
              <div className="flex items-center gap-2">
                <PedroPill tone="muted">{t.difficulty}</PedroPill>
                <button onClick={() => remove(t.id)} aria-label={`Delete ${t.title}`} className="text-text-muted hover:text-red-400">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </PedroCard>

      {form && (
        <PedroCard padding="lg">
          <PedroCardEyebrow>{isNew ? "New task" : `Edit ${form.id}`}</PedroCardEyebrow>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <PedroInput label="ID (slug)" value={form.id} disabled={!isNew} onChange={(e) => setForm({ ...form, id: e.target.value })} />
              <PedroInput label="Domain ID" value={form.domainId} onChange={(e) => setForm({ ...form, domainId: e.target.value })} />
            </div>
            <PedroInput label="Lesson ID" value={form.lessonId} onChange={(e) => setForm({ ...form, lessonId: e.target.value })} />
            <PedroInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <PedroTextarea label="Description" value={form.description} rows={2} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <PedroTextarea label="Instructions (markdown-lite)" value={form.instructions} rows={4} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
            <div className="grid grid-cols-4 gap-3">
              <PedroInput label="Day" type="number" min={1} max={7} value={form.day} onChange={(e) => setForm({ ...form, day: Number(e.target.value) })} />
              <PedroInput label="Minutes" type="number" value={form.estimatedMinutes} onChange={(e) => setForm({ ...form, estimatedMinutes: Number(e.target.value) })} />
              <PedroInput label="Pass score" type="number" value={form.passingScore} onChange={(e) => setForm({ ...form, passingScore: Number(e.target.value) })} />
              <PedroInput label="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <div className="mt-1.5 flex gap-2">
                {(["beginner", "intermediate", "challenge"] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setForm({ ...form, difficulty: d })}
                    className={`rounded-pd-pill border px-3 py-1 text-xs ${form.difficulty === d ? "border-pd-mint bg-pd-mint/10" : "border-border-subtle"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Config (JSON) — task-type specific, edited directly</label>
              <textarea
                value={configText}
                onChange={(e) => {
                  setConfigText(e.target.value);
                  setConfigError(null);
                }}
                rows={12}
                spellCheck={false}
                className="mt-1.5 w-full rounded-pd-sm border border-border-subtle bg-surface-deep p-3 font-mono text-xs focus:outline-none focus:border-pd-mint"
              />
              {configError && <p className="mt-1 text-xs text-red-500">{configError}</p>}
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <PedroButton onClick={save} loading={saving}>
              Save
            </PedroButton>
            <PedroButton variant="tertiary" onClick={() => setForm(null)}>
              Cancel
            </PedroButton>
          </div>
        </PedroCard>
      )}
    </div>
  );
}
