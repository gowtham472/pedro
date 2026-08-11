"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { friendlyAuthError } from "@/lib/client/authErrors";
import { PedroButton, PedroCard, PedroInput } from "@/components/pedro";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PedroCard padding="lg">
      <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
      <p className="mt-1.5 text-sm text-text-muted">We&apos;ll email you a link to choose a new one.</p>

      {sent ? (
        <p className="mt-6 text-sm">
          If an account exists for <strong>{email}</strong>, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <PedroInput
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}
          <PedroButton type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            Send reset link
          </PedroButton>
        </form>
      )}

      <p className="mt-5 text-sm text-text-muted">
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Back to sign in
        </Link>
      </p>
    </PedroCard>
  );
}
