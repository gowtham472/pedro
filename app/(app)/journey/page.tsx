"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, Check, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { PedroCard, PedroCardEyebrow, PedroPill, PedroShell } from "@/components/pedro";
import { DOMAIN_ICON_MAP, BuildIcon } from "@/components/pedro/icons/DomainIcons";
import { api } from "@/lib/client/api";
import type { DomainDefinition } from "@/types/content";
import type { JourneyState } from "@/types/entities";

export default function JourneyPage() {
  const [journey, setJourney] = useState<JourneyState | null>(null);
  const [domains, setDomains] = useState<DomainDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ journey: JourneyState }>("/api/journey"),
      api.get<{ domains: DomainDefinition[] }>("/api/domains"),
    ]).then(([j, d]) => {
      setJourney(j.journey);
      setDomains(d.domains);
      setLoading(false);
    });
  }, []);

  if (loading || !journey) {
    return (
      <PedroShell>
        <div className="h-96 animate-pulse rounded-pd-lg bg-surface" />
      </PedroShell>
    );
  }

  const domainByDay = new Map(domains.map((d) => [d.day, d]));

  return (
    <PedroShell>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your journey</h1>
      <p className="mt-1.5 text-sm text-text-muted">Revisit any completed day, or continue where you left off.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => {
          const status = journey.dayStatus[day] ?? "locked";
          const domain = domainByDay.get(day);
          const Icon = day === 7 ? BuildIcon : domain ? DOMAIN_ICON_MAP[domain.id] : BuildIcon;
          const locked = status === "locked";
          const label = day === 7 ? "Independent Build" : domain?.name ?? "";

          const content = (
            <PedroCard interactive={!locked} className={clsx(locked && "opacity-50")}>
              <div className="flex items-start justify-between">
                <PedroCardEyebrow>Day {day}</PedroCardEyebrow>
                {status === "completed" && <Check className="size-4 text-pd-mint" aria-hidden />}
                {locked && <Lock className="size-4 text-text-muted" aria-hidden />}
              </div>
              <div className="flex items-center gap-3">
                <Icon className="size-6 text-text-muted" />
                <p className="text-lg font-semibold">{label}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <PedroPill
                  tone={status === "completed" ? "mint" : status === "in_progress" ? "cyan" : "neutral"}
                >
                  {status === "completed"
                    ? "Completed"
                    : status === "in_progress"
                      ? "In progress"
                      : status === "not_started"
                        ? "Not started"
                        : "Locked"}
                </PedroPill>
                {!locked && <ArrowRight className="size-4 text-text-muted" aria-hidden />}
              </div>
            </PedroCard>
          );

          return locked ? (
            <div key={day}>{content}</div>
          ) : (
            <Link key={day} href={`/day/${day}`}>
              {content}
            </Link>
          );
        })}
      </div>
    </PedroShell>
  );
}
