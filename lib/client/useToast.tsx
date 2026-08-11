"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import clsx from "clsx";

type ToastTone = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  show: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastTone, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((toast) => toast.id !== id)), 5000);
  }, []);

  const dismiss = (id: string) => setToasts((t) => t.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:right-6" role="status" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.tone];
          return (
            <div
              key={toast.id}
              className={clsx(
                "flex items-center gap-2.5 rounded-pd-md border px-4 py-3 text-sm shadow-pd-lg max-w-sm",
                toast.tone === "success" && "bg-pd-mint text-pd-charcoal border-transparent",
                toast.tone === "error" && "bg-surface text-foreground border-red-500/40",
                toast.tone === "info" && "bg-surface text-foreground border-border-subtle"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span className="flex-1">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 opacity-60 hover:opacity-100"
                aria-label="Dismiss"
              >
                <X className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
