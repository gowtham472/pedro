"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { establishSession } from "@/lib/client/useAuth";
import { friendlyAuthError } from "@/lib/client/authErrors";
import { PedroButton, PedroCard, PedroInput } from "@/components/pedro";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await establishSession(credential.user);
      router.push("/dashboard");
    } catch (err) {
      setError(friendlyAuthError(err));
      setLoading(false);
    }
  }

  return (
    <PedroCard padding="lg">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-sm text-text-muted">Sign in to continue your exploration.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}
        <PedroButton type="submit" loading={loading} fullWidth size="lg" className="mt-2">
          Sign in
        </PedroButton>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-text-secondary hover:text-foreground">
          Forgot password?
        </Link>
        <Link href="/register" className="font-medium text-foreground hover:underline">
          Create an account
        </Link>
      </div>
    </PedroCard>
  );
}
