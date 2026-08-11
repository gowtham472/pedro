// no-op stub - Next.js aliases the real `server-only` package to nothing at
// build time; Vitest runs outside that pipeline, so we alias it ourselves
// (see vitest.config.ts) to avoid its intentional "throw on import" behavior.
export {};
