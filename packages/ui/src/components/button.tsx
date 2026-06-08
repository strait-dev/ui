"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for the {@link Button}.
 *
 * Exposes two axes:
 * - `variant` — emphasis and intent. Each intent (brand, destructive, success,
 *   warning, info, invert) ships in three weights: `-solid` (filled), the bare
 *   name (tinted), and `-outline` (bordered). Neutral tones (`default`,
 *   `secondary`, `outline`, `secondary-outline`) plus the low-emphasis `ghost`
 *   and `link` round out the set.
 * - `size` — height/padding presets, including square `icon*` sizes for
 *   icon-only buttons.
 *
 * Exported so consumers can compose the same look onto non-button elements
 * (e.g. a link) without re-deriving the class list.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-lg border border-transparent bg-clip-padding font-normal text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* ---- Neutral (legacy names) ---- */
        default: "bg-primary text-primary-foreground hover:bg-primary/85",
        secondary:
          "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground aria-expanded:bg-secondary aria-expanded:text-foreground",
        outline:
          "border-border bg-background text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",

        /* ---- Brand (orange) ---- */
        "brand-solid":
          "bg-brand text-brand-foreground hover:bg-brand/90 focus-visible:border-brand/40 focus-visible:ring-brand/30",
        brand:
          "bg-brand/10 text-brand-accent hover:bg-brand/15 focus-visible:border-brand/40 focus-visible:ring-brand/20 dark:bg-brand/15 dark:hover:bg-brand/25",
        "brand-outline":
          "border-brand/30 text-brand-accent hover:bg-brand/10 focus-visible:border-brand/40 focus-visible:ring-brand/20",

        /* ---- Destructive (red) ---- */
        "destructive-solid":
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:border-destructive/40 focus-visible:ring-destructive/30",
        destructive:
          "bg-destructive/10 text-destructive-accent hover:bg-destructive/15 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/15 dark:hover:bg-destructive/25",
        "destructive-outline":
          "border-destructive/30 text-destructive-accent hover:bg-destructive/10 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",

        /* ---- Success (green) ---- */
        "success-solid":
          "bg-success text-success-foreground hover:bg-success/90 focus-visible:border-success/40 focus-visible:ring-success/30",
        success:
          "bg-success/10 text-success-accent hover:bg-success/15 focus-visible:border-success/40 focus-visible:ring-success/20 dark:bg-success/15 dark:hover:bg-success/25",
        "success-outline":
          "border-success/30 text-success-accent hover:bg-success/10 focus-visible:border-success/40 focus-visible:ring-success/20",

        /* ---- Warning (amber) ---- */
        "warning-solid":
          "bg-warning text-warning-foreground hover:bg-warning/90 focus-visible:border-warning/40 focus-visible:ring-warning/30",
        warning:
          "bg-warning/10 text-warning-accent hover:bg-warning/15 focus-visible:border-warning/40 focus-visible:ring-warning/20 dark:bg-warning/15 dark:hover:bg-warning/25",
        "warning-outline":
          "border-warning/30 text-warning-accent hover:bg-warning/10 focus-visible:border-warning/40 focus-visible:ring-warning/20",

        /* ---- Info (blue) ---- */
        "info-solid":
          "bg-info text-info-foreground hover:bg-info/90 focus-visible:border-info/40 focus-visible:ring-info/30",
        info: "bg-info/10 text-info-accent hover:bg-info/15 focus-visible:border-info/40 focus-visible:ring-info/20 dark:bg-info/15 dark:hover:bg-info/25",
        "info-outline":
          "border-info/30 text-info-accent hover:bg-info/10 focus-visible:border-info/40 focus-visible:ring-info/20",

        /* ---- Secondary outline ---- */
        /**
         * An outline-style secondary: transparent background, secondary-token
         * border, and secondary foreground text. Sits between the bare
         * `secondary` (tinted fill) and the neutral `outline` (grey/border
         * token) in the emphasis hierarchy.
         */
        "secondary-outline":
          "border-secondary text-secondary-foreground hover:bg-secondary/30 hover:text-foreground focus-visible:border-secondary/60 focus-visible:ring-secondary/20 dark:border-secondary/60 dark:hover:bg-secondary/20",

        /* ---- Invert (dark fill / light text — inverts the surface) ---- */
        /**
         * High-emphasis invert: solid `bg-invert` with `text-invert-foreground`.
         * Useful for CTAs placed on light surfaces where brand/primary colours
         * are unavailable.
         */
        "invert-solid":
          "bg-invert text-invert-foreground hover:bg-invert/90 focus-visible:border-invert/40 focus-visible:ring-invert/30",
        /**
         * Soft invert: lightly tinted `bg-invert/10` background with
         * foreground text. Matches the soft emphasis level of other intent
         * families (e.g. `brand`, `info`).
         */
        invert:
          "bg-invert/10 text-foreground hover:bg-invert/15 focus-visible:border-invert/40 focus-visible:ring-invert/20 dark:bg-invert/15 dark:hover:bg-invert/25",
        /**
         * Bordered invert: transparent background with an `invert`-tinted
         * border and foreground text. Mirrors the `*-outline` pattern used by
         * brand, destructive, success, warning, and info.
         */
        "invert-outline":
          "border-invert/30 text-foreground hover:bg-invert/10 focus-visible:border-invert/40 focus-visible:ring-invert/20",

        /* ---- Low emphasis / special ---- */
        ghost:
          "text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 in-data-[slot=button-group]:rounded-lg rounded-lg px-2.5 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 in-data-[slot=button-group]:rounded-lg rounded-lg px-3 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xl: "h-10 gap-2 px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-8",
        "icon-xs":
          "size-6 in-data-[slot=button-group]:rounded-lg rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 in-data-[slot=button-group]:rounded-lg rounded-lg",
        "icon-lg": "size-9",
        "icon-xl": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/** Props for {@link Button}. */
export type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants>;

/**
 * The primary interactive control for actions and navigation.
 *
 * Built on Base UI's `Button` primitive, so it forwards every native button
 * prop and ref. Styling is driven by {@link buttonVariants}; pass `variant`
 * and `size` to pick an appearance.
 *
 * @remarks
 * - Use the `render` prop to project the styling onto another element —
 *   e.g. `render={<a href="…" />}` — when the button should be a link or
 *   a framework `<Link>`. Doing so automatically relaxes the native-button
 *   semantics (see `nativeButton` below).
 * - Icon-only buttons should use an `icon*` size and always carry an
 *   `aria-label`.
 * - Wrap leading/trailing icons in an element with
 *   `data-icon="inline-start"` / `data-icon="inline-end"` to get the
 *   tuned asymmetric padding.
 *
 * @example
 * ```tsx
 * <Button variant="brand-solid" size="lg">Save</Button>
 * <Button render={<a href="/docs" />}>Read the docs</Button>
 * <Button size="icon" aria-label="Settings"><SettingsIcon /></Button>
 * ```
 */
function Button({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: ButtonProps) {
  // When render overrides the element (e.g. <a>, <Link>), disable
  // nativeButton so Base UI doesn't warn about non-<button> semantics.
  const nativeButton = render == null;

  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      nativeButton={nativeButton}
      render={render}
      {...props}
    />
  );
}

export { Button, buttonVariants };
