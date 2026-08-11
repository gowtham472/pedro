import clsx from "clsx";

interface PedroMetricProps {
  value: string | number;
  label: string;
  description?: string;
  size?: "md" | "lg";
  className?: string;
}

/** Editorial number-first hierarchy per brand guidelines §7: large number,
 * small label, secondary explanation - no boxed "CARD TITLE / SCORE" pattern. */
export function PedroMetric({ value, label, description, size = "md", className }: PedroMetricProps) {
  return (
    <div className={className}>
      <div
        className={clsx(
          "font-semibold tracking-tight tabular-nums",
          size === "lg" ? "text-5xl" : "text-3xl"
        )}
      >
        {value}
      </div>
      <div className="mt-1 text-sm font-medium">{label}</div>
      {description && <div className="mt-0.5 text-sm text-text-muted">{description}</div>}
    </div>
  );
}
