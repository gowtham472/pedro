import clsx from "clsx";
import { Check } from "lucide-react";
import type { DayStatus } from "@/types/entities";

interface PedroProgressProps {
  dayStatus: Record<number, DayStatus>;
  currentDay: number;
  totalDays?: number;
  className?: string;
}

/** The seven-day journey progress strip: filled mint dots for completed
 * days, an outlined ring for the active day, muted for locked/upcoming. */
export function PedroProgress({ dayStatus, currentDay, totalDays = 7, className }: PedroProgressProps) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  return (
    <ol className={clsx("flex items-center gap-2 sm:gap-3", className)}>
      {days.map((day) => {
        const status = dayStatus[day] ?? "locked";
        const isActive = day === currentDay;
        return (
          <li key={day} className="flex flex-col items-center gap-1.5">
            <div
              className={clsx(
                "flex items-center justify-center rounded-full font-medium transition-all",
                isActive ? "size-9 sm:size-10 text-sm" : "size-7 sm:size-8 text-xs",
                status === "completed" && "bg-pd-mint text-pd-charcoal",
                status === "in_progress" && "border-2 border-pd-mint text-foreground",
                status === "not_started" && "border-2 border-border-subtle text-foreground",
                status === "locked" && "border-2 border-border-subtle text-text-muted opacity-50"
              )}
              aria-current={isActive ? "step" : undefined}
            >
              {status === "completed" ? <Check className="size-4" aria-hidden /> : day}
            </div>
            <span className="hidden sm:block text-[10px] uppercase tracking-wide text-text-muted">
              Day {day}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
