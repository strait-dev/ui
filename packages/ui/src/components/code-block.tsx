import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/index";
import { CopyButton } from "./copy-button";

/**
 * Class-variance-authority recipe for the {@link CodeBlock} root element.
 *
 * Exposes one axis:
 * - `variant` — surface treatment.
 *   - `default` — the original muted surface (`bg-muted` with a `border`).
 *   - `dark` — forces a dark surface (`bg-neutral-950 text-neutral-50`)
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
      dark: "bg-neutral-950 text-neutral-50",
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
  /** Optional language label shown in the top bar (e.g. `"tsx"`, `"bash"`). */
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
 * Read-only code display surface with an optional language label, line
 * numbers, and a clipboard copy button.
 *
 * Renders plain text — no syntax-highlighting dependency is used. Wrap it in
 * a `<figure>` with a `<figcaption>` when a visible caption is needed.
 *
 * The surface appearance is controlled by the `variant` prop:
 * - `default` — muted surface with border (original).
 * - `dark` — forced dark surface for terminal-style snippets.
 * - `transparent` — no background or border; blends into any container.
 *
 * @remarks
 * - The top bar is only rendered when `language` is provided or `copyable` is
 *   not `false`; if neither applies, the `<pre>` fills the full container.
 * - When `showLineNumbers` is `true` the body switches to a two-column CSS
 *   grid: a `select-none` gutter on the left and the code on the right, so
 *   copy-pasting the code omits line numbers.
 * - Pass `maxHeight` to make long snippets scrollable; the container clips at
 *   that height and the `<pre>` scrolls internally.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   language="tsx"
 *   showLineNumbers
 *   code={`function greet(name: string) {\n  return \`Hello, \${name}!\`;\n}`}
 * />
 *
 * // Dark surface — great for terminal-style output
 * <CodeBlock variant="dark" language="bash" code="npm install @strait/ui" />
 *
 * // Transparent — blends into a custom card surface
 * <CodeBlock variant="transparent" code={snippet} />
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

  let maxHeightStyle: string | undefined;
  if (maxHeight !== undefined) {
    maxHeightStyle =
      typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;
  }

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
          className={cn("overflow-auto p-3 font-mono text-xs leading-relaxed")}
          style={maxHeightStyle ? { maxHeight: maxHeightStyle } : undefined}
        >
          <div className="grid grid-cols-[auto_1fr] gap-x-4">
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
            <pre
              className={cn(
                "m-0 border-0 bg-transparent p-0",
                wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"
              )}
            >
              {code}
            </pre>
          </div>
        </div>
      ) : (
        <pre
          className={cn(
            "overflow-auto p-3 font-mono text-xs leading-relaxed",
            wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre"
          )}
          style={maxHeightStyle ? { maxHeight: maxHeightStyle } : undefined}
        >
          {code}
        </pre>
      )}
    </div>
  );
}

export { CodeBlock, type CodeBlockProps, codeBlockVariants };
