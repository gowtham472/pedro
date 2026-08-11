"use client";

import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { HighlightStyle, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { EditorView } from "@codemirror/view";
import type { CodeLanguage } from "@/types/content";

// A real code editor (CodeMirror 6) in place of a plain textarea: syntax
// highlighting per language, line numbers, bracket matching/auto-close,
// smart indent, and a theme built entirely from Pedro's existing CSS
// variables - so it re-themes with the app's light/dark toggle for free,
// the same way every other surface in the app does.

const LANGUAGE_EXTENSIONS: Record<CodeLanguage, () => import("@codemirror/state").Extension> = {
  javascript: () => javascript(),
  python: () => python(),
  java: () => java(),
  c: () => cpp(),
};

const INDENT_UNIT: Record<CodeLanguage, string> = {
  javascript: "  ",
  python: "    ",
  java: "  ",
  c: "  ",
};

// Token colors mapped onto Pedro's brand palette rather than a generic
// editor scheme, so the editor reads as part of the product, not a bolted-on
// third-party widget.
const highlightStyle = HighlightStyle.define([
  { tag: t.comment, color: "var(--text-muted)", fontStyle: "italic" },
  { tag: [t.keyword, t.controlKeyword, t.moduleKeyword], color: "var(--pd-cyan)" },
  { tag: [t.string, t.special(t.string)], color: "var(--pd-cream)" },
  { tag: [t.number, t.bool, t.null], color: "var(--pd-mint-strong)" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "var(--pd-cyan)" },
  { tag: [t.definition(t.variableName), t.definition(t.propertyName)], color: "var(--foreground)" },
  { tag: t.typeName, color: "var(--pd-mint-strong)" },
  { tag: t.className, color: "var(--pd-mint-strong)" },
  { tag: t.operator, color: "var(--text-secondary)" },
  { tag: t.punctuation, color: "var(--text-secondary)" },
  { tag: t.variableName, color: "var(--foreground)" },
  { tag: t.propertyName, color: "var(--pd-cream)" },
  { tag: t.invalid, color: "#f2a09b" },
]);

const theme = EditorView.theme({
  "&": {
    color: "var(--foreground)",
    backgroundColor: "var(--surface-deep)",
    fontSize: "13.5px",
    height: "20rem",
    borderRadius: "var(--pd-radius-md)",
    border: "1px solid var(--border-subtle)",
  },
  "&.cm-focused": {
    outline: "none",
    borderColor: "var(--pd-mint)",
    boxShadow: "0 0 0 2px color-mix(in srgb, var(--pd-mint) 30%, transparent)",
  },
  ".cm-content": {
    fontFamily: "ui-monospace, 'Cascadia Code', Menlo, monospace",
    caretColor: "var(--pd-mint)",
    padding: "12px 0",
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--pd-mint)" },
  "&.cm-editor": { borderRadius: "var(--pd-radius-md)" },
  ".cm-scroller": { overflow: "auto", borderRadius: "var(--pd-radius-md)" },
  ".cm-gutters": {
    backgroundColor: "var(--surface-deep)",
    color: "var(--text-muted)",
    border: "none",
    borderRight: "1px solid var(--border-subtle)",
  },
  ".cm-activeLine": { backgroundColor: "color-mix(in srgb, var(--pd-mint) 6%, transparent)" },
  ".cm-activeLineGutter": {
    backgroundColor: "color-mix(in srgb, var(--pd-mint) 10%, transparent)",
    color: "var(--foreground)",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "color-mix(in srgb, var(--pd-mint) 25%, transparent) !important",
  },
  ".cm-matchingBracket, .cm-nonmatchingBracket": {
    backgroundColor: "color-mix(in srgb, var(--pd-cyan) 30%, transparent)",
    outline: "none",
  },
  ".cm-tooltip": {
    backgroundColor: "var(--surface-elevated)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--pd-radius-sm)",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: "var(--pd-mint)",
    color: "var(--pd-charcoal)",
  },
});

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: CodeLanguage;
  ariaLabel?: string;
}

export function CodeEditor({ value, onChange, language, ariaLabel }: CodeEditorProps) {
  const extensions = useMemo(
    () => [LANGUAGE_EXTENSIONS[language](), indentUnit.of(INDENT_UNIT[language]), syntaxHighlighting(highlightStyle), theme],
    [language]
  );

  return (
    <div aria-label={ariaLabel} role="group">
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme="none"
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          indentOnInput: true,
          tabSize: language === "python" ? 4 : 2,
        }}
        indentWithTab
        spellCheck={false}
      />
    </div>
  );
}
