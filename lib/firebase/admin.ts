import "server-only";

import { type App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Server-only. This module is the ONLY place in Pedro that talks to
// Firestore. Every Route Handler goes through lib/server/dal/* which in turn
// uses `adminDb` exported here. The browser never imports this file.

const projectId =
  process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

const usingEmulators = Boolean(
  process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST
);

function createAdminApp(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  if (usingEmulators) {
    // The Admin SDK talks to the local emulator suite automatically when the
    // FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST env vars are
    // present - no service account credentials are required in that mode.
    return initializeApp({ projectId });
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, " +
        "FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (or run against the " +
        "local emulators - see .env.example)."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

const adminApp = createAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);

adminDb.settings({ ignoreUndefinedProperties: true });
