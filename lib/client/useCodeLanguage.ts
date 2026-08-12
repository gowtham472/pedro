"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CodeLanguage } from "@/types/content";

// One shared "which language am I learning in?" preference. Lesson snippets
// and the task workspace both read it, so picking Python once switches every
// code example on the site to Python. Same useSyncExternalStore shape as
// useTheme - all subscribers re-render together when it changes.

const STORAGE_KEY = "pedro-code-language";
const LANGUAGES: CodeLanguage[] = ["javascript", "python", "java", "c"];

const listeners = new Set<() => void>();

function getSnapshot(): CodeLanguage {
  const stored = localStorage.getItem(STORAGE_KEY) as CodeLanguage | null;
  return stored && LANGUAGES.includes(stored) ? stored : "javascript";
}

function getServerSnapshot(): CodeLanguage {
  return "javascript";
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useCodeLanguage() {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLanguage = useCallback((next: CodeLanguage) => {
    localStorage.setItem(STORAGE_KEY, next);
    listeners.forEach((l) => l());
  }, []);

  return { language, setLanguage };
}

export const CODE_LANGUAGES = LANGUAGES;

export const CODE_LANGUAGE_LABELS: Record<CodeLanguage, string> = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  c: "C",
};
