"use client";

import { useCallback, useRef, useState } from "react";
import { api } from "./api";

// Experimental, low-weight, optional signal (PRD §18). This is a coarse,
// dependency-free heuristic - NOT true ML eye-gaze estimation (that would
// need a model like MediaPipe/TF.js, which we deliberately left out to
// avoid a heavy dependency for a "could have" feature). Every ~500ms we
// downscale one video frame to a tiny offscreen canvas, find the
// brightness-weighted centroid as a rough proxy for where a lit face is
// positioned in frame, and bucket it into a 3x3 region. Only the aggregated
// distribution ever leaves the browser - never a frame, never raw pixels.
const SAMPLE_INTERVAL_MS = 500;
const FLUSH_INTERVAL_MS = 10_000;
const CALIBRATION_MS = 2000;
const SAMPLE_W = 32;
const SAMPLE_H = 24;

const REGIONS = [
  "top-left", "top-center", "top-right",
  "middle-left", "center", "middle-right",
  "bottom-left", "bottom-center", "bottom-right",
] as const;

export type GazeStatus = "idle" | "requesting" | "calibrating" | "active" | "unavailable" | "denied";

export function useGazeTracking(taskId: string) {
  const [status, setStatus] = useState<GazeStatus>("idle");
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sampleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const regionCountsRef = useRef<Record<string, number>>({});
  const presentCountRef = useRef(0);
  const totalCountRef = useRef(0);
  const calibrationRef = useRef<{ x: number; y: number } | null>(null);
  const calibratedRef = useRef(false);

  const sampleFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return null;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, SAMPLE_W, SAMPLE_H);
    const { data } = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H);

    let sum = 0;
    let sumSq = 0;
    const gray: number[] = new Array(SAMPLE_W * SAMPLE_H);
    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      gray[p] = g;
      sum += g;
      sumSq += g * g;
    }
    const mean = sum / gray.length;
    const variance = sumSq / gray.length - mean * mean;
    const stddev = Math.sqrt(Math.max(variance, 0));
    const threshold = mean + stddev * 0.5;

    let weightSum = 0;
    let xWeighted = 0;
    let yWeighted = 0;
    for (let p = 0; p < gray.length; p++) {
      if (gray[p] > threshold) {
        const x = p % SAMPLE_W;
        const y = Math.floor(p / SAMPLE_W);
        weightSum += gray[p];
        xWeighted += x * gray[p];
        yWeighted += y * gray[p];
      }
    }

    const present = stddev > 8; // near-zero contrast usually means a dark/covered lens
    const centroid = weightSum > 0 ? { x: xWeighted / weightSum / SAMPLE_W, y: yWeighted / weightSum / SAMPLE_H } : null;
    return { present, centroid };
  }, []);

  const regionFor = (x: number, y: number): (typeof REGIONS)[number] => {
    const col = x < 0.33 ? 0 : x < 0.66 ? 1 : 2;
    const row = y < 0.33 ? 0 : y < 0.66 ? 1 : 2;
    return REGIONS[row * 3 + col];
  };

  const flush = useCallback(() => {
    const total = totalCountRef.current;
    if (total === 0) return;
    const distribution: Record<string, number> = {};
    for (const region of REGIONS) {
      distribution[region] = (regionCountsRef.current[region] ?? 0) / total;
    }
    api
      .post("/api/gaze", {
        taskId,
        calibrationQuality: calibratedRef.current ? "medium" : "low",
        presenceRatio: presentCountRef.current / total,
        regionDistribution: distribution,
        sampleCount: total,
      })
      .catch(() => {});
    regionCountsRef.current = {};
    presentCountRef.current = 0;
    totalCountRef.current = 0;
  }, [taskId]);

  const stop = useCallback(() => {
    if (sampleTimerRef.current) clearInterval(sampleTimerRef.current);
    if (flushTimerRef.current) clearInterval(flushTimerRef.current);
    sampleTimerRef.current = null;
    flushTimerRef.current = null;
    flush();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStatus("idle");
  }, [flush]);

  const start = useCallback(async () => {
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 160, height: 120 } });
      streamRef.current = stream;

      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      await video.play();
      videoRef.current = video;

      const canvas = document.createElement("canvas");
      canvas.width = SAMPLE_W;
      canvas.height = SAMPLE_H;
      canvasRef.current = canvas;

      setStatus("calibrating");
      await new Promise((resolve) => setTimeout(resolve, CALIBRATION_MS));
      const calibrationSample = sampleFrame();
      if (calibrationSample?.centroid) {
        calibrationRef.current = calibrationSample.centroid;
        calibratedRef.current = true;
      }

      setStatus("active");
      sampleTimerRef.current = setInterval(() => {
        const result = sampleFrame();
        if (!result) return;
        totalCountRef.current += 1;
        if (result.present) presentCountRef.current += 1;
        if (result.centroid) {
          const region = regionFor(result.centroid.x, result.centroid.y);
          regionCountsRef.current[region] = (regionCountsRef.current[region] ?? 0) + 1;
        }
      }, SAMPLE_INTERVAL_MS);
      flushTimerRef.current = setInterval(flush, FLUSH_INTERVAL_MS);
    } catch (err) {
      const name = (err as { name?: string })?.name;
      setStatus(name === "NotAllowedError" ? "denied" : "unavailable");
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, [flush, sampleFrame]);

  return { status, start, stop };
}
