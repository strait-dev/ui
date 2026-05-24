"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

import { cn } from "../utils/index";

/** Props for {@link RadioGroup}. */
export type RadioGroupProps = RadioGroupPrimitive.Props & {
  /**
   * Size of each radio circle. Cascades to all nested {@link RadioGroupItem}s
   * via `group-data-[size=…]/radio-group` selectors.
   * @defaultValue "default"
   */
  size?: "sm" | "default" | "lg";
};

/**
 * A group of mutually exclusive radio options.
 *
 * `RadioGroup` is the root container; nest {@link RadioGroupItem} elements
 * inside it. Built on Base UI's `RadioGroup` primitive — all primitive props
 * and ref are forwarded. Manages selection state and keyboard navigation
 * (arrow keys) automatically.
 *
 * @remarks
 * - `size` (`"sm"` | `"default"` | `"lg"`) is set once on the root and
 *   cascades to every {@link RadioGroupItem} via `data-size` + the
 *   `group-data-[size=…]/radio-group` selector pattern. This scales:
 *   - The radio circle: `sm` → 3, `default` → 4, `lg` → 5 (Tailwind units).
 *   - The inner indicator dot: `sm` → 1.5, `default` → 2, `lg` → 2.5.
 *   - The inter-item gap: `sm` → gap-1.5, `default` → gap-2, `lg` → gap-3.
 * - Wrap the group in a {@link FieldSet} with a {@link FieldLegend} so
 *   screen readers announce the group name.
 * - Each {@link RadioGroupItem} should be paired with a {@link Label} via
 *   `htmlFor` / `id`, or wrapped together inside a {@link FieldLabel}.
 * - Pass `defaultValue` (uncontrolled) or `value` + `onValueChange`
 *   (controlled) to manage selection.
 *
 * @example
 * ```tsx
 * <FieldSet>
 *   <FieldLegend>Plan</FieldLegend>
 *   <RadioGroup defaultValue="starter" size="lg">
 *     <div className="flex items-center gap-2">
 *       <RadioGroupItem id="starter" value="starter" />
 *       <Label htmlFor="starter">Starter</Label>
 *     </div>
 *     <div className="flex items-center gap-2">
 *       <RadioGroupItem id="pro" value="pro" />
 *       <Label htmlFor="pro">Pro</Label>
 *     </div>
 *   </RadioGroup>
 * </FieldSet>
 * ```
 */
function RadioGroup({
  className,
  size = "default",
  ...props
}: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      className={cn(
        "group/radio-group grid w-full",
        // Inter-item gap scales with size
        "data-[size=sm]:gap-1.5",
        "data-[size=default]:gap-2",
        "data-[size=lg]:gap-3",
        className
      )}
      data-size={size}
      data-slot="radio-group"
      {...props}
    />
  );
}

/**
 * A single radio button inside a {@link RadioGroup}.
 *
 * Built on Base UI's `Radio.Root` primitive. Renders a circular indicator
 * via an inner `RadioPrimitive.Indicator` that appears only when the item
 * is selected.
 *
 * @remarks
 * - Size is inherited from the parent {@link RadioGroup} root via
 *   `group-data-[size=…]/radio-group` CSS selectors — do not set it
 *   directly on each item.
 * - An expanded tap-target is created via an `after:` pseudo-element
 *   (`after:-inset-x-3 after:-inset-y-2`) — do not shrink the containing
 *   block below that size.
 * - `aria-invalid` is set by {@link FormControl} on validation failure,
 *   triggering a destructive ring.
 * - The `value` prop is required; it is what {@link RadioGroup} reports
 *   via `onValueChange` when this item is selected.
 */
function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      className={cn(
        // after: pseudo expands the interactive hit area
        "group/radio-group-item peer relative flex aspect-square shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:bg-input/30 dark:data-checked:bg-primary dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        // Circle size — cascades from parent RadioGroup's data-size
        "group-data-[size=sm]/radio-group:size-3",
        "group-data-[size=default]/radio-group:size-4",
        "group-data-[size=lg]/radio-group:size-5",
        // Fallback when used standalone (no RadioGroup ancestor)
        "size-4",
        className
      )}
      data-slot="radio-group-item"
      {...props}
    >
      {/* Indicator dot — only visible when data-checked is present */}
      <RadioPrimitive.Indicator
        className={cn(
          "flex items-center justify-center",
          // Indicator container size matches the circle
          "group-data-[size=sm]/radio-group:size-3",
          "group-data-[size=default]/radio-group:size-4",
          "group-data-[size=lg]/radio-group:size-5",
          // Fallback size
          "size-4"
        )}
        data-slot="radio-group-indicator"
      >
        <span
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground",
            // Dot size scales with radio size
            "group-data-[size=sm]/radio-group:size-1.5",
            "group-data-[size=default]/radio-group:size-2",
            "group-data-[size=lg]/radio-group:size-2.5",
            // Fallback dot size
            "size-2"
          )}
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
