"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for {@link Checkbox}.
 *
 * Exposes two axes:
 * - `size` — box + icon scaling: `"sm"` (14 px), `"default"` (16 px), `"lg"` (20 px).
 * - `variant` — colour treatment: `"default"` keeps the primary fill; `"destructive"`
 *   tints the border and checked background with the destructive semantic token.
 */
const checkboxVariants = cva(
  // Base classes shared across all variants
  "peer relative flex shrink-0 items-center justify-center rounded-[4px] border border-input outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 group-has-disabled/field:opacity-50 dark:bg-input/30",
  {
    variants: {
      size: {
        sm: "size-3.5",
        default: "size-4",
        lg: "size-5",
      },
      variant: {
        default: [
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary",
          "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
          "dark:data-checked:bg-primary dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        ].join(" "),
        destructive: [
          "border-destructive",
          "data-checked:border-destructive data-checked:bg-destructive data-checked:text-destructive-foreground",
          "dark:data-checked:bg-destructive",
        ].join(" "),
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

/**
 * Icon size classes keyed by size variant.
 *
 * The indicator wrapper uses `[&>svg]:size-*` to scale the check icon in step
 * with the outer box.
 */
const indicatorIconSize: Record<NonNullable<CheckboxProps["size"]>, string> = {
  sm: "[&>svg]:size-3",
  default: "[&>svg]:size-3.5",
  lg: "[&>svg]:size-4",
};

/**
 * Props for {@link Checkbox}.
 *
 * `size` is omitted from the base primitive props because native `<input>`
 * carries a numeric `size` attribute — intersecting it with a string union
 * collapses the type to `never`. We re-declare it via `VariantProps` instead.
 */
export type CheckboxProps = Omit<CheckboxPrimitive.Root.Props, "size"> &
  VariantProps<typeof checkboxVariants>;

/**
 * A binary toggle control that indicates a checked or unchecked state.
 *
 * Built on Base UI's `Checkbox` primitive, so it forwards every prop and ref
 * supported by `CheckboxPrimitive.Root`. The checkmark icon is rendered by an
 * inner `CheckboxPrimitive.Indicator` and only appears when the checkbox is
 * checked.
 *
 * @remarks
 * - Pair with a {@link Label} or {@link FieldLabel} via `htmlFor` / `id`
 *   for accessibility. When used inside a {@link Field}, the disabled state
 *   is inherited automatically from the field group.
 * - An expanded tap-target is created via an `after:` pseudo-element
 *   (`after:-inset-x-3 after:-inset-y-2`) so the click zone is wider than
 *   the visible box — do not shrink the containing block below that size.
 * - `aria-invalid` is applied by {@link FormControl} on validation failure;
 *   the checkbox shows a destructive ring automatically.
 * - To pre-check the box, pass `defaultChecked` (uncontrolled) or
 *   `checked` + `onCheckedChange` (controlled).
 * - The `size` prop scales both the outer box and the inner check icon:
 *   `"sm"` → 14 px, `"default"` → 16 px, `"lg"` → 20 px.
 * - The `variant` prop tints the border and checked background: `"destructive"`
 *   uses {@link https://tailwindcss.com/docs/customizing-colors the destructive semantic token}.
 *
 * @example
 * ```tsx
 * // Default usage with a label
 * <div className="flex items-center gap-2">
 *   <Checkbox id="terms" />
 *   <Label htmlFor="terms">Accept terms and conditions</Label>
 * </div>
 *
 * // Small destructive variant
 * <Checkbox size="sm" variant="destructive" aria-label="Delete item" />
 * ```
 */
function Checkbox({
  className,
  size = "default",
  variant = "default",
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(checkboxVariants({ size, variant }), className)}
      data-slot="checkbox"
      {...props}
    >
      {/* Indicator is only visible when data-checked is present */}
      <CheckboxPrimitive.Indicator
        className={cn(
          "grid place-content-center text-current transition-none",
          indicatorIconSize[size ?? "default"]
        )}
        data-slot="checkbox-indicator"
      >
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, checkboxVariants };
