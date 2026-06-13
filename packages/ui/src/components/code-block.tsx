"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import type { BundledLanguage, Highlighter, ThemeRegistrationRaw } from "shiki";
import { cn } from "../utils/index";
import { CopyButton } from "./copy-button";

// #region Shiki theme + highlighter ----------------------------------------

/**
 * Strait's bespoke **light** syntax theme. Token colours are drawn from the
 * design-system palette (warm neutrals + the signature orange accent) and the
 * background is left transparent so the {@link CodeBlock} `variant` surface
 * shows through.
 */
const STRAIT_LIGHT: ThemeRegistrationRaw = {
  name: "strait-light",
  type: "light",
  bg: "#00000000",
  fg: "#1c1917",
  settings: [
    { settings: { background: "#00000000", foreground: "#1c1917" } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#79716b", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.expression",
        "variable.language",
      ],
      settings: { foreground: "#c2410c" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "constant.other.symbol",
        "meta.embedded.line",
      ],
      settings: { foreground: "#15803d" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call.generic",
      ],
      settings: { foreground: "#1d4ed8" },
    },
    {
      scope: [
        "constant.numeric",
        "constant.language",
        "constant.character",
        "constant.other",
      ],
      settings: { foreground: "#b45309" },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "support.type",
        "support.class",
        "entity.other.inherited-class",
      ],
      settings: { foreground: "#0e7490" },
    },
    {
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: { foreground: "#c2410c" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#b45309" },
    },
    {
      scope: ["keyword.operator", "punctuation"],
      settings: { foreground: "#78716c" },
    },
  ],
};

/**
 * Strait's bespoke **dark** syntax theme — the dark-mode counterpart to
 * {@link STRAIT_LIGHT}, using brighter palette steps tuned for dark surfaces.
 */
const STRAIT_DARK: ThemeRegistrationRaw = {
  name: "strait-dark",
  type: "dark",
  bg: "#00000000",
  fg: "#e7e5e4",
  settings: [
    { settings: { background: "#00000000", foreground: "#e7e5e4" } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#a8a29e", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.expression",
        "variable.language",
      ],
      settings: { foreground: "#fb923c" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "constant.other.symbol",
        "meta.embedded.line",
      ],
      settings: { foreground: "#4ade80" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call.generic",
      ],
      settings: { foreground: "#60a5fa" },
    },
    {
      scope: [
        "constant.numeric",
        "constant.language",
        "constant.character",
        "constant.other",
      ],
      settings: { foreground: "#fbbf24" },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "support.type",
        "support.class",
        "entity.other.inherited-class",
      ],
      settings: { foreground: "#22d3ee" },
    },
    {
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: { foreground: "#fb923c" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#fbbf24" },
    },
    {
      scope: ["keyword.operator", "punctuation"],
      settings: { foreground: "#a8a29e" },
    },
  ],
};

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Lazily creates (and memoises) a single Shiki highlighter pre-loaded with the
 * Strait themes. Languages are loaded on demand in {@link highlightToHtml}, so
 * the initial instance stays light. `shiki` is imported dynamically so it never
 * blocks module evaluation (e.g. in SSR or test environments).
 */
function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then((shiki) =>
      shiki.createHighlighter({
        themes: [STRAIT_LIGHT, STRAIT_DARK],
        langs: [],
      })
    );
  }
  return highlighterPromise;
}

/**
 * Highlights `code` to dual-theme HTML. Resolves the grammar lazily, falling
 * back to plain text for unknown languages. Returns markup carrying both
 * `--shiki-light`/`--shiki-dark` CSS variables (wired up in `globals.css`).
 */
async function highlightToHtml(
  code: string,
  language: string | undefined,
  wrap: boolean
): Promise<string> {
  const highlighter = await getHighlighter();

  let lang = (language ?? "text").toLowerCase().trim();
  if (lang && lang !== "text" && lang !== "plaintext" && lang !== "plain") {
    if (!highlighter.getLoadedLanguages().includes(lang)) {
      try {
        await highlighter.loadLanguage(lang as BundledLanguage);
      } catch {
        lang = "text";
      }
    }
  } else {
    lang = "text";
  }

  return highlighter.codeToHtml(code, {
    lang,
    themes: { light: "strait-light", dark: "strait-dark" },
    defaultColor: false,
    transformers: [
      {
        pre(node) {
          this.addClassToHast(node, "strait-shiki");
          if (wrap) {
            this.addClassToHast(node, "wrap");
          }
        },
      },
    ],
  });
}

// #endregion

/**
 * Class-variance-authority recipe for the {@link CodeBlock} root element.
 *
 * Exposes one axis:
 * - `variant` — surface treatment.
 *   - `default` — the original muted surface (`bg-muted` with a `border`).
 *   - `dark` — forces the terminal surface tokens regardless of theme
 *     regardless of the active colour scheme, useful for terminal-style
 *     snippets or when the surrounding UI is already light.
 *   - `transparent` — removes the background and border entirely, letting
 *     the code area blend into any container.
 *
 * Exported so consumers can apply the same surface to a custom wrapper.
 */
const codeBlockVariants = cva("overflow-hidden rounded-lg", {
  variants: {
    /**
     * Surface colour treatment for the root container.
     *
     * - `default` — muted background with border (original appearance).
     * - `dark` — forced dark surface; always dark regardless of theme.
     * - `transparent` — no background, no border; blends into the page.
     */
    variant: {
      default: "border bg-muted",
      dark: "bg-surface-terminal text-surface-terminal-foreground",
      transparent: "bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * Props for {@link CodeBlock}.
 */
interface CodeBlockProps extends VariantProps<typeof codeBlockVariants> {
  /** Additional class names applied to the root element. */
  className?: string;
  /** The source code string to display. */
  code: string;
  /**
   * When `true` (the default) a {@link CopyButton} appears in the top bar.
   * Pass `false` to suppress it.
   */
  copyable?: boolean;
  /**
   * Language used both for the top-bar label and Shiki syntax highlighting
   * (e.g. `"tsx"`, `"ruby"`, `"go"`, `"bash"`). Unknown languages fall back to
   * plain text. Omit to render unhighlighted text.
   */
  language?: string;
  /**
   * Constrains the code body height. Accepts any CSS `max-height` value
   * (e.g. `400`, `"50vh"`). A numeric value is treated as pixels.
   */
  maxHeight?: number | string;
  /** When `true`, a numbered gutter is rendered to the left of each line. */
  showLineNumbers?: boolean;
  /**
   * When `true`, long lines wrap and break at word boundaries instead of
   * scrolling horizontally.
   */
  wrap?: boolean;
}

/**
 * Read-only code display surface with Shiki-powered syntax highlighting, an
 * optional language label, line numbers, and a clipboard copy button.
 *
 * Highlighting is themed with Strait's bespoke light/dark syntax palette and
 * any Shiki-supported language is accepted via the `language` prop. The code is
 * highlighted asynchronously: a plain-text rendering is shown first and is
 * swapped for the highlighted markup once Shiki resolves, so the component is
 * safe for SSR and renders instantly. Unknown languages degrade to plain text.
 *
 * The surface appearance is controlled by the `variant` prop:
 * - `default` — muted surface with border (original).
 * - `dark` — forced dark surface for terminal-style snippets.
 * - `transparent` — no background or border; blends into any container.
 *
 * @remarks
 * - The top bar is only rendered when `language` is provided or `copyable` is
 *   not `false`; if neither applies, the body fills the full container.
 * - When `showLineNumbers` is `true` the body switches to a two-column layout:
 *   a `select-none` gutter on the left and the code on the right, so
 *   copy-pasting the code omits line numbers.
 * - Pass `maxHeight` to make long snippets scrollable; the container clips at
 *   that height and the body scrolls internally.
 * - Syntax colours are wired through the `.strait-shiki` rules in
 *   `globals.css`; the highlighted background is intentionally transparent so
 *   the `variant` surface remains visible.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   language="tsx"
 *   showLineNumbers
 *   code={`function greet(name: string) {\n  return \`Hello, \${name}!\`;\n}`}
 * />
 *
 * // Any language Shiki supports
 * <CodeBlock language="ruby" code={`puts "Hello, #{name}!"`} />
 *
 * // Dark surface — great for terminal-style output
 * <CodeBlock variant="dark" language="bash" code="npm install @strait/ui" />
 * ```
 */
function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  copyable = true,
  maxHeight,
  wrap = false,
  variant,
  className,
}: CodeBlockProps) {
  const showTopBar = Boolean(language) || copyable;
  const lines = code.split("\n");

  const [html, setHtml] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    setHtml(null);
    highlightToHtml(code, language, wrap)
      .then((result) => {
        if (active) {
          setHtml(result);
        }
      })
      .catch(() => {
        if (active) {
          setHtml(null);
        }
      });
    return () => {
      active = false;
    };
  }, [code, language, wrap]);

  let maxHeightStyle: string | undefined;
  if (maxHeight !== undefined) {
    maxHeightStyle =
      typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  }

  const bodyClass = "overflow-auto p-3 text-xs leading-relaxed";
  const preWrapClass = wrap
    ? "whitespace-pre-wrap break-all"
    : "whitespace-pre";

  return (
    <div
      className={cn(codeBlockVariants({ variant }), className)}
      data-slot="code-block"
    >
      {showTopBar && (
        <div className="flex items-center justify-between border-b px-3 py-1.5">
          {language ? (
            <span className="font-mono text-muted-foreground text-xs">
              {language}
            </span>
          ) : (
            <span />
          )}
          {copyable && <CopyButton aria-label="Copy code" text={code} />}
        </div>
      )}

      {showLineNumbers ? (
        <div
          className={bodyClass}
          style={maxHeightStyle ? { maxHeight: maxHeightStyle } : undefined}
        >
          <div className="grid grid-cols-[auto_1fr] gap-x-4 font-mono">
            {/* Gutter */}
            <div
              aria-hidden="true"
              className="select-none text-right text-muted-foreground/60 tabular-nums"
            >
              {lines.map((_, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: line numbers are positional
                <div key={idx}>{idx + 1}</div>
              ))}
            </div>
            {/* Code column */}
            {html ? (
              <div
                className="min-w-0"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki-generated highlight markup
                dangerouslySetInnerHTML={{ __html: html }}
                data-slot="code-block-content"
              />
            ) : (
              <pre
                className={cn("m-0 border-0 bg-transparent p-0", preWrapClass)}
              >
                {code}
              </pre>
            )}
          </div>
        </div>
      ) : (
        renderBody({
          bodyClass,
          code,
          html,
          maxHeightStyle,
          preWrapClass,
        })
      )}
    </div>
  );
}

/**
 * Renders the non-line-numbered body: the highlighted markup once available,
 * or a plain `<pre>` fallback. Extracted to keep {@link CodeBlock} flat and
 * avoid a nested ternary in JSX.
 */
function renderBody({
  bodyClass,
  code,
  html,
  maxHeightStyle,
  preWrapClass,
}: {
  bodyClass: string;
  code: string;
  html: string | null;
  maxHeightStyle: string | undefined;
  preWrapClass: string;
}) {
  const style = maxHeightStyle ? { maxHeight: maxHeightStyle } : undefined;

  if (html) {
    return (
      <div
        className={cn(bodyClass, "font-mono")}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki-generated highlight markup
        dangerouslySetInnerHTML={{ __html: html }}
        data-slot="code-block-content"
        style={style}
      />
    );
  }

  return (
    <pre className={cn(bodyClass, "font-mono", preWrapClass)} style={style}>
      {code}
    </pre>
  );
}

export { CodeBlock, type CodeBlockProps, codeBlockVariants };
