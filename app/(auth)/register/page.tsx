"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { establishSession } from "@/lib/client/useAuth";
import { friendlyAuthError } from "@/lib/client/authErrors";
import { PedroButton, PedroCard, PedroInput } from "@/components/pedro";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name.trim() || email.split("@")[0] });
      await establishSession(credential.user, true);
      router.push("/onboarding");
    } catch (err) {
      setError(friendlyAuthError(err));
      setLoading(false);
    }
  }

  return (
    <PedroCard padding="lg">
      <h1 className="text-2xl font-semibold tracking-tight">You don&apos;t need to know your career yet</h1>
      <p className="mt-1.5 text-sm text-text-muted">
        Create an account and spend seven days exploring. We&apos;ll help you understand what fits you.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <PedroInput
          label="Name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <PedroInput
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PedroInput
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          hint="At least 8 characters."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}
        <PedroButton type="submit" loading={loading} fullWidth size="lg" className="mt-2">
          Create account
        </PedroButton>
      </form>

      <p className="mt-5 text-sm text-text-muted">
        Already exploring?{" "}
        <Link href="/login" className="font-medium text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </PedroCard>
  );
}
