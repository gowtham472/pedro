"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useGazeTracking } from "@/lib/client/useGazeTracking";
import { api } from "@/lib/client/api";
import { PedroButton } from "@/components/pedro";
import type { ConsentRecord } from "@/types/entities";

/** Visible, consent-gated, opt-in-per-session indicator for the experimental
 * gaze/attention signal. Renders nothing at all unless the user has
 * previously granted gaze consent in onboarding or Settings. */
export function GazeIndicator({ taskId }: { taskId: string }) {
  const { status, start, stop } = useGazeTracking(taskId);
  const [consented, setConsented] = useState<boolean | null>(null);

  useEffect(() => {
    api
      .get<{ consent: ConsentRecord }>("/api/consent")
      .then((res) => setConsented(res.consent.gazeConsent))
      .catch(() => setConsented(false));
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!consented) return null;

  if (status === "active" || status === "calibrating" || status === "requesting") {
    return (
      <div className="flex items-center gap-2 rounded-pd-pill border border-border-subtle bg-surface px-3 py-1.5 text-xs">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-red-500" />
        </span>
        <span className="font-medium">
          {status === "requesting" && "Requesting camera…"}
          {status === "calibrating" && "Calibrating…"}
          {status === "active" && "Gaze tracking active"}
        </span>
        <button type="button" onClick={stop} className="ml-1 text-text-muted hover:text-foreground" aria-label="Stop gaze tracking">
          <EyeOff className="size-3.5" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <PedroButton variant="tertiary" size="sm" onClick={start}>
        <Eye className="size-3.5" aria-hidden />
        Enable gaze tracking
      </PedroButton>
      {status === "denied" && <span className="text-xs text-text-muted">Camera permission denied.</span>}
      {status === "unavailable" && <span className="text-xs text-text-muted">Unavailable on this device.</span>}
    </div>
  );
}
