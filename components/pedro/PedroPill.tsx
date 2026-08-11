import clsx from "clsx";

export type PedroPillTone = "neutral" | "mint" | "cream" | "cyan" | "muted";

interface PedroPillProps {
  children: React.ReactNode;
  tone?: PedroPillTone;
  className?: string;
  icon?: React.ReactNode;
}

const toneClasses: Record<PedroPillTone, string> = {
  neutral: "bg-surface-elevated text-foreground border border-border-subtle",
  mint: "bg-pd-mint text-pd-charcoal",
  cream: "bg-pd-cream text-pd-charcoal",
  cyan: "bg-pd-cyan text-pd-charcoal",
  muted: "bg-transparent text-text-muted border border-border-subtle",
};

export function PedroPill({ children, tone = "neutral", className, icon }: PedroPillProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-pd-pill px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
