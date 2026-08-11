"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, BarChart3, Activity, Eye, FlaskConical } from "lucide-react";
import { PedroButton, PedroCard, PedroCardEyebrow, PedroInput, PedroShell } from "@/components/pedro";
import { PedroToggle } from "@/components/pedro/PedroToggle";
import { api, ApiClientError } from "@/lib/client/api";
import { useAuth } from "@/lib/client/useAuth";
import { useToast } from "@/lib/client/useToast";
import type { ConsentRecord, DomainScore, UserProfile } from "@/types/entities";

export default function PrivacySettingsPage() {
  const router = useRouter();
  const { profile: authProfile, refreshProfile, signOut } = useAuth();
  const { show } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get<{ profile: UserProfile; consent: ConsentRecord }>("/api/profile").then((res) => {
      setProfile(res.profile);
      setConsent(res.consent);
      setName(res.profile.name);
    });
  }, []);

  async function updateConsent(patch: Partial<ConsentRecord>) {
    if (!consent) return;
    const optimistic = { ...consent, ...patch };
    setConsent(optimistic);
    try {
      const res = await api.post<{ consent: ConsentRecord }>("/api/consent", patch);
      setConsent(res.consent);
    } catch (err) {
      setConsent(consent);
      show(err instanceof ApiClientError ? err.message : "Couldn't update that setting.", "error");
    }
  }

  async function saveProfile() {
    setSaving(true);
    try {
      await api.patch("/api/profile", { name });
      await refreshProfile();
      show("Saved.", "success");
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't save.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function exportData() {
    try {
      const { domainScores } = await api.get<{ domainScores: DomainScore[] }>("/api/results");
      const blob = new Blob([JSON.stringify({ profile, consent, domainScores }, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pedro-data-export.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      show("Couldn't export your data.", "error");
    }
  }

  async function deleteAccount() {
    setDeleting(true);
    try {
      await api.delete("/api/account");
      await signOut();
      router.push("/");
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't delete your account.", "error");
      setDeleting(false);
    }
  }

  if (!profile || !consent) {
    return (
      <PedroShell>
        <div className="h-96 animate-pulse rounded-pd-lg bg-surface" />
      </PedroShell>
    );
  }

  return (
    <PedroShell className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Settings & privacy</h1>
      <p className="mt-1.5 text-sm text-text-muted">Manage your profile, what data Pedro collects, and your account.</p>

      <PedroCard padding="lg" className="mt-8">
        <PedroCardEyebrow>Profile</PedroCardEyebrow>
        <PedroInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <p className="mt-2 text-xs text-text-muted">{authProfile?.email}</p>
        <PedroButton className="mt-4" size="sm" onClick={saveProfile} loading={saving}>
          Save
        </PedroButton>
      </PedroCard>

      <PedroCard padding="lg" className="mt-6">
        <PedroCardEyebrow>Data collection</PedroCardEyebrow>
        <div className="flex flex-col divide-y divide-border-subtle">
          <div className="flex items-start gap-3 py-4">
            <BarChart3 className="mt-0.5 size-5 shrink-0 text-text-muted" aria-hidden />
            <PedroToggle
              label="Basic application analytics"
              description="Task and lesson progress, needed for your dashboard and report."
              checked={consent.analyticsConsent}
              onChange={(v) => updateConsent({ analyticsConsent: v })}
            />
          </div>
          <div className="flex items-start gap-3 py-4">
            <Activity className="mt-0.5 size-5 shrink-0 text-text-muted" aria-hidden />
            <PedroToggle
              label="Interaction telemetry"
              description="Aggregate click/scroll/retry signals - never raw keystrokes or continuous tracking."
              checked={consent.interactionConsent}
              onChange={(v) => updateConsent({ interactionConsent: v })}
            />
          </div>
          <div className="flex items-start gap-3 py-4">
            <Eye className="mt-0.5 size-5 shrink-0 text-text-muted" aria-hidden />
            <PedroToggle
              label="Optional webcam / gaze estimation"
              description="Experimental. Processed locally in your browser - no video is ever stored."
              checked={consent.gazeConsent}
              onChange={(v) => updateConsent({ gazeConsent: v })}
            />
          </div>
          <div className="flex items-start gap-3 py-4">
            <FlaskConical className="mt-0.5 size-5 shrink-0 text-text-muted" aria-hidden />
            <PedroToggle
              label="Research / aggregate data usage"
              description="De-identified, aggregated results used to improve Pedro's methodology."
              checked={consent.researchConsent}
              onChange={(v) => updateConsent({ researchConsent: v })}
            />
          </div>
        </div>
      </PedroCard>

      <PedroCard padding="lg" className="mt-6">
        <PedroCardEyebrow>Your data</PedroCardEyebrow>
        <p className="text-sm text-text-secondary">Download a copy of your profile, consent settings, and domain scores.</p>
        <PedroButton variant="secondary" size="sm" className="mt-3" onClick={exportData}>
          <Download className="size-4" aria-hidden />
          Export my data
        </PedroButton>
      </PedroCard>

      <PedroCard padding="lg" className="mt-6 border-red-500/20">
        <PedroCardEyebrow>Delete account</PedroCardEyebrow>
        <p className="text-sm text-text-secondary">
          Permanently deletes your account and all associated data - tasks, reflections, scores, and reports.
          This can&apos;t be undone.
        </p>
        {!confirmDelete ? (
          <PedroButton variant="danger" size="sm" className="mt-3" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="size-4" aria-hidden />
            Delete my account
          </PedroButton>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <PedroButton variant="danger" size="sm" onClick={deleteAccount} loading={deleting}>
              Yes, permanently delete everything
            </PedroButton>
            <PedroButton variant="tertiary" size="sm" onClick={() => setConfirmDelete(false)}>
              Cancel
            </PedroButton>
          </div>
        )}
      </PedroCard>
    </PedroShell>
  );
}
