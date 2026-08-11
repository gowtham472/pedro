"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

// A tiny external store over the `data-theme` attribute (set synchronously
// by the inline script in app/layout.tsx before hydration). useSyncExternalStore
// is the correct primitive for a client-only value like this - it has a
// proper SSR snapshot, and every component reading it re-renders together
// when the theme changes, unlike a useState+useEffect pair that only syncs
// itself once on mount.
const listeners = new Set<() => void>();

function getSnapshot(): Theme {
  return (document.documentElement.getAttribute("data-theme") as Theme) ?? "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function applyTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("pedro-theme", next);
  listeners.forEach((l) => l());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => applyTheme(next), []);
  const toggleTheme = useCallback(() => applyTheme(getSnapshot() === "dark" ? "light" : "dark"), []);

  return { theme, setTheme, toggleTheme };
}
