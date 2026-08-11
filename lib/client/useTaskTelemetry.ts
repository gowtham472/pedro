"use client";

import { useCallback, useEffect, useRef } from "react";
import { api } from "./api";
import type { EventType } from "@/types/entities";

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  const existing = sessionStorage.getItem("pedro-session-id");
  if (existing) return existing;
  const id = crypto.randomUUID();
  sessionStorage.setItem("pedro-session-id", id);
  return id;
}

const FLUSH_INTERVAL_MS = 8000;
const ACTIVE_IDLE_THRESHOLD_MS = 15000;

interface QueuedEvent {
  taskId?: string;
  eventType: EventType;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Tracks lightweight behavioural telemetry for a single task view: an
 * event queue (task_started, hint_opened, etc.) and derived mouse/scroll
 * interaction metrics (never raw coordinates), flushed together on an
 * interval. Silently a no-op server-side if the user hasn't granted the
 * relevant consent (enforced in lib/server/dal/telemetry.ts) - this hook
 * doesn't need to know the user's consent state itself.
 */
export function useTaskTelemetry(taskId: string | undefined) {
  const sessionIdRef = useRef<string>("");
  const queueRef = useRef<QueuedEvent[]>([]);
  const clickCountRef = useRef(0);
  const scrollDistanceRef = useRef(0);
  const retryCountRef = useRef(0);
  const activeSecondsRef = useRef(0);
  // 0, not Date.now(): reading the clock is an impure render-time call.
  // The real timestamp is set in the effect below, which is where side
  // effects belong.
  const lastActivityRef = useRef(0);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    sessionIdRef.current = getSessionId();
    lastActivityRef.current = Date.now();
  }, []);

  const track = useCallback((eventType: EventType, metadata?: Record<string, unknown>) => {
    queueRef.current.push({ taskId, eventType, timestamp: new Date().toISOString(), metadata });
  }, [taskId]);

  const recordRetry = useCallback(() => {
    retryCountRef.current += 1;
  }, []);

  const flush = useCallback(() => {
    const events = queueRef.current.splice(0, queueRef.current.length);
    const interactionDelta = taskId
      ? {
          taskId,
          clickCount: clickCountRef.current,
          activeInteractionSeconds: activeSecondsRef.current,
          scrollDistance: Math.round(scrollDistanceRef.current),
          retryCount: retryCountRef.current,
        }
      : undefined;

    clickCountRef.current = 0;
    activeSecondsRef.current = 0;
    scrollDistanceRef.current = 0;
    retryCountRef.current = 0;

    if (events.length === 0 && (!interactionDelta || Object.values(interactionDelta).every((v) => !v || v === taskId))) {
      return;
    }

    api
      .post("/api/events", { sessionId: sessionIdRef.current || getSessionId(), events, interactionDelta })
      .catch(() => {
        // Best-effort telemetry - never surface a failure to the user.
      });
  }, [taskId]);

  useEffect(() => {
    if (!taskId) return;

    const onClick = () => {
      clickCountRef.current += 1;
      lastActivityRef.current = Date.now();
    };
    const onScroll = () => {
      const y = window.scrollY;
      scrollDistanceRef.current += Math.abs(y - lastScrollYRef.current);
      lastScrollYRef.current = y;
      lastActivityRef.current = Date.now();
    };
    const onActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onActivity);
    window.addEventListener("mousemove", onActivity);

    const activeTimer = setInterval(() => {
      if (Date.now() - lastActivityRef.current < ACTIVE_IDLE_THRESHOLD_MS && document.visibilityState === "visible") {
        activeSecondsRef.current += 1;
      }
    }, 1000);

    const flushTimer = setInterval(flush, FLUSH_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("mousemove", onActivity);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearInterval(activeTimer);
      clearInterval(flushTimer);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  return { track, recordRetry, flush };
}
