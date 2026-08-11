"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LayoutDashboard, Compass, BarChart3, ShieldCheck, Settings, LogOut, Sun, Moon, Zap } from "lucide-react";
import { PedroWordmark } from "./PedroLogo";
import { useAuth } from "@/lib/client/useAuth";
import { useTheme } from "@/lib/client/useTheme";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/journey", label: "Journey", icon: Compass },
  { href: "/results", label: "Results", icon: BarChart3 },
];

export function PedroNav() {
  const pathname = usePathname();
  const { profile, isAdmin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/dashboard" aria-label="Pedro home">
          <PedroWordmark />
        </Link>

        <ul className="hidden md:flex items-center gap-1 rounded-pd-pill bg-surface p-1 border border-border-subtle">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-2 rounded-pd-pill px-4 py-2 text-sm font-medium transition-colors",
                    active ? "bg-pd-mint text-pd-charcoal" : "text-text-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
          {isAdmin && (
            <li>
              <Link
                href="/admin"
                className={clsx(
                  "flex items-center gap-2 rounded-pd-pill px-4 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith("/admin") ? "bg-pd-mint text-pd-charcoal" : "text-text-secondary hover:text-foreground"
                )}
              >
                <ShieldCheck className="size-4" aria-hidden />
                Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="flex items-center gap-1.5">
          {typeof profile?.xp === "number" && (
            <span
              className="mr-1 flex items-center gap-1 rounded-pd-pill bg-pd-mint/20 px-2.5 py-1 text-xs font-semibold text-foreground"
              title="Experience points earned"
            >
              <Zap className="size-3.5 text-pd-mint" aria-hidden />
              {profile.xp.toLocaleString()} XP
            </span>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex size-9 items-center justify-center rounded-full text-text-secondary hover:bg-surface-elevated transition-colors"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
          </button>
          <Link
            href="/settings/privacy"
            className="flex size-9 items-center justify-center rounded-full text-text-secondary hover:bg-surface-elevated transition-colors"
            aria-label="Settings"
          >
            <Settings className="size-4" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="flex size-9 items-center justify-center rounded-full text-text-secondary hover:bg-surface-elevated transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
          <div
            className="ml-1 hidden sm:flex size-9 items-center justify-center rounded-full bg-pd-graphite text-sm font-semibold text-foreground"
            title={profile?.name}
            aria-hidden
          >
            {profile?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        </div>
      </nav>
      <div className="flex md:hidden items-center gap-1 overflow-x-auto px-4 pb-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex shrink-0 items-center gap-1.5 rounded-pd-pill px-3 py-1.5 text-xs font-medium",
                active ? "bg-pd-mint text-pd-charcoal" : "bg-surface text-text-secondary border border-border-subtle"
              )}
            >
              <item.icon className="size-3.5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className={clsx(
              "flex shrink-0 items-center gap-1.5 rounded-pd-pill px-3 py-1.5 text-xs font-medium",
              pathname.startsWith("/admin") ? "bg-pd-mint text-pd-charcoal" : "bg-surface text-text-secondary border border-border-subtle"
            )}
          >
            <ShieldCheck className="size-3.5" aria-hidden />
            Admin
          </Link>
        )}
      </div>
    </header>
  );
}
