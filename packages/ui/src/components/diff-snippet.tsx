"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../utils/index";
import { CopyButton } from "./copy-button";

/** The semantic role of a line in a {@link DiffSnippet}. */
type DiffSnippetLineType = "add" | "remove" | "context";

/** One rendered row in a {@link DiffSnippet}. */
type DiffSnippetLine = {
  /** Whether the row represents added, removed, or unchanged context code. */
  type: DiffSnippetLineType;
  /** The code text for the row, without a leading diff marker. */
  content: string;
};

/** CVA recipe for the {@link DiffSnippet} root. */
const diffSnippetVariants = cva(
  "overflow-hidden rounded-lg border bg-card font-mono shadow-sm",
  {
    variants: {
      /** Density preset for the snippet chrome and rows. */
      size: {
        sm: "text-xs",
        default: "text-xs",
        lg: "text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const lineClasses: Record<DiffSnippetLineType, string> = {
  add: "bg-success/10 text-success-accent",
  remove: "bg-destructive/10 text-destructive-accent",
  context: "text-muted-foreground",
};

const markerMap: Record<DiffSnippetLineType, string> = {
  add: "+",
  remove: "-",
  context: " ",
};

const rowPaddingClasses: Record<
  NonNullable<DiffSnippetProps["size"]>,
  string
> = {
  sm: "px-2 py-0.5",
  default: "px-3 py-1",
  lg: "px-3.5 py-1.5",
};

/** Props for {@link DiffSnippet}. */
type DiffSnippetProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof diffSnippetVariants> & {
    /** Ordered diff rows to render. */
    lines: DiffSnippetLine[];
    /** Optional filename shown in the header. */
    filename?: string;
    /** Optional language label shown in the header. */
    language?: string;
    /** Whether to show a clipboard button for the diff text. */
    copyable?: boolean;
    /** Whether to render a numbered gutter beside each row. */
    showLineNumbers?: boolean;
  };

/**
 * Compact, read-only code-diff display for release notes, examples, and docs.
 *
 * `DiffSnippet` renders semantic added, removed, and context rows using the
 * success/destructive token families rather than raw palette colours. The
 * optional header can show a filename, language label, and clipboard action,
 * while the optional gutter adds line numbers without becoming part of the
 * copied text.
 *
 * @remarks
 * - Pass row content without the leading `+`/`-`; markers are generated from
 *   `line.type` so visual state and copied text stay consistent.
 * - The copied payload includes diff markers, making it suitable for pasting
 *   into reviews or documentation.
 * - Use `aria-label` when multiple snippets appear on the same page and need a
 *   more specific accessible name.
 *
 * @example
 * ```tsx
 * <DiffSnippet
 *   filename="greet.ts"
 *   language="ts"
 *   showLineNumbers
 *   lines={[
 *     { type: "context", content: "function greet(name) {" },
 *     { type: "remove", content: "  return 'Hi ' + name;" },
 *     { type: "add", content: "  return `Hello, ${name}!`;" },
 *     { type: "context", content: "}" },
 *   ]}
 * />
 * ```
 */
function DiffSnippet({
  lines,
  filename,
  language,
  copyable = true,
  showLineNumbers = false,
  size = "default",
  className,
  "aria-label": ariaLabel = "Code diff",
  ...props
}: DiffSnippetProps) {
  const copyText = lines
    .map((line) => `${markerMap[line.type]} ${line.content}`)
    .join("\n");
  const showHeader = Boolean(filename || language || copyable);
  const rowPadding = rowPaddingClasses[size ?? "default"];

  return (
    <section
      aria-label={ariaLabel}
      className={cn(diffSnippetVariants({ size }), className)}
      data-slot="diff-snippet"
      {...props}
    >
      {showHeader && (
        <div
          className="flex min-h-8 items-center justify-between gap-3 border-b px-3 py-1.5"
          data-slot="diff-snippet-header"
        >
          <div className="flex min-w-0 items-center gap-2">
            {filename && (
              <span
                className="truncate font-medium text-foreground"
                data-slot="diff-snippet-filename"
              >
                {filename}
              </span>
            )}
            {language && (
              <span
                className="shrink-0 text-muted-foreground uppercase"
                data-slot="diff-snippet-language"
              >
                {language}
              </span>
            )}
          </div>
          {copyable && <CopyButton aria-label="Copy diff" text={copyText} />}
        </div>
      )}

      <pre
        className="m-0 overflow-x-auto bg-transparent p-0 leading-relaxed"
        data-slot="diff-snippet-body"
      >
        <code className="block min-w-max" data-slot="diff-snippet-code">
          {lines.map((line, index) => (
            <span
              className={cn("flex gap-3", rowPadding, lineClasses[line.type])}
              data-slot="diff-snippet-line"
              data-type={line.type}
              // biome-ignore lint/suspicious/noArrayIndexKey: diff rows are positional
              key={`${line.type}-${index}`}
            >
              {showLineNumbers && (
                <span
                  aria-hidden="true"
                  className="w-6 shrink-0 select-none text-right text-muted-foreground/60 tabular-nums"
                  data-slot="diff-snippet-line-number"
                >
                  {index + 1}
                </span>
              )}
              <span
                aria-hidden="true"
                className="w-3 shrink-0 select-none"
                data-slot="diff-snippet-marker"
              >
                {markerMap[line.type]}
              </span>
              <span data-slot="diff-snippet-content">{line.content}</span>
            </span>
          ))}
        </code>
      </pre>
    </section>
  );
}

export {
  DiffSnippet,
  type DiffSnippetLine,
  type DiffSnippetLineType,
  type DiffSnippetProps,
  diffSnippetVariants,
};
