import { NextRequest } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE } from "@/lib/server/session";
import { handleApiError } from "@/lib/server/apiHandler";
import { ApiError } from "@/lib/server/apiError";
import { ensureUserProfile } from "@/lib/server/dal/users";
import { checkRateLimit } from "@/lib/server/rateLimit";

const ADMIN_BOOTSTRAP_EMAILS = new Set(
  (process.env.ADMIN_BOOTSTRAP_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

const bodySchema = z.object({
  idToken: z.string().min(10),
  timezone: z.string().max(100).optional(),
});

const COOKIE_MAX_AGE_SECONDS = 55 * 60; // Firebase ID tokens expire after 1h; client refreshes before then.

export async function POST(req: NextRequest): Promise<Response> {
  try {
    checkRateLimit(`session:${req.headers.get("x-forwarded-for") ?? "local"}`, 30, 60_000);
    const { idToken, timezone } = bodySchema.parse(await req.json());

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(idToken);
    } catch {
      throw new ApiError(401, "That sign-in session has expired. Please sign in again.");
    }

    if (!decoded.email) {
      throw new ApiError(400, "Your account needs an email address to use Pedro.");
    }

    const email = decoded.email.toLowerCase();
    const shouldBeAdmin = ADMIN_BOOTSTRAP_EMAILS.has(email);
    const alreadyAdminClaim = decoded.admin === true;
    let claimsChanged = false;

    if (shouldBeAdmin && !alreadyAdminClaim) {
      await adminAuth.setCustomUserClaims(decoded.uid, { admin: true });
      claimsChanged = true;
    }

    const profile = await ensureUserProfile(decoded.uid, {
      email,
      name: decoded.name ?? email.split("@")[0],
      timezone: timezone ?? "UTC",
      role: shouldBeAdmin || alreadyAdminClaim ? "admin" : "user",
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
    });

    return Response.json({ profile, claimsChanged });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(): Promise<Response> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  return Response.json({ success: true });
}
