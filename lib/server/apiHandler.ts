import "server-only";

import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./apiError";
import { type AuthContext, verifyRequest } from "./session";

export type RouteCtx = { params: Promise<Record<string, string>> };

export function handleApiError(err: unknown): Response {
  if (err instanceof ApiError) {
    return Response.json(
      { error: err.message, ...(err.details ? { details: err.details } : {}) },
      { status: err.status }
    );
  }
  if (err instanceof ZodError) {
    return Response.json(
      { error: "That request wasn't formatted the way we expected.", issues: err.issues },
      { status: 400 }
    );
  }
  console.error("[api]", err);
  return Response.json({ error: "Internal server error." }, { status: 500 });
}

type AuthedHandler = (req: NextRequest, auth: AuthContext, ctx: RouteCtx) => Promise<Response>;

/**
 * Wraps a Route Handler so it (a) requires a verified Firebase ID token, (b)
 * optionally requires the admin custom claim, and (c) turns thrown ApiError /
 * ZodError instances into consistent JSON error responses. This is the sole
 * gate between the outside world and lib/server/dal/* - every authenticated
 * route in Pedro is wrapped with this.
 */
export function withAuth(handler: AuthedHandler, opts?: { admin?: boolean }) {
  return async (req: NextRequest, ctx: RouteCtx): Promise<Response> => {
    try {
      const auth = await verifyRequest(req);
      if (!auth) throw new ApiError(401, "Sign in to continue.");
      if (opts?.admin && !auth.admin) throw new ApiError(403, "Admin access required.");
      return await handler(req, auth, ctx);
    } catch (err) {
      return handleApiError(err);
    }
  };
}
