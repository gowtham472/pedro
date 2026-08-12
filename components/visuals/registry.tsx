"use client";

import type { ComponentType } from "react";
import { SoftwareAnatomyVisual, ProgramVisual, VariablesVisual, ConditionsVisual, LoopsVisual, FunctionsVisual, ArraysVisual, DebuggingVisual } from "./day1";
import { AlgorithmicThinkingVisual, DecomposeVisual, SearchSortVisual, ComplexityVisual } from "./day2";
import { SpacingVisual, TypographyVisual, ColorVisual, HierarchyVisual, ComponentsVisual } from "./day3";
import { SelectVisual, WhereVisual, GroupByVisual, JoinVisual, ChartsVisual } from "./day4";
import { LinuxVisual, ProcessesVisual, NetworkingVisual, DockerVisual, CicdVisual, TroubleshootVisual } from "./day5";
import { AuthVisual, HttpVisual, LogsVisual, MistakesVisual } from "./day6";

// LessonSection.visualId → component. Content references visuals by id, so
// admins can attach/detach them without touching code (any unknown id simply
// renders nothing).
const REGISTRY: Record<string, ComponentType> = {
  // day 1 - software development
  "software-anatomy": SoftwareAnatomyVisual,
  program: ProgramVisual,
  variables: VariablesVisual,
  conditions: ConditionsVisual,
  loops: LoopsVisual,
  functions: FunctionsVisual,
  arrays: ArraysVisual,
  debugging: DebuggingVisual,
  // day 2 - problem solving
  "algo-thinking": AlgorithmicThinkingVisual,
  decompose: DecomposeVisual,
  "search-sort": SearchSortVisual,
  complexity: ComplexityVisual,
  // day 3 - ui/ux design
  spacing: SpacingVisual,
  typography: TypographyVisual,
  color: ColorVisual,
  hierarchy: HierarchyVisual,
  components: ComponentsVisual,
  // day 4 - data & analytics
  "sql-select": SelectVisual,
  "sql-where": WhereVisual,
  "sql-groupby": GroupByVisual,
  "sql-join": JoinVisual,
  charts: ChartsVisual,
  // day 5 - cloud & devops
  linux: LinuxVisual,
  processes: ProcessesVisual,
  networking: NetworkingVisual,
  docker: DockerVisual,
  cicd: CicdVisual,
  troubleshoot: TroubleshootVisual,
  // day 6 - cybersecurity
  auth: AuthVisual,
  http: HttpVisual,
  logs: LogsVisual,
  "security-mistakes": MistakesVisual,
};

export function ConceptVisual({ id }: { id?: string }) {
  if (!id) return null;
  const Visual = REGISTRY[id];
  return Visual ? <Visual /> : null;
}
