"use client";

import { useRef, useState } from "react";
import { Send, Trash2, Type as TypeIcon } from "lucide-react";
import clsx from "clsx";
import { PedroButton, PedroCard, PedroCardEyebrow } from "@/components/pedro";
import { PedroInput } from "@/components/pedro/PedroInput";
import { api, ApiClientError } from "@/lib/client/api";
import { useToast } from "@/lib/client/useToast";
import type { DesignTaskConfig } from "@/types/content";
import type { DesignElement, DesignElementKind, DesignScene } from "@/types/design";
import type { WorkspaceProps } from "./types";

const KIND_DEFAULTS: Record<DesignElementKind, { width: number; height: number; label: string }> = {
  heading: { width: 220, height: 40, label: "Heading" },
  subtext: { width: 240, height: 24, label: "Supporting text" },
  "email-field": { width: 280, height: 48, label: "Email" },
  "password-field": { width: 280, height: 48, label: "Password" },
  "text-field": { width: 280, height: 48, label: "Text field" },
  button: { width: 160, height: 44, label: "Continue" },
  card: { width: 260, height: 120, label: "Card" },
  "image-placeholder": { width: 200, height: 120, label: "" },
  "progress-dots": { width: 100, height: 16, label: "" },
  "nav-bar": { width: 340, height: 48, label: "Navigation" },
  icon: { width: 32, height: 32, label: "" },
  divider: { width: 300, height: 2, label: "" },
};

const PALETTE: { kind: DesignElementKind; label: string }[] = [
  { kind: "heading", label: "Heading" },
  { kind: "subtext", label: "Subtext" },
  { kind: "email-field", label: "Email field" },
  { kind: "password-field", label: "Password field" },
  { kind: "text-field", label: "Text field" },
  { kind: "button", label: "Button" },
  { kind: "card", label: "Card" },
  { kind: "image-placeholder", label: "Image" },
  { kind: "progress-dots", label: "Progress dots" },
  { kind: "nav-bar", label: "Nav bar" },
  { kind: "divider", label: "Divider" },
];

function ElementVisual({ el }: { el: DesignElement }) {
  switch (el.kind) {
    case "heading":
      return <span className="text-lg font-semibold leading-none">{el.label}</span>;
    case "subtext":
      return <span className="text-xs text-text-muted leading-none">{el.label}</span>;
    case "email-field":
    case "password-field":
    case "text-field":
      return (
        <div className="flex h-full w-full items-center rounded-pd-sm border border-border-subtle bg-surface px-3 text-xs text-text-muted">
          {el.label}
        </div>
      );
    case "button":
      return (
        <div className="flex h-full w-full items-center justify-center rounded-pd-pill bg-pd-mint text-sm font-medium text-pd-charcoal">
          {el.label}
        </div>
      );
    case "card":
      return (
        <div className="h-full w-full rounded-pd-md border border-border-subtle bg-surface-elevated p-2 text-xs text-text-muted">
          {el.label}
        </div>
      );
    case "image-placeholder":
      return (
        <div className="flex h-full w-full items-center justify-center rounded-pd-md border border-dashed border-border-subtle text-text-muted">
          <TypeIcon className="size-5 opacity-40" aria-hidden />
        </div>
      );
    case "progress-dots":
      return (
        <div className="flex h-full items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={clsx("size-2 rounded-full", i === 0 ? "bg-pd-mint" : "bg-border-subtle")} />
          ))}
        </div>
      );
    case "nav-bar":
      return (
        <div className="flex h-full w-full items-center rounded-pd-sm bg-surface-elevated px-3 text-xs font-medium">
          {el.label}
        </div>
      );
    case "icon":
      return <div className="size-full rounded-full bg-surface-elevated" />;
    case "divider":
      return <div className="h-full w-full bg-border-subtle" />;
    default:
      return null;
  }
}

export function DesignWorkspace({ task, onEvaluated, previousResult }: WorkspaceProps) {
  const config = task.config as DesignTaskConfig;
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [iterationCount, setIterationCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const { show } = useToast();

  const scaleWidth = Math.min(config.canvasSize.width, 640);
  const scale = scaleWidth / config.canvasSize.width;
  const scaledHeight = config.canvasSize.height * scale;

  function addElement(kind: DesignElementKind) {
    const defaults = KIND_DEFAULTS[kind];
    const count = elements.length;
    const el: DesignElement = {
      id: crypto.randomUUID(),
      kind,
      x: 16 + (count % 4) * 12,
      y: 16 + (count % 6) * 20,
      width: defaults.width,
      height: defaults.height,
      label: defaults.label,
    };
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
    setIterationCount((n) => n + 1);
  }

  function updateSelected(patch: Partial<DesignElement>) {
    setElements((prev) => prev.map((el) => (el.id === selectedId ? { ...el, ...patch } : el)));
  }

  function deleteSelected() {
    if (!selectedId) return;
    setElements((prev) => prev.filter((el) => el.id !== selectedId));
    setSelectedId(null);
    setIterationCount((n) => n + 1);
  }

  function onPointerDownElement(e: React.PointerEvent, el: DesignElement) {
    e.stopPropagation();
    setSelectedId(el.id);
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    dragRef.current = {
      id: el.id,
      offsetX: (e.clientX - canvasRect.left) / scale - el.x,
      offsetY: (e.clientY - canvasRect.top) / scale - el.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMoveCanvas(e: React.PointerEvent) {
    const drag = dragRef.current;
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!drag || !canvasRect) return;
    const x = Math.max(0, Math.round((e.clientX - canvasRect.left) / scale - drag.offsetX));
    const y = Math.max(0, Math.round((e.clientY - canvasRect.top) / scale - drag.offsetY));
    setElements((prev) => prev.map((el) => (el.id === drag.id ? { ...el, x, y } : el)));
  }

  function onPointerUpCanvas() {
    if (dragRef.current) setIterationCount((n) => n + 1);
    dragRef.current = null;
  }

  async function handleSubmit() {
    const scene: DesignScene = {
      elements,
      canvasWidth: config.canvasSize.width,
      canvasHeight: config.canvasSize.height,
      iterationCount,
    };
    setSubmitting(true);
    try {
      const res = await api.post(`/api/tasks/${task.id}/submit`, { scene });
      onEvaluated(res as Parameters<WorkspaceProps["onEvaluated"]>[0], Boolean(previousResult));
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't submit your design.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const selected = elements.find((el) => el.id === selectedId);

  return (
    <PedroCard padding="lg">
      <PedroCardEyebrow>Design canvas</PedroCardEyebrow>
      <p className="mb-4 text-sm text-text-secondary">{config.referenceDescription}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {PALETTE.map((item) => (
          <button
            key={item.kind}
            type="button"
            onClick={() => addElement(item.kind)}
            className="rounded-pd-pill border border-border-subtle bg-surface px-3 py-1.5 text-xs font-medium hover:bg-surface-elevated"
          >
            + {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <div
          ref={canvasRef}
          onPointerMove={onPointerMoveCanvas}
          onPointerUp={onPointerUpCanvas}
          onPointerDown={() => setSelectedId(null)}
          className="relative overflow-hidden rounded-pd-md border border-border-subtle bg-surface-deep"
          style={{ width: scaleWidth, height: scaledHeight }}
        >
          {elements.map((el) => (
            <div
              key={el.id}
              onPointerDown={(e) => onPointerDownElement(e, el)}
              className={clsx(
                "absolute cursor-move touch-none select-none",
                selectedId === el.id && "outline outline-2 outline-pd-mint outline-offset-2"
              )}
              style={{
                left: el.x * scale,
                top: el.y * scale,
                width: el.width * scale,
                height: el.height * scale,
              }}
            >
              <ElementVisual el={el} />
            </div>
          ))}
          {elements.length === 0 && (
            <p className="absolute inset-0 flex items-center justify-center text-sm text-text-muted">
              Add elements from the palette above
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2">
            {selected ? "Selected element" : "Checklist"}
          </p>
          {selected ? (
            <div className="flex flex-col gap-3">
              <PedroInput
                label="Label"
                value={selected.label ?? ""}
                onChange={(e) => updateSelected({ label: e.target.value })}
              />
              <PedroButton variant="danger" size="sm" onClick={deleteSelected}>
                <Trash2 className="size-3.5" aria-hidden />
                Delete
              </PedroButton>
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {config.checklist.map((item) => (
                <li key={item.id} className="text-xs text-text-muted">
                  · {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <PedroButton className="mt-5" onClick={handleSubmit} loading={submitting} size="lg" disabled={elements.length === 0}>
        <Send className="size-4" aria-hidden />
        Submit design
      </PedroButton>

      {previousResult && (
        <p className="mt-2 text-xs text-text-muted">Design is scored as guidance, not a strict pass/fail gate.</p>
      )}
    </PedroCard>
  );
}
