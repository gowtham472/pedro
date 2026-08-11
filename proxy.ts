import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "pedro_session";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const PUBLIC_ROUTES = ["/", ...AUTH_ROUTES];

// Optimistic only - presence of the cookie, nothing more. Every route
// handler independently re-verifies the token server-side (see
// lib/server/session.ts); this just avoids a flash of protected UI before
// the client redirects, per the Next.js auth guide's own caveat that Proxy
// must never be the sole line of defense.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (!hasSession && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
