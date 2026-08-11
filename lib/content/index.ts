import type { DomainDefinition, LessonDefinition, TaskDefinition } from "@/types/content";
import {
  softwareDevelopmentDomain,
  softwareDevelopmentLesson,
  softwareDevelopmentTasks,
} from "./domains/software-development";
import {
  problemSolvingDomain,
  problemSolvingLesson,
  problemSolvingTasks,
} from "./domains/problem-solving";
import { uiUxDesignDomain, uiUxDesignLesson, uiUxDesignTasks } from "./domains/ui-ux-design";
import {
  dataAnalyticsDomain,
  dataAnalyticsLesson,
  dataAnalyticsTasks,
} from "./domains/data-analytics";
import { cloudDevopsDomain, cloudDevopsLesson, cloudDevopsTasks } from "./domains/cloud-devops";
import {
  cybersecurityDomain,
  cybersecurityLesson,
  cybersecurityTasks,
} from "./domains/cybersecurity";
import { independentBuildTasks } from "./domains/independent-build";

export const ALL_DOMAINS: DomainDefinition[] = [
  softwareDevelopmentDomain,
  problemSolvingDomain,
  uiUxDesignDomain,
  dataAnalyticsDomain,
  cloudDevopsDomain,
  cybersecurityDomain,
];

export const ALL_LESSONS: LessonDefinition[] = [
  softwareDevelopmentLesson,
  problemSolvingLesson,
  uiUxDesignLesson,
  dataAnalyticsLesson,
  cloudDevopsLesson,
  cybersecurityLesson,
];

export const ALL_TASKS: TaskDefinition[] = [
  ...softwareDevelopmentTasks,
  ...problemSolvingTasks,
  ...uiUxDesignTasks,
  ...dataAnalyticsTasks,
  ...cloudDevopsTasks,
  ...cybersecurityTasks,
  ...independentBuildTasks,
];

export function getDomainById(id: string): DomainDefinition | undefined {
  return ALL_DOMAINS.find((d) => d.id === id);
}

export function getLessonById(id: string): LessonDefinition | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getTaskById(id: string): TaskDefinition | undefined {
  return ALL_TASKS.find((t) => t.id === id);
}

export function getLessonsForDay(day: number): LessonDefinition[] {
  return ALL_LESSONS.filter((l) => l.day === day).sort((a, b) => a.order - b.order);
}

export function getTasksForDay(day: number): TaskDefinition[] {
  return ALL_TASKS.filter((t) => t.day === day).sort((a, b) => a.order - b.order);
}

export function getCapstoneTaskForDomain(domainId: string): TaskDefinition | undefined {
  return ALL_TASKS.find((t) => t.day === 7 && t.domainId === domainId);
}

export function getDomainByDay(day: number): DomainDefinition | undefined {
  return ALL_DOMAINS.find((d) => d.day === day);
}

export const TOTAL_DAYS = 7;
