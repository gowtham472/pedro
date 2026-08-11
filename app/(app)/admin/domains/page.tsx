"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PedroButton, PedroCard, PedroCardEyebrow, PedroInput, PedroPill } from "@/components/pedro";
import { PedroTextarea } from "@/components/pedro/PedroInput";
import { PedroToggle } from "@/components/pedro/PedroToggle";
import { api, ApiClientError } from "@/lib/client/api";
import { useToast } from "@/lib/client/useToast";
import type { AccentToken, DomainDefinition } from "@/types/content";

const ACCENTS: AccentToken[] = ["mint", "cream", "cyan", "lavender", "white"];

// Admin form state uses a plain string id (the slug is free text until it's
// saved and validated server-side) rather than the branded DomainId union.
type DomainForm = Omit<DomainDefinition, "id"> & { id: string };

const BLANK: DomainForm = {
  id: "",
  name: "",
  tagline: "",
  description: "",
  day: 1,
  accentToken: "mint",
  primarySkills: [],
  active: true,
  order: 1,
};

export default function AdminDomainsPage() {
  const { show } = useToast();
  const [domains, setDomains] = useState<DomainDefinition[]>([]);
  const [form, setForm] = useState<DomainForm | null>(null);
  const [skillsText, setSkillsText] = useState("");
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  async function load() {
    const res = await api.get<{ domains: DomainDefinition[] }>("/api/admin/domains");
    setDomains(res.domains.sort((a, b) => a.order - b.order));
  }

  useEffect(() => {
    let cancelled = false;
    api.get<{ domains: DomainDefinition[] }>("/api/admin/domains").then((res) => {
      if (!cancelled) setDomains(res.domains.sort((a, b) => a.order - b.order));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function edit(domain: DomainForm, asNew = false) {
    setForm(domain);
    setSkillsText(domain.primarySkills.join(", "));
    setIsNew(asNew);
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        primarySkills: skillsText.split(",").map((s) => s.trim()).filter(Boolean),
      } as DomainDefinition;
      if (isNew) {
        await api.post("/api/admin/domains", payload);
      } else {
        await api.put(`/api/admin/domains/${form.id}`, payload);
      }
      show("Domain saved.", "success");
      setForm(null);
      await load();
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't save domain.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(`Delete domain "${id}"? This does not delete its tasks.`)) return;
    try {
      await api.delete(`/api/admin/domains/${id}`);
      show("Domain deleted.", "success");
      await load();
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't delete.", "error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <PedroCard padding="lg">
        <div className="flex items-center justify-between">
          <PedroCardEyebrow>Domains</PedroCardEyebrow>
          <PedroButton size="sm" variant="secondary" onClick={() => edit({ ...BLANK }, true)}>
            <Plus className="size-4" aria-hidden />
            New
          </PedroButton>
        </div>
        <ul className="flex flex-col gap-2">
          {domains.map((d) => (
            <li key={d.id} className="flex items-center justify-between rounded-pd-md border border-border-subtle px-3 py-2.5">
              <button className="text-left flex-1" onClick={() => edit(d)}>
                <p className="text-sm font-medium">{d.name}</p>
                <p className="text-xs text-text-muted">
                  Day {d.day} · {d.id}
                </p>
              </button>
              <div className="flex items-center gap-2">
                {!d.active && <PedroPill tone="muted">inactive</PedroPill>}
                <button onClick={() => remove(d.id)} aria-label={`Delete ${d.name}`} className="text-text-muted hover:text-red-400">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </PedroCard>

      {form && (
        <PedroCard padding="lg">
          <PedroCardEyebrow>{isNew ? "New domain" : `Edit ${form.id}`}</PedroCardEyebrow>
          <div className="flex flex-col gap-3">
            <PedroInput label="ID (slug)" value={form.id} disabled={!isNew} onChange={(e) => setForm({ ...form, id: e.target.value })} />
            <PedroInput label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <PedroInput label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            <PedroTextarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <PedroInput
                label="Day (1-7)"
                type="number"
                min={1}
                max={7}
                value={form.day}
                onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
              />
              <PedroInput
                label="Order"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Accent</label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setForm({ ...form, accentToken: a })}
                    className={`flex min-h-9 items-center rounded-pd-pill border px-3 text-xs ${form.accentToken === a ? "border-pd-mint bg-pd-mint/10" : "border-border-subtle"}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <PedroInput
              label="Primary skills (comma separated)"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
            />
            <PedroToggle
              label="Active"
              description="Inactive domains are hidden from students."
              checked={form.active}
              onChange={(v) => setForm({ ...form, active: v })}
            />
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
