"use client";

import { Sparkles, Zap } from "lucide-react";
import type { XpAward } from "@/types/entities";

// Bonus lines stagger in one by one - each earned bonus lands as its own
// small win, which is the point of the reward design.
export function PedroXpCelebration({ award }: { award: XpAward }) {
  return (
    <div className="mt-4 rounded-pd-md bg-pd-charcoal/10 p-4">
      <div className="animate-xp-pop flex items-center gap-2.5">
        <Zap className="size-6 text-pd-charcoal" aria-hidden />
        <p className="text-2xl font-bold tracking-tight text-pd-charcoal">+{award.total} XP</p>
      </div>
      <ul className="mt-3 flex flex-col gap-1.5">
        <li
          className="animate-xp-rise flex items-center justify-between gap-3 text-sm text-pd-charcoal/80"
          style={{ animationDelay: "0.15s" }}
        >
          <span>Task complete</span>
          <span className="font-semibold">+{award.base}</span>
        </li>
        {award.bonuses.map((bonus, i) => (
          <li
            key={bonus.id}
            className="animate-xp-rise flex items-center justify-between gap-3 text-sm text-pd-charcoal/80"
            style={{ animationDelay: `${0.3 + i * 0.15}s` }}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3.5 shrink-0" aria-hidden />
              {bonus.label}
            </span>
            <span className="font-semibold">+{bonus.points}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
