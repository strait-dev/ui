"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for the {@link Badge}.
 *
 * Exposes three axes:
 * - `variant` — colour and emphasis. Solid fills (`default`, `info`,
 *   `success`, `warning`, `destructive`, `invert`, `secondary`), tinted
 *   light fills (`*-light`, including `brand-light`), and bordered outlines
 *   (`*-outline`, including `brand-outline`) whose borders are tinted with
 *   the intent colour at `/30` to match {@link Button}'s outline weights,
 *   plus the low-emphasis `ghost` and `link` options.
 * - `size` — height/padding presets from `xs` through `xl`.
 * - `radius` — `lg` (default, rounded-lg square), `pill` (full-pill opt-in),
 *   `md` (rounded-md), or `sm` (subtle 4 px). Use `md` for tag chips inside
 *   data tables; use `pill` for fully circular badges.
 *
 * Exported so consumers can apply the same visual style to non-`<span>`
 * elements without deriving the class list manually.
 */
const badgeVariants = cva(
  "relative inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap border border-transparent font-medium outline-none transition-shadow focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*=size-])]:size-3 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      radius: {
        lg: "rounded-lg",
        pill: "rounded-4xl",
        md: "rounded-md",
        sm: "rounded-sm",
      },
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border-border bg-transparent dark:bg-input/30",
        secondary: "bg-secondary text-secondary-foreground",
        info: "bg-info text-info-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        invert: "bg-invert text-invert-foreground",
        "primary-light":
          "border-none bg-primary/10 text-primary dark:bg-primary/20",
        "brand-light":
          "border-none bg-brand/10 text-brand-accent dark:bg-brand/20",
        "warning-light":
          "border-none bg-warning/10 text-warning-accent dark:bg-warning/20",
        "success-light":
          "border-none bg-success/10 text-success-accent dark:bg-success/20",
        "info-light": "border-none bg-info/10 text-info-accent dark:bg-info/20",
        "destructive-light":
          "border-none bg-destructive/10 text-destructive-accent dark:bg-destructive/20",
        "invert-light":
          "border-none bg-invert/10 text-foreground dark:bg-invert/20",
        "secondary-light":
          "border-none bg-secondary/50 text-secondary-foreground dark:bg-secondary/30",
        "primary-outline":
          "border-primary/30 bg-background text-primary dark:bg-input/30",
        "brand-outline":
          "border-brand/30 bg-background text-brand-accent dark:bg-input/30",
        "warning-outline":
          "border-warning/30 bg-background text-warning-accent dark:bg-input/30",
        "success-outline":
          "border-success/30 bg-background text-success-accent dark:bg-input/30",
        "info-outline":
          "border-info/30 bg-background text-info-accent dark:bg-input/30",
        "destructive-outline":
          "border-destructive/30 bg-background text-destructive-accent dark:bg-input/30",
        "invert-outline":
          "border-invert/30 bg-background text-foreground dark:bg-input/30",
        "secondary-outline":
          "border-secondary bg-background text-secondary-foreground dark:border-secondary/60 dark:bg-input/30",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-4 min-w-4 gap-1 px-1 py-0.25 text-micro leading-none",
        sm: "h-4.5 min-w-4.5 gap-1 px-1 py-0.25 text-micro leading-none",
        default: "h-5 min-w-5 gap-1 px-1.25 py-0.5 text-xs",
        lg: "h-5.5 min-w-5.5 gap-1 px-1.5 py-0.5 text-xs",
        xl: "h-6 min-w-6 gap-1.5 px-2 py-0.75 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "lg",
    },
  }
);

/**
 * Props for {@link Badge}.
 *
 * Extends Base UI's `useRender` component props so the underlying element
 * can be swapped via the `render` prop (e.g. render as a `<button>` or a
 * framework `<Link>`).
 */
interface BadgeProps extends useRender.ComponentProps<"span"> {
  /**
   * When `true`, appends a dismiss `<button>` containing {@link Cancel01Icon}.
   *
   * Clicking fires {@link BadgeProps.onDismiss} and stops event propagation so
   * parent click handlers are not triggered.
   *
   * @remarks
   * Do **not** combine `dismissible` with `render`-as-`<button>` — nested
   * `<button>` elements are invalid HTML and cause accessibility failures.
   */
  dismissible?: boolean;
  /**
   * When `true`, prepends a small leading dot before children (and before
   * `iconLeft`). The dot colour tracks `currentColor` (`bg-current`) so it
   * inherits the variant's text colour automatically.
   *
   * Pair with {@link BadgeProps.dotClassName} to override the dot colour.
   */
  dot?: boolean;
  /** Extra Tailwind classes merged onto the leading dot `<span>`. */
  dotClassName?: string;
  /**
   * Icon rendered immediately before children.
   *
   * Accepts a `IconSvgElement` from `@hugeicons/core-free-icons`.
   * The icon is sized to `size-3` (12 × 12 px).
   */
  iconLeft?: IconSvgElement;
  /**
   * Icon rendered immediately after children.
   *
   * Accepts a `IconSvgElement` from `@hugeicons/core-free-icons`.
   * The icon is sized to `size-3` (12 × 12 px).
   */
  iconRight?: IconSvgElement;
  /**
   * When `true`, applies `font-mono uppercase tracking-wide` for monospaced
   * label styling — useful for version numbers, codes, or IDs.
   */
  mono?: boolean;
  /** Called when the dismiss button is clicked. */
  onDismiss?: () => void;
  /**
   * Corner radius preset applied via {@link badgeVariants}.
   * `"lg"` (default, rounded-lg) · `"pill"` (full-pill opt-in) · `"md"` (rounded-md) ·
   * `"sm"` (subtle 4 px). Use `"md"` for tag-style chips inside data tables;
   * use `"pill"` for fully circular badges.
   */
  radius?: VariantProps<typeof badgeVariants>["radius"];
  /**
   * Size preset applied via {@link badgeVariants}.
   * `"xs"` through `"xl"`; controls height, padding, and font size.
   */
  size?: VariantProps<typeof badgeVariants>["size"];
  /**
   * Colour and emphasis style applied via {@link badgeVariants}.
   * Includes solid fills, tinted `*-light` fills, bordered `*-outline`
   * variants, `ghost`, and `link`.
   */
  variant?: VariantProps<typeof badgeVariants>["variant"];
}

/**
 * Small status label used to categorise, tag, or annotate content.
 *
 * Rendered as a `<span>` by default; swap the underlying element with the
 * `render` prop when interactive behaviour (e.g. a link or button) is
 * needed. Styling is controlled by {@link badgeVariants} via `variant` and
 * `size`.
 *
 * @remarks
 * - The full range of semantic colours is available through the `variant`
 *   prop: solid fills, tinted `*-light` fills, and bordered `*-outline`
 *   options (including the new `secondary-outline`).
 * - When rendered as an interactive element the badge gains a visible
 *   focus ring via `focus-visible:ring-3`.
 * - Embedded SVG icons are automatically sized to 12 × 12.
 * - Use `iconLeft` / `iconRight` for icons without wrapping them in a
 *   fragment — they go through `HugeiconsIcon` internally.
 * - `dismissible` should **not** be combined with `render`-as-`<button>`:
 *   nesting `<button>` inside `<button>` is invalid HTML.
 *
 * @example
 * ```tsx
 * <Badge variant="success-light">Active</Badge>
 * <Badge variant="destructive" size="sm">Error</Badge>
 * <Badge variant="outline" render={<a href="/tags/design" />}>
 *   Design
 * </Badge>
 * <Badge variant="info-light" iconLeft={InformationCircleIcon} dismissible onDismiss={() => setOpen(false)}>
 *   Info
 * </Badge>
 * <Badge variant="secondary" dot mono>v1.2.3</Badge>
 * ```
 */
function Badge({
  className,
  variant,
  size,
  radius,
  render,
  children,
  iconLeft,
  iconRight,
  dot,
  dotClassName,
  dismissible,
  onDismiss,
  mono,
  ...props
}: BadgeProps) {
  const content = (
    <>
      {dot ? (
        <span
          aria-hidden
          className={cn(
            "size-1.5 shrink-0 rounded-full bg-current",
            dotClassName
          )}
          data-slot="badge-dot"
        />
      ) : null}
      {iconLeft ? <HugeiconsIcon className="size-3" icon={iconLeft} /> : null}
      {children}
      {iconRight ? <HugeiconsIcon className="size-3" icon={iconRight} /> : null}
      {dismissible ? (
        <button
          aria-label="Dismiss"
          className="-mr-0.5 ml-0.5 inline-flex items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          data-slot="badge-dismiss"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          type="button"
        >
          <HugeiconsIcon className="size-3" icon={Cancel01Icon} />
        </button>
      ) : null}
    </>
  );

  const defaultProps = {
    "data-slot": "badge",
    className: cn(
      badgeVariants({ variant, size, radius }),
      mono && "font-mono uppercase tracking-wide",
      className
    ),
  };

  // useRender lets the badge adopt any element while keeping its styles
  return useRender({
    defaultTagName: "span",
    render,
    props: mergeProps<"span">(defaultProps, { ...props, children: content }),
  });
}

export { Badge, type BadgeProps, badgeVariants };
