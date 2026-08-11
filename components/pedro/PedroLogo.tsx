interface PedroLogoProps {
  size?: number;
  className?: string;
  monochrome?: boolean;
}

/** The Pedro mark: four rounded modules forming a path/portal - exploration,
 * direction, and progress. Custom geometry, not derived from any reference. */
export function PedroLogo({ size = 32, className, monochrome = false }: PedroLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Pedro"
    >
      <rect x="2" y="2" width="12" height="12" rx="4" fill="currentColor" opacity={monochrome ? 1 : 1} />
      <rect x="18" y="2" width="12" height="12" rx="4" fill="currentColor" opacity={monochrome ? 1 : 0.55} />
      <rect x="2" y="18" width="12" height="12" rx="4" fill="currentColor" opacity={monochrome ? 1 : 0.55} />
      <rect x="18" y="18" width="12" height="12" rx="4" fill="currentColor" opacity={monochrome ? 1 : 0.85} />
    </svg>
  );
}

export function PedroWordmark({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <PedroLogo size={26} />
      <span className="text-lg font-semibold tracking-tight">Pedro</span>
    </div>
  );
}
