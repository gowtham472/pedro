"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

export type PedroButtonVariant = "primary" | "secondary" | "tertiary" | "danger";
export type PedroButtonSize = "md" | "lg" | "sm";

interface PedroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PedroButtonVariant;
  size?: PedroButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<PedroButtonVariant, string> = {
  primary:
    "bg-pd-mint text-pd-charcoal hover:bg-pd-mint-strong active:bg-pd-mint-strong disabled:hover:bg-pd-mint",
  secondary:
    "bg-transparent text-foreground border border-border-subtle hover:bg-surface-elevated",
  tertiary: "bg-transparent text-foreground hover:bg-surface-elevated",
  danger: "bg-transparent text-red-500 border border-red-500/30 hover:bg-red-500/10",
};

const sizeClasses: Record<PedroButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2",
};

export const PedroButton = forwardRef<HTMLButtonElement, PedroButtonProps>(function PedroButton(
  { variant = "primary", size = "md", loading, fullWidth, disabled, className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center rounded-pd-pill font-medium transition-colors duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});
