"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../utils/index";
import { CopyButton } from "./copy-button";

/** The semantic role of a line in a {@link DiffSnippet}. */
type DiffSnippetLineType =
  | "add"
  | "remove"
  | "context"
  | "info"
  | "warning"
  | "error";

/** One rendered row in a {@link DiffSnippet}. */
type DiffSnippetLine = {
  /** Whether the row represents added, removed, unchanged, or annotated code. */
  type: DiffSnippetLineType;
  /** The code text for the row, without a leading diff marker. */
  content: string;
};

/** CVA recipe for the {@link DiffSnippet} root. */
const diffSnippetVariants = cva("overflow-hidden rounded-lg font-mono", {
  variants: {
    /** Surface treatment for the snippet chrome. */
    variant: {
      default: "border bg-card shadow-sm",
      muted: "border bg-muted/50 shadow-sm",
      terminal:
        "bg-surface-terminal text-surface-terminal-foreground shadow-sm",
      minimal: "border border-transparent bg-transparent shadow-none",
    },
    /** Density preset for the snippet chrome and rows. */
    size: {
      xs: "text-[0.6875rem]",
      sm: "text-xs",
      default: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const semanticLineClasses: Record<DiffSnippetLineType, string> = {
  add: "bg-success/10 text-success-accent",
  remove: "bg-destructive/10 text-destructive-accent",
  context: "text-muted-foreground",
  info: "bg-info/10 text-info-accent",
  warning: "bg-warning/10 text-warning-accent",
  error: "bg-destructive/10 text-destructive-accent",
};

const terminalLineClasses: Record<DiffSnippetLineType, string> = {
  add: "bg-success/10 text-success-accent",
  remove: "bg-destructive/10 text-destructive-accent",
  context: "text-surface-terminal-foreground/70",
  info: "bg-info/10 text-info-accent",
  warning: "bg-warning/10 text-warning-accent",
  error: "bg-destructive/10 text-destructive-accent",
};

const markerMap: Record<DiffSnippetLineType, string> = {
  add: "+",
  remove: "-",
  context: " ",
  info: "i",
  warning: "!",
  error: "!",
};

const rowPaddingClasses: Record<
  NonNullable<DiffSnippetProps["size"]>,
  string
> = {
  xs: "px-2 py-0.5",
  sm: "px-2.5 py-0.5",
  default: "px-3 py-1",
  lg: "px-3.5 py-1.5",
};

const headerPaddingClasses: Record<
  NonNullable<DiffSnippetProps["size"]>,
  string
> = {
  xs: "min-h-7 px-2 py-1",
  sm: "min-h-8 px-2.5 py-1.5",
  default: "min-h-8 px-3 py-1.5",
  lg: "min-h-9 px-3.5 py-2",
};

/** Props for {@link DiffSnippet}. */
type DiffSnippetProps = Omit<React.ComponentProps<"section">, "children"> &
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
    /** First value used by the numbered gutter. */
    lineNumberStart?: number;
    /** Whether to render generated diff markers. */
    showMarkers?: boolean;
    /** Whether semantic rows receive tinted backgrounds and intent text. */
    highlightChanges?: boolean;
    /** Whether long lines wrap instead of scrolling horizontally. */
    wrap?: boolean;
    /** Constrains the body height; numeric values are treated as pixels. */
    maxHeight?: number | string;
    /** Message rendered when `lines` is empty. */
    emptyMessage?: React.ReactNode;
  };

/**
 * Compact, read-only code-diff display for release notes, examples, and docs.
 *
 * `DiffSnippet` renders semantic added, removed, context, and annotation rows
 * using token-backed success, destructive, warning, and info styles. The
 * optional header can show a filename, language label, and clipboard action,
 * while the optional gutter adds line numbers without becoming part of the
 * copied text.
 *
 * @remarks
 * - Pass row content without the leading marker; markers are generated from
 *   `line.type` so visual state and copied text stay consistent.
 * - `variant="terminal"` uses the same terminal surface tokens as
 *   `CodeBlock`, while `muted` and `minimal` are useful for dense docs pages.
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
  lineNumberStart = 1,
  showMarkers = true,
  highlightChanges = true,
  wrap = false,
  maxHeight,
  emptyMessage = "No changes",
  variant = "default",
  size = "default",
  className,
  "aria-label": ariaLabel = "Code diff",
  ...props
}: DiffSnippetProps) {
  const copyText = formatDiffLines(lines, showMarkers);
  const showHeader = Boolean(filename || language || copyable);
  const bodyStyle = getMaxHeightStyle(maxHeight);
  const rowPadding = rowPaddingClasses[size ?? "default"];
  const headerPadding = headerPaddingClasses[size ?? "default"];

  return (
    <section
      aria-label={ariaLabel}
      className={cn(diffSnippetVariants({ variant, size }), className)}
      data-slot="diff-snippet"
      {...props}
    >
      {showHeader && (
        <div
          className={cn(
            "flex items-center justify-between gap-3 border-b",
            variant === "terminal" && "border-surface-terminal-foreground/10",
            variant === "minimal" && "border-transparent",
            headerPadding
          )}
          data-slot="diff-snippet-header"
        >
          <div className="flex min-w-0 items-center gap-2">
            {filename && (
              <span
                className={cn(
                  "truncate font-medium",
                  variant === "terminal"
                    ? "text-surface-terminal-foreground"
                    : "text-foreground"
                )}
                data-slot="diff-snippet-filename"
              >
                {filename}
              </span>
            )}
            {language && (
              <span
                className={cn(
                  "shrink-0 text-muted-foreground uppercase",
                  variant === "terminal" &&
                    "text-surface-terminal-foreground/60"
                )}
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
        className="m-0 overflow-auto bg-transparent p-0 leading-relaxed"
        data-slot="diff-snippet-body"
        style={bodyStyle}
      >
        <code
          className={cn(
            "block",
            wrap ? "min-w-0 whitespace-pre-wrap break-all" : "min-w-max"
          )}
          data-slot="diff-snippet-code"
        >
          {lines.length > 0 ? (
            lines.map((line, index) => (
              <span
                className={cn(
                  "flex gap-3",
                  rowPadding,
                  getLineClass(line.type, variant, highlightChanges)
                )}
                data-slot="diff-snippet-line"
                data-type={line.type}
                // biome-ignore lint/suspicious/noArrayIndexKey: diff rows are positional
                key={`${line.type}-${index}`}
              >
                {showLineNumbers && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "w-6 shrink-0 select-none text-right text-muted-foreground/60 tabular-nums",
                      variant === "terminal" &&
                        "text-surface-terminal-foreground/40"
                    )}
                    data-slot="diff-snippet-line-number"
                  >
                    {lineNumberStart + index}
                  </span>
                )}
                {showMarkers && (
                  <span
                    aria-hidden="true"
                    className="w-3 shrink-0 select-none"
                    data-slot="diff-snippet-marker"
                  >
                    {markerMap[line.type]}
                  </span>
                )}
                <span data-slot="diff-snippet-content">{line.content}</span>
              </span>
            ))
          ) : (
            <span
              className={cn(
                "block text-muted-foreground",
                rowPadding,
                variant === "terminal" && "text-surface-terminal-foreground/60"
              )}
              data-slot="diff-snippet-empty"
            >
              {emptyMessage}
            </span>
          )}
        </code>
      </pre>
    </section>
  );
}

function formatDiffLines(lines: DiffSnippetLine[], showMarkers: boolean) {
  return lines
    .map((line) =>
      showMarkers ? `${markerMap[line.type]} ${line.content}` : line.content
    )
    .join("\n");
}

function getLineClass(
  type: DiffSnippetLineType,
  variant: DiffSnippetProps["variant"],
  highlightChanges: boolean
) {
  if (!highlightChanges) {
    return variant === "terminal"
      ? "text-surface-terminal-foreground/70"
      : "text-muted-foreground";
  }

  return variant === "terminal"
    ? terminalLineClasses[type]
    : semanticLineClasses[type];
}

function getMaxHeightStyle(maxHeight: DiffSnippetProps["maxHeight"]) {
  if (maxHeight === undefined) {
    return;
  }

  return {
    maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
  };
}

export {
  DiffSnippet,
  type DiffSnippetLine,
  type DiffSnippetLineType,
  type DiffSnippetProps,
  diffSnippetVariants,
};
