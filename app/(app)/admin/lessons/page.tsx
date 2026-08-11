"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { PedroButton, PedroCard, PedroCardEyebrow, PedroInput } from "@/components/pedro";
import { PedroTextarea } from "@/components/pedro/PedroInput";
import { api, ApiClientError } from "@/lib/client/api";
import { useToast } from "@/lib/client/useToast";
import type { LessonDefinition } from "@/types/content";

const BLANK: LessonDefinition = {
  id: "",
  domainId: "software-development",
  day: 1,
  title: "",
  summary: "",
  sections: [{ heading: "", body: "" }],
  estimatedMinutes: 30,
  order: 1,
};

export default function AdminLessonsPage() {
  const { show } = useToast();
  const [lessons, setLessons] = useState<LessonDefinition[]>([]);
  const [form, setForm] = useState<LessonDefinition | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await api.get<{ lessons: LessonDefinition[] }>("/api/admin/lessons");
    setLessons(res.lessons);
  }

  useEffect(() => {
    let cancelled = false;
    api.get<{ lessons: LessonDefinition[] }>("/api/admin/lessons").then((res) => {
      if (!cancelled) setLessons(res.lessons);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      if (isNew) await api.post("/api/admin/lessons", form);
      else await api.put(`/api/admin/lessons/${form.id}`, form);
      show("Lesson saved.", "success");
      setForm(null);
      await load();
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't save lesson.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(`Delete lesson "${id}"?`)) return;
    try {
      await api.delete(`/api/admin/lessons/${id}`);
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
          <PedroCardEyebrow>Lessons</PedroCardEyebrow>
          <PedroButton size="sm" variant="secondary" onClick={() => { setForm({ ...BLANK }); setIsNew(true); }}>
            <Plus className="size-4" aria-hidden />
            New
          </PedroButton>
        </div>
        <ul className="flex flex-col gap-2">
          {lessons.map((l) => (
            <li key={l.id} className="flex items-center justify-between rounded-pd-md border border-border-subtle px-3 py-2.5">
              <button className="text-left flex-1" onClick={() => { setForm(l); setIsNew(false); }}>
                <p className="text-sm font-medium">{l.title}</p>
                <p className="text-xs text-text-muted">
                  Day {l.day} · {l.domainId}
                </p>
              </button>
              <button onClick={() => remove(l.id)} aria-label={`Delete ${l.title}`} className="text-text-muted hover:text-red-400">
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </PedroCard>

      {form && (
        <PedroCard padding="lg">
          <PedroCardEyebrow>{isNew ? "New lesson" : `Edit ${form.id}`}</PedroCardEyebrow>
          <div className="flex flex-col gap-3">
            <PedroInput label="ID (slug)" value={form.id} disabled={!isNew} onChange={(e) => setForm({ ...form, id: e.target.value })} />
            <PedroInput label="Domain ID" value={form.domainId} onChange={(e) => setForm({ ...form, domainId: e.target.value as LessonDefinition["domainId"] })} />
            <PedroInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <PedroTextarea label="Summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={2} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <PedroInput label="Day" type="number" min={1} max={7} value={form.day} onChange={(e) => setForm({ ...form, day: Number(e.target.value) })} />
              <PedroInput label="Minutes" type="number" value={form.estimatedMinutes} onChange={(e) => setForm({ ...form, estimatedMinutes: Number(e.target.value) })} />
              <PedroInput label="Order" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Sections</label>
                <button
                  type="button"
                  className="text-xs font-medium underline"
                  onClick={() => setForm({ ...form, sections: [...form.sections, { heading: "", body: "" }] })}
                >
                  + Add section
                </button>
              </div>
              <div className="mt-2 flex flex-col gap-3">
                {form.sections.map((s, i) => (
                  <div key={i} className="rounded-pd-md border border-border-subtle p-3">
                    <div className="flex items-center justify-between gap-2">
                      <PedroInput
                        value={s.heading}
                        placeholder="Heading"
                        className="flex-1"
                        onChange={(e) => {
                          const sections = [...form.sections];
                          sections[i] = { ...sections[i], heading: e.target.value };
                          setForm({ ...form, sections });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, sections: form.sections.filter((_, si) => si !== i) })}
                        className="text-text-muted hover:text-red-400"
                        aria-label="Remove section"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                    <PedroTextarea
                      className="mt-2"
                      value={s.body}
                      placeholder="Body"
                      rows={3}
                      onChange={(e) => {
                        const sections = [...form.sections];
                        sections[i] = { ...sections[i], body: e.target.value };
                        setForm({ ...form, sections });
                      }}
                    />
                  </div>
                ))}
              </div>
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
