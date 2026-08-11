"use client";

import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  type Auth,
  GoogleAuthProvider,
  connectAuthEmulator,
  getAuth,
} from "firebase/auth";

// The browser only ever talks to Firebase Authentication. Firestore access is
// exclusively performed server-side (see lib/firebase/admin.ts + lib/server/dal)
// through Next.js Route Handlers, per Pedro's architecture.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
};

function createFirebaseApp(): FirebaseApp {
  const existing = getApps();
  if (existing.length > 0) return existing[0];
  return initializeApp(firebaseConfig);
}

export const firebaseApp = createFirebaseApp();
export const auth: Auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

const globalForEmulator = globalThis as unknown as {
  __pedroAuthEmulatorConnected?: boolean;
};

if (
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" &&
  !globalForEmulator.__pedroAuthEmulatorConnected
) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", {
    disableWarnings: true,
  });
  globalForEmulator.__pedroAuthEmulatorConnected = true;
}
