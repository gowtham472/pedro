import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // firebase-admin is already on Next's default serverExternalPackages list;
  // listed explicitly here so that stays true regardless of Next's defaults.
  // (The jose ESM/CJS crash this used to cause is fixed via the `jose`
  // override in pnpm-workspace.yaml, not by externalizing - firebase-admin
  // was already external when that error happened.)
  serverExternalPackages: ["sql.js", "firebase-admin"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
