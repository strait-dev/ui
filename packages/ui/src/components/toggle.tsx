"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for {@link Toggle} and
 * {@link ToggleGroupItem}.
 *
 * Exposes two axes:
 * - `variant` — `"default"` (transparent background, fills on hover/press) or
 *   `"outline"` (bordered, same hover/press fill).
 * - `size` — height presets: `"sm"`, `"default"`, `"lg"`.
 *
 * Exported so {@link ToggleGroup} can apply consistent styles to its items
 * without duplicating the class list.
 */
const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg font-medium text-sm outline-none transition-all hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-muted aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted",
      },
      size: {
        default: "h-8 min-w-8 px-2",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-1.5 text-[0.8rem]",
        lg: "h-9 min-w-9 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * A two-state button that toggles between pressed and unpressed.
 *
 * Built on Base UI's `Toggle` primitive, so it manages `aria-pressed` and
 * forwards all native button props. Styling is driven by
 * {@link toggleVariants}; pass `variant` and `size` to pick an appearance.
 *
 * @remarks
 * - The pressed state is reflected via `aria-pressed` and the Tailwind
 *   `data-[state=on]` selector, both of which apply the `bg-muted` fill.
 * - Icon-only toggles should always carry an `aria-label` describing the
 *   action (e.g. `aria-label="Bold"`).
 * - To manage a set of related toggles together, use
 *   {@link ToggleGroup} / {@link ToggleGroupItem} instead.
 *
 * @example
 * ```tsx
 * <Toggle aria-label="Bold">
 *   <BoldIcon />
 * </Toggle>
 *
 * <Toggle variant="outline" size="lg">Italic</Toggle>
 * ```
 */
function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      className={cn(toggleVariants({ variant, size, className }))}
      data-slot="toggle"
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
