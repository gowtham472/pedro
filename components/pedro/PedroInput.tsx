"use client";

import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef, useId } from "react";
import clsx from "clsx";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
}

const fieldBaseClasses =
  "w-full rounded-pd-sm border border-border-subtle bg-surface px-4 text-sm text-foreground placeholder:text-text-muted transition-colors focus:outline-none focus:border-pd-mint focus:ring-2 focus:ring-pd-mint/30";

interface PedroInputProps extends InputHTMLAttributes<HTMLInputElement>, FieldWrapperProps {}

export const PedroInput = forwardRef<HTMLInputElement, PedroInputProps>(function PedroInput(
  { label, error, hint, className, id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx(fieldBaseClasses, "h-12", error && "border-red-500 focus:border-red-500 focus:ring-red-500/30")}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-text-muted">
          {hint}
        </p>
      )}
    </div>
  );
});

interface PedroTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldWrapperProps {}

export const PedroTextarea = forwardRef<HTMLTextAreaElement, PedroTextareaProps>(function PedroTextarea(
  { label, error, hint, className, id, rows = 4, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={clsx(fieldBaseClasses, "py-3 resize-y", error && "border-red-500 focus:border-red-500 focus:ring-red-500/30")}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && hint && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  );
});
