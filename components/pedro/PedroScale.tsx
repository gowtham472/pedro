"use client";

import clsx from "clsx";

interface PedroScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  lowLabel?: string;
  highLabel?: string;
  name: string;
  max?: number;
}

/** A 1-5 (or 1-N) selectable scale used for reflections and baseline
 * questions - large tappable cards rather than a cramped radio row, per
 * brand guidelines §27. */
export function PedroScale({ value, onChange, lowLabel, highLabel, name, max = 5 }: PedroScaleProps) {
  const options = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div>
      <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label={name}>
        {options.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onClick={() => onChange(n)}
            className={clsx(
              "flex h-14 items-center justify-center rounded-pd-md border text-base font-semibold transition-colors",
              value === n
                ? "border-transparent bg-pd-mint text-pd-charcoal"
                : "border-border-subtle bg-surface text-foreground hover:bg-surface-elevated"
            )}
          >
            {n}
          </button>
        ))}
      </div>
      {(lowLabel || highLabel) && (
        <div className="mt-1.5 flex justify-between text-xs text-text-muted">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      )}
    </div>
  );
}
