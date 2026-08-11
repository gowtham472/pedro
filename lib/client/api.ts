"use client";

import { auth } from "@/lib/firebase/client";

export class ApiClientError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

async function getToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const res = await fetch(path, { ...init, headers });

  if (!res.ok) {
    let message = res.statusText || "Something went wrong.";
    try {
      const data = await res.json();
      if (typeof data?.error === "string") message = data.error;
    } catch {
      // response wasn't JSON - keep the status text
    }
    throw new ApiClientError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const api = {
  get: <T = unknown,>(path: string) => apiFetch<T>(path),
  post: <T = unknown,>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T = unknown,>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "PUT", body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T = unknown,>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T = unknown,>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
