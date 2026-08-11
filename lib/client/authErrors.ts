const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "That email or password doesn't match our records.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "That email or password doesn't match our records.",
  "auth/email-already-in-use": "An account with that email already exists - try signing in instead.",
  "auth/weak-password": "Choose a password with at least 8 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error - check your connection and try again.",
  "auth/user-disabled": "This account has been disabled.",
};

export function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  if (code && MESSAGES[code]) return MESSAGES[code];
  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong. Please try again.";
}
