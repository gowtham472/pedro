"use client";

import { useEffect, useRef, useState } from "react";
import { Send, CheckCircle2, Circle } from "lucide-react";
import { PedroButton, PedroCard, PedroCardEyebrow } from "@/components/pedro";
import { api, ApiClientError } from "@/lib/client/api";
import { useToast } from "@/lib/client/useToast";
import type { TerminalTaskConfig } from "@/types/content";
import type { WorkspaceProps } from "./types";

interface CommandResponse {
  output: string;
  cwd: string;
  goalReached: boolean;
  newlyDiscoveredFindingIds: string[];
}

interface Line {
  kind: "input" | "output" | "system";
  text: string;
}

export function TerminalWorkspace({ task, onEvaluated, previousResult }: WorkspaceProps) {
  const config = task.config as TerminalTaskConfig;
  const [lines, setLines] = useState<Line[]>([{ kind: "system", text: config.motd }]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState(config.initialCwd);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [goalReached, setGoalReached] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { show } = useToast();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  async function runCommand(command: string) {
    if (!command.trim()) return;
    setLines((prev) => [...prev, { kind: "input", text: command }]);
    setInput("");
    setRunning(true);
    try {
      const res = await api.post<CommandResponse>(`/api/tasks/${task.id}/terminal/command`, { command });
      if (res.output) setLines((prev) => [...prev, { kind: "output", text: res.output }]);
      setCwd(res.cwd);
      if (res.goalReached && !goalReached) {
        setGoalReached(true);
        setLines((prev) => [...prev, { kind: "system", text: "Service restored." }]);
      }
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Command failed.", "error");
    } finally {
      setRunning(false);
      inputRef.current?.focus();
    }
  }

  async function handleFinish() {
    setSubmitting(true);
    try {
      const res = await api.post(`/api/tasks/${task.id}/submit`, {});
      onEvaluated(res as Parameters<WorkspaceProps["onEvaluated"]>[0], Boolean(previousResult));
    } catch (err) {
      show(err instanceof ApiClientError ? err.message : "Couldn't submit.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PedroCard padding="lg">
      <PedroCardEyebrow>Terminal</PedroCardEyebrow>

      <div
        className="h-96 overflow-y-auto rounded-pd-md border border-border-subtle bg-[#0c0f0c] p-4 font-mono text-sm text-[#d6ffd6]"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words mb-1.5">
            {line.kind === "input" ? (
              <span>
                <span className="text-[#7fffb0]">student@pedro:{cwd}$</span> {line.text}
              </span>
            ) : line.kind === "system" ? (
              <span className="text-[#8fd6ff]">{line.text}</span>
            ) : (
              <span>{line.text}</span>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-[#7fffb0] shrink-0">student@pedro:{cwd}$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !running) runCommand(input);
            }}
            disabled={running}
            autoFocus
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="flex-1 bg-transparent outline-none disabled:opacity-50"
            aria-label="Terminal command input"
          />
        </div>
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm">
        {goalReached ? (
          <CheckCircle2 className="size-4 text-pd-mint" aria-hidden />
        ) : (
          <Circle className="size-4 text-text-muted" aria-hidden />
        )}
        <span className="text-text-muted">{goalReached ? "Service is active." : "Service is still down."}</span>
      </div>

      <PedroButton className="mt-4" onClick={handleFinish} loading={submitting} size="lg">
        <Send className="size-4" aria-hidden />
        Submit
      </PedroButton>
    </PedroCard>
  );
}
