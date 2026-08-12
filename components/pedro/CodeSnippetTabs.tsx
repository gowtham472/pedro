"use client";

import clsx from "clsx";
import { CODE_LANGUAGE_LABELS, useCodeLanguage } from "@/lib/client/useCodeLanguage";
import type { CodeLanguage, LessonCodeExample } from "@/types/content";

// Tabbed multi-language code example used inside lesson sections. The tab
// choice is the shared site-wide language preference (useCodeLanguage), so
// switching one snippet switches them all - and the task workspace opens in
// the same language the learner was just reading.

export function CodeSnippetTabs({ example }: { example: LessonCodeExample }) {
  const { language, setLanguage } = useCodeLanguage();
  const languages = Object.keys(example.code) as CodeLanguage[];
  const active = languages.includes(language) ? language : languages[0];

  return (
    <div className="my-4 overflow-hidden rounded-pd-md border border-border-subtle">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle bg-surface-elevated px-3 py-1.5">
        <p className="text-xs font-medium text-text-muted">{example.title ?? "Example"}</p>
        <div className="flex items-center" role="tablist" aria-label="Snippet language">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              role="tab"
              aria-selected={active === lang}
              onClick={() => setLanguage(lang)}
              className={clsx(
                "flex min-h-8 items-center rounded-pd-pill px-2.5 text-xs font-medium transition-colors",
                active === lang ? "bg-pd-mint text-pd-charcoal" : "text-text-muted hover:text-foreground"
              )}
            >
              {CODE_LANGUAGE_LABELS[lang]}
            </button>
          ))}
        </div>
      </div>
      <pre className="overflow-x-auto bg-surface-deep p-4 font-mono text-[13px] leading-relaxed">
        {example.code[active]}
      </pre>
    </div>
  );
}
