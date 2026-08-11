import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PedroButton, PedroCard, PedroShell, PedroWordmark } from "@/components/pedro";
import { DOMAIN_ICON_MAP, BuildIcon } from "@/components/pedro/icons/DomainIcons";
import { ALL_DOMAINS } from "@/lib/content";

const JOURNEY_ROWS = [
  ...ALL_DOMAINS.map((d) => ({ day: d.day, label: d.name, icon: DOMAIN_ICON_MAP[d.id] })),
  { day: 7, label: "Your Choice", icon: BuildIcon },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-6 sm:px-8">
        <PedroWordmark />
        <nav className="flex items-center gap-2">
          <Link href="/login">
            <PedroButton variant="tertiary" size="sm">
              Sign in
            </PedroButton>
          </Link>
          <Link href="/register">
            <PedroButton size="sm">Get started</PedroButton>
          </Link>
        </nav>
      </header>

      <PedroShell className="pt-8 sm:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-text-muted">
              You don&apos;t need to know what career you want yet
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Explore. Learn. Build.
              <br />
              Discover your path.
            </h1>
            <p className="mt-5 max-w-xl text-base text-text-secondary sm:text-lg">
              Spend seven days trying real tasks across six technology domains - programming, problem
              solving, design, data, cloud, and security. Pedro measures how you learn and perform, and
              produces a transparent, evidence-based exploration report.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/register">
                <PedroButton size="lg">
                  Start your seven days
                  <ArrowRight className="size-4" aria-hidden />
                </PedroButton>
              </Link>
              <Link href="/login">
                <PedroButton variant="secondary" size="lg">
                  I already have an account
                </PedroButton>
              </Link>
            </div>
            <p className="mt-6 text-xs text-text-muted">
              Pedro is an exploration tool, not a career predictor or aptitude test. You stay in control of
              what data is collected at every step.
            </p>
          </div>

          <PedroCard tone="deep" padding="lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-4">
              Your seven-day journey
            </p>
            <ol className="flex flex-col gap-1">
              {JOURNEY_ROWS.map((row) => (
                <li
                  key={row.day}
                  className="flex items-center gap-3 rounded-pd-md px-3 py-2.5 hover:bg-surface-elevated transition-colors"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pd-mint text-xs font-semibold text-pd-charcoal">
                    {row.day}
                  </span>
                  <row.icon className="size-4 text-text-muted" />
                  <span className="text-sm font-medium">{row.label}</span>
                </li>
              ))}
            </ol>
          </PedroCard>
        </div>

        <div className="mt-24 grid gap-6 sm:grid-cols-3">
          <PedroCard>
            <p className="text-sm font-semibold">Experience before recommendation</p>
            <p className="mt-2 text-sm text-text-secondary">
              You try the actual work of a domain before Pedro says anything about fit.
            </p>
          </PedroCard>
          <PedroCard>
            <p className="text-sm font-semibold">Performance isn&apos;t preference</p>
            <p className="mt-2 text-sm text-text-secondary">
              Doing well and enjoying it are measured separately - both matter.
            </p>
          </PedroCard>
          <PedroCard>
            <p className="text-sm font-semibold">Every recommendation explained</p>
            <p className="mt-2 text-sm text-text-secondary">
              No black box. Every result traces back to what you actually did.
            </p>
          </PedroCard>
        </div>
      </PedroShell>

      <footer className="mx-auto max-w-[1600px] px-4 py-10 text-xs text-text-muted sm:px-8">
        Pedro does not provide psychological assessment, IQ testing, or guaranteed career predictions.
      </footer>
    </div>
  );
}
