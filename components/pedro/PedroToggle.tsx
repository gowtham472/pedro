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
          "relative mt-0.5 h-7 w-12 shrink-0 rounded-pd-pill border transition-colors disabled:opacity-50",
          checked ? "bg-pd-mint border-pd-mint" : "bg-pd-muted/35 border-border-subtle"
        )}
      >
        {/* Thumb: anchored explicitly at left/top - a button's default
            text-align:center would otherwise shift an absolutely-positioned
            child's static position and push the thumb outside the track. */}
        <span
          className={clsx(
            "absolute left-0.5 top-1/2 size-6 -translate-y-1/2 rounded-full bg-white shadow-pd-sm transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
