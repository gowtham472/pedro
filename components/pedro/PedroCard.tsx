import clsx from "clsx";
import type { HTMLAttributes } from "react";

interface PedroCardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
  tone?: "surface" | "mint" | "cream" | "cyan" | "deep";
  interactive?: boolean;
}

const toneClasses: Record<NonNullable<PedroCardProps["tone"]>, string> = {
  surface: "bg-surface border border-border-subtle",
  deep: "bg-surface-deep border border-border-subtle",
  mint: "bg-pd-mint text-pd-charcoal border border-transparent",
  cream: "bg-pd-cream text-pd-charcoal border border-transparent",
  cyan: "bg-pd-cyan text-pd-charcoal border border-transparent",
};

const paddingClasses: Record<NonNullable<PedroCardProps["padding"]>, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function PedroCard({
  padding = "md",
  tone = "surface",
  interactive = false,
  className,
  children,
  ...props
}: PedroCardProps) {
  return (
    <div
      className={clsx(
        "rounded-pd-lg shadow-pd-sm",
        toneClasses[tone],
        paddingClasses[padding],
        interactive && "transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PedroCardEyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={clsx("text-xs font-semibold uppercase tracking-wide text-text-muted mb-2", className)}>
      {children}
    </p>
  );
}
