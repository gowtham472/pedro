"use client";

import clsx from "clsx";

interface PedroToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function PedroToggle({ checked, onChange, label, description, disabled }: PedroToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="mt-0.5 text-sm text-text-muted">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative mt-0.5 h-7 w-12 shrink-0 rounded-pd-pill transition-colors disabled:opacity-50",
          checked ? "bg-pd-mint" : "bg-surface-elevated border border-border-subtle"
        )}
      >
        <span
          className={clsx(
            "absolute top-0.5 size-6 rounded-full bg-white shadow-pd-sm transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
            !checked && "bg-pd-charcoal/40"
          )}
        />
      </button>
    </div>
  );
}
