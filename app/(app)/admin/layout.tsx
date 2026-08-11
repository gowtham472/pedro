"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { PedroShell } from "@/components/pedro";
import { useAuth } from "@/lib/client/useAuth";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/domains", label: "Domains" },
  { href: "/admin/lessons", label: "Lessons" },
  { href: "/admin/tasks", label: "Tasks" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/scoring", label: "Scoring" },
  { href: "/admin/audit", label: "Audit log" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && profile && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [loading, profile, isAdmin, router]);

  if (loading || !isAdmin) {
    return (
      <PedroShell>
        <div className="h-64 animate-pulse rounded-pd-lg bg-surface" />
      </PedroShell>
    );
  }

  return (
    <PedroShell>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Admin</h1>
      <nav className="mt-6 flex gap-1 overflow-x-auto rounded-pd-pill bg-surface p-1 border border-border-subtle w-fit">
        {TABS.map((tab) => {
          const active = tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                "shrink-0 rounded-pd-pill px-4 py-2 text-sm font-medium transition-colors",
                active ? "bg-pd-mint text-pd-charcoal" : "text-text-secondary hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6">{children}</div>
    </PedroShell>
  );
}
