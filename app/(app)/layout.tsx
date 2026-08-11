"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/client/useAuth";
import { PedroNav } from "@/components/pedro";
import { PedroLogo } from "@/components/pedro/PedroLogo";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <PedroLogo size={40} className="animate-pulse text-pd-mint" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PedroNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
