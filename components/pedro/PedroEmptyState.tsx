import type { ReactNode } from "react";

interface PedroEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PedroEmptyState({ icon, title, description, action }: PedroEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-pd-lg border border-dashed border-border-subtle px-6 py-16 text-center">
      {icon && (
        <div className="flex size-14 items-center justify-center rounded-full bg-surface-elevated text-text-muted" aria-hidden>
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
