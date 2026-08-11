import { Fragment } from "react";

/** Renders the small authored-markdown subset used in lesson sections and
 * task instructions: paragraphs, **bold**, `inline code`, and "- " bullet
 * lists. All content is authored by Pedro, never user-submitted, so this is
 * a formatting convenience rather than a sanitization boundary. */
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={key} className="rounded bg-surface-elevated px-1.5 py-0.5 font-mono text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

export function MarkdownLite({ text, className }: { text: string; className?: string }) {
  const blocks = text.trim().split(/\n\n+/);
  return (
    <div className={className}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => /^[-*]\s+/.test(l.trim()));
        if (isList) {
          return (
            <ul key={blockIndex} className="my-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {lines.map((line, i) => (
                <li key={i}>{renderInline(line.trim().replace(/^[-*]\s+/, ""), `${blockIndex}-${i}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={blockIndex} className="my-3 text-sm leading-relaxed first:mt-0 last:mb-0">
            {lines.map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {renderInline(line, `${blockIndex}-${i}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
