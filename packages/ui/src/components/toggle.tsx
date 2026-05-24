"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for {@link Toggle} and
 * {@link ToggleGroupItem}.
 *
 * Exposes three axes:
 * - `variant` — `"default"` (transparent background, fills on hover/press) or
 *   `"outline"` (bordered, same hover/press fill).
 * - `size` — height presets: `"xs"`, `"sm"`, `"default"`, `"lg"`, `"xl"`.
 * - `intent` — pressed/active state colour: `"default"` (muted fill),
 *   `"destructive"`, `"success"`, `"info"`, `"warning"`.
 *
 * Exported so {@link ToggleGroup} can apply consistent styles to its items
 * without duplicating the class list.
 */
const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg font-medium text-sm outline-none transition-all hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted",
      },
      size: {
        xs: "h-6 min-w-6 rounded-[min(var(--radius-md),8px)] px-1 text-[0.7rem]",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-1.5 text-[0.8rem]",
        default: "h-8 min-w-8 px-2",
        lg: "h-9 min-w-9 px-2.5",
        xl: "h-10 min-w-10 px-3 text-base",
      },
      intent: {
        default: "aria-pressed:bg-muted data-[state=on]:bg-muted",
        destructive:
          "aria-pressed:bg-destructive aria-pressed:text-destructive-foreground data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground",
        success:
          "aria-pressed:bg-success aria-pressed:text-success-foreground data-[state=on]:bg-success data-[state=on]:text-success-foreground",
        info: "aria-pressed:bg-info aria-pressed:text-info-foreground data-[state=on]:bg-info data-[state=on]:text-info-foreground",
        warning:
          "aria-pressed:bg-warning aria-pressed:text-warning-foreground data-[state=on]:bg-warning data-[state=on]:text-warning-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      intent: "default",
    },
  }
);

/**
 * A two-state button that toggles between pressed and unpressed.
 *
 * Built on Base UI's `Toggle` primitive, so it manages `aria-pressed` and
 * forwards all native button props. Styling is driven by
 * {@link toggleVariants}; pass `variant`, `size`, and `intent` to pick an appearance.
 *
 * @remarks
 * - The pressed state is reflected via `aria-pressed` and the Tailwind
 *   `data-[state=on]` selector, both of which apply the intent fill.
 * - Icon-only toggles should always carry an `aria-label` describing the
 *   action (e.g. `aria-label="Bold"`).
 * - To manage a set of related toggles together, use
 *   {@link ToggleGroup} / {@link ToggleGroupItem} instead.
 * - `size` now includes `"xs"` (24 px) and `"xl"` (40 px) in addition to
 *   the existing `"sm"`, `"default"`, and `"lg"` presets.
 * - `intent` tints the pressed/active state with semantic colour tokens:
 *   `"destructive"`, `"success"`, `"info"`, `"warning"`. The `"default"` intent
 *   uses the muted fill (unchanged existing behaviour).
 *
 * @example
 * ```tsx
 * <Toggle aria-label="Bold">
 *   <BoldIcon />
 * </Toggle>
 *
 * <Toggle variant="outline" size="xl" intent="success">Save</Toggle>
 *
 * <Toggle size="xs" intent="destructive" aria-label="Delete">
 *   <TrashIcon />
 * </Toggle>
 * ```
 */
function Toggle({
  className,
  variant = "default",
  size = "default",
  intent = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      className={cn(toggleVariants({ variant, size, intent, className }))}
      data-slot="toggle"
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
