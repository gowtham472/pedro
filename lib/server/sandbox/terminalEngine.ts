import "server-only";

import type { TerminalTaskConfig } from "@/types/content";
import type { EvaluationBreakdownItem, EvaluationDetail } from "@/types/entities";

export interface TerminalSessionState {
  cwd: string;
  commandHistory: string[];
  discoveredFindingIds: string[];
  appliedFixStepIds: string[];
}

export function getInitialSession(config: TerminalTaskConfig): TerminalSessionState {
  return {
    cwd: config.initialCwd,
    commandHistory: [],
    discoveredFindingIds: [],
    appliedFixStepIds: [],
  };
}

export interface TerminalCommandResult {
  output: string;
  session: TerminalSessionState;
  goalReached: boolean;
  newlyDiscoveredFindingIds: string[];
}

function resolvePath(cwd: string, input: string): string {
  if (!input || input === ".") return cwd;
  const raw = input.startsWith("/") ? input : `${cwd === "/" ? "" : cwd}/${input}`;
  const stack: string[] = [];
  for (const part of raw.split("/").filter(Boolean)) {
    if (part === "..") stack.pop();
    else if (part !== ".") stack.push(part);
  }
  return "/" + stack.join("/");
}

function directChildren(config: TerminalTaskConfig, dirPath: string): { files: string[]; dirs: string[] } {
  const prefix = dirPath === "/" ? "" : dirPath;
  const files = new Set<string>();
  const dirs = new Set<string>();
  const allPaths = [...config.files.map((f) => f.path), ...config.directories];

  for (const p of allPaths) {
    if (p === prefix) continue;
    if (!p.startsWith(prefix + "/")) continue;
    const rest = p.slice(prefix.length + 1);
    const [first, ...more] = rest.split("/");
    if (!first) continue;
    if (more.length > 0 || config.directories.includes(prefix + "/" + first)) dirs.add(first);
    else if (config.files.some((f) => f.path === p)) files.add(first);
    else dirs.add(first);
  }
  return { files: [...files].sort(), dirs: [...dirs].sort() };
}

function deriveState(config: TerminalTaskConfig, session: TerminalSessionState) {
  const applied = new Set(session.appliedFixStepIds);
  const killedPids = new Set(
    config.fixSteps.filter((f) => f.effect === "kill-process" && applied.has(f.id)).map((f) => f.targetPid)
  );
  const truncatedFiles = new Set(
    config.fixSteps.filter((f) => f.effect === "truncate-file" && applied.has(f.id)).map((f) => f.targetFile)
  );
  const serviceStatus: Record<string, "active" | "failed"> = {};
  for (const svc of config.services) serviceStatus[svc.name] = svc.initialStatus;
  for (const f of config.fixSteps) {
    if (f.effect === "restart-service" && applied.has(f.id) && f.targetService) {
      serviceStatus[f.targetService] = "active";
    }
  }
  const envSet = new Set(
    config.fixSteps.filter((f) => f.effect === "set-env" && applied.has(f.id)).map((f) => f.targetService)
  );
  return { killedPids, truncatedFiles, serviceStatus, envSet };
}

function fileContent(config: TerminalTaskConfig, path: string, truncated: Set<string | undefined>): string | null {
  const file = config.files.find((f) => f.path === path);
  if (!file) return null;
  return truncated.has(path) ? "(file is now empty)" : file.content;
}

const HELP_TEXT = [
  "Available commands:",
  "  ls [path]                 list files in a directory",
  "  cd <path>                 change directory",
  "  pwd                       print working directory",
  "  cat <file>                print a file's contents",
  "  grep <pattern> <file>     search a file for a pattern",
  "  ps                        list running processes",
  "  netstat                   list listening ports",
  "  df                        show disk usage",
  "  du [path]                 show file sizes",
  "  systemctl status <svc>    show a service's status",
  "  systemctl restart <svc>   restart a service",
  "  systemctl set-env <svc> KEY=VALUE   set an environment variable",
  "  kill <pid>                terminate a process",
  "  truncate <file>           empty a file",
  "  journalctl -u <svc>       show a service's log",
  "  whoami, hostname, clear, help",
].join("\n");

export function runTerminalCommand(
  config: TerminalTaskConfig,
  session: TerminalSessionState,
  rawInput: string
): TerminalCommandResult {
  const trimmed = rawInput.trim().replace(/\s+/g, " ");
  const state = deriveState(config, session);
  let nextSession: TerminalSessionState = {
    ...session,
    commandHistory: [...session.commandHistory, trimmed].slice(-200),
  };

  const newlyDiscovered: string[] = [];
  for (const finding of config.findings) {
    if (nextSession.discoveredFindingIds.includes(finding.id)) continue;
    if (new RegExp(finding.requiredCommandPattern, "i").test(trimmed)) {
      newlyDiscovered.push(finding.id);
    }
  }
  if (newlyDiscovered.length > 0) {
    nextSession = {
      ...nextSession,
      discoveredFindingIds: [...nextSession.discoveredFindingIds, ...newlyDiscovered],
    };
  }

  const output = execute(config, nextSession, state, trimmed, (appliedId) => {
    nextSession = { ...nextSession, appliedFixStepIds: [...nextSession.appliedFixStepIds, appliedId] };
  });

  const finalState = deriveState(config, nextSession);
  const goalReached = finalState.serviceStatus[config.goalServiceName] === "active";

  return { output, session: nextSession, goalReached, newlyDiscoveredFindingIds: newlyDiscovered };
}

function execute(
  config: TerminalTaskConfig,
  session: TerminalSessionState,
  state: ReturnType<typeof deriveState>,
  trimmed: string,
  applyFix: (fixStepId: string) => void
): string {
  if (!trimmed) return "";
  const [cmd, ...rest] = trimmed.split(" ");
  const arg = rest.join(" ");
  const lowerCmd = cmd.toLowerCase();

  switch (lowerCmd) {
    case "help":
      return HELP_TEXT;
    case "pwd":
      return session.cwd;
    case "whoami":
      return "student";
    case "hostname":
      return "pedro-sandbox";
    case "clear":
      return "";

    case "ls": {
      const target = resolvePath(session.cwd, rest[0] ?? "");
      const { files, dirs } = directChildren(config, target);
      if (files.length === 0 && dirs.length === 0) return `ls: cannot access '${rest[0] ?? "."}': No such file or directory`;
      return [...dirs.map((d) => d + "/"), ...files].join("  ") || "(empty directory)";
    }

    case "cd": {
      const target = resolvePath(session.cwd, rest[0] ?? "/");
      const { files, dirs } = directChildren(config, target);
      const exists =
        target === config.initialCwd || files.length > 0 || dirs.length > 0 || config.directories.includes(target);
      if (!exists) return `cd: ${rest[0] ?? ""}: No such file or directory`;
      session.cwd = target;
      return "";
    }

    case "cat": {
      if (!rest[0]) return "cat: missing file operand";
      const target = resolvePath(session.cwd, rest[0]);
      const content = fileContent(config, target, state.truncatedFiles);
      return content ?? `cat: ${rest[0]}: No such file or directory`;
    }

    case "grep": {
      const match = arg.match(/^(\S+|"[^"]*")\s+(.+)$/);
      if (!match) return "usage: grep <pattern> <file>";
      const pattern = match[1].replace(/^"|"$/g, "");
      const target = resolvePath(session.cwd, match[2]);
      const content = fileContent(config, target, state.truncatedFiles);
      if (content === null) return `grep: ${match[2]}: No such file or directory`;
      const matches = content.split("\n").filter((line) => line.toLowerCase().includes(pattern.toLowerCase()));
      return matches.length > 0 ? matches.join("\n") : "";
    }

    case "ps": {
      const rows = config.processes.filter((p) => !state.killedPids.has(p.pid));
      const header = "PID    COMMAND";
      const lines = rows.map((p) => `${String(p.pid).padEnd(7)}${p.command}`);
      return [header, ...lines].join("\n");
    }

    case "netstat": {
      const rows = config.netstatEntries.filter((e) => !state.killedPids.has(e.pid));
      if (rows.length === 0) return "No listening ports.";
      const header = "PROTO  LOCAL PORT  PID/PROGRAM";
      const lines = rows.map((e) => `tcp    ${String(e.port).padEnd(11)}${e.pid}/${e.program}`);
      return [header, ...lines].join("\n");
    }

    case "df": {
      if (!config.diskUsage || config.diskUsage.length === 0) return "No disk usage data for this sandbox.";
      const reduced = state.truncatedFiles.size > 0;
      const header = "MOUNT   USE%";
      const lines = config.diskUsage.map((d) => {
        const pct = reduced ? Math.max(5, d.usedPercent - 40) : d.usedPercent;
        return `${d.mount.padEnd(8)}${pct}%`;
      });
      return [header, ...lines].join("\n");
    }

    case "du": {
      if (!config.duEntries || config.duEntries.length === 0) return "No files to report.";
      const lines = config.duEntries.map((d) => {
        const label = state.truncatedFiles.has(d.path) ? "0B" : d.sizeLabel;
        return `${label.padEnd(8)}${d.path}`;
      });
      return lines.join("\n");
    }

    case "journalctl": {
      const serviceMatch = arg.match(/-u\s+(\S+)/);
      const serviceName = serviceMatch?.[1];
      if (!serviceName) return "usage: journalctl -u <service>";
      const file = config.files.find(
        (f) => f.path.toLowerCase().includes(serviceName.toLowerCase()) && f.path.toLowerCase().includes("log")
      );
      if (!file) return `No journal entries found for ${serviceName}.`;
      return fileContent(config, file.path, state.truncatedFiles) ?? "";
    }

    case "kill": {
      const pidArg = rest.find((r) => /^\d+$/.test(r));
      if (!pidArg) return "usage: kill [-9] <pid>";
      const fix = config.fixSteps.find(
        (f) => f.effect === "kill-process" && new RegExp(f.commandPattern, "i").test(trimmed)
      );
      if (fix) {
        applyFix(fix.id);
        return `Process ${pidArg} terminated.`;
      }
      const exists = config.processes.some((p) => String(p.pid) === pidArg && !state.killedPids.has(p.pid));
      return exists ? `kill: (${pidArg}): Operation not permitted` : `kill: (${pidArg}): No such process`;
    }

    case "truncate": {
      if (!rest[0]) return "usage: truncate <file>";
      const target = resolvePath(session.cwd, rest[0]);
      const fix = config.fixSteps.find(
        (f) => f.effect === "truncate-file" && new RegExp(f.commandPattern, "i").test(trimmed)
      );
      if (fix) {
        applyFix(fix.id);
        return `${rest[0]} truncated.`;
      }
      const isKnownFile = config.files.some((f) => f.path === target);
      return isKnownFile ? `${rest[0]} truncated.` : `truncate: cannot truncate '${rest[0]}': No such file or directory`;
    }

    case "systemctl": {
      const [sub, ...svcParts] = rest;
      const serviceName = svcParts[0];
      if (sub === "status") {
        const svc = config.services.find((s) => s.name === serviceName);
        if (!svc) return `Unit ${serviceName ?? ""}.service could not be found.`;
        const status = state.serviceStatus[svc.name];
        return status === "active"
          ? `● ${svc.name}.service - active (running)`
          : `● ${svc.name}.service - failed\n${svc.failureMessage}`;
      }
      if (sub === "restart" || sub === "start") {
        const svc = config.services.find((s) => s.name === serviceName);
        if (!svc) return `Unit ${serviceName ?? ""}.service could not be found.`;
        const fix = config.fixSteps.find(
          (f) => f.effect === "restart-service" && new RegExp(f.commandPattern, "i").test(trimmed)
        );
        if (fix) {
          const prereqsMet = (fix.requiresFixStepIds ?? []).every((id) => session.appliedFixStepIds.includes(id));
          if (prereqsMet) {
            applyFix(fix.id);
            return `${svc.name}.service restarted successfully.`;
          }
        }
        return `Job for ${svc.name}.service failed.\n${svc.failureMessage}`;
      }
      if (sub === "set-env") {
        const fix = config.fixSteps.find(
          (f) => f.effect === "set-env" && new RegExp(f.commandPattern, "i").test(trimmed)
        );
        if (fix) {
          applyFix(fix.id);
          return `Environment variable set for ${serviceName}.`;
        }
        return "usage: systemctl set-env <service> KEY=VALUE";
      }
      return `systemctl: unknown sub-command '${sub ?? ""}'`;
    }

    default:
      return `${cmd}: command not found. Type 'help' for a list of commands.`;
  }
}

export function evaluateTerminalTask(config: TerminalTaskConfig, session: TerminalSessionState): EvaluationDetail {
  const state = deriveState(config, session);
  const goalReached = state.serviceStatus[config.goalServiceName] === "active";

  const breakdown: EvaluationBreakdownItem[] = config.findings.map((finding) => ({
    label: finding.description,
    passed: session.discoveredFindingIds.includes(finding.id),
  }));
  breakdown.push({
    label: `${config.goalServiceName} is restored to active`,
    passed: goalReached,
  });

  return {
    summary: goalReached
      ? `Service restored. You uncovered ${session.discoveredFindingIds.length}/${config.findings.length} of the investigation signals along the way.`
      : `${config.goalServiceName} is still down - keep investigating with the commands in \`help\`.`,
    passed: goalReached,
    breakdown,
  };
}
