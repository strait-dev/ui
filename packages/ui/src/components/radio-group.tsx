"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

import { cn } from "../utils/index";

/**
 * A group of mutually exclusive radio options.
 *
 * `RadioGroup` is the root container; nest {@link RadioGroupItem} elements
 * inside it. Built on Base UI's `RadioGroup` primitive — all primitive props
 * and ref are forwarded. Manages selection state and keyboard navigation
 * (arrow keys) automatically.
 *
 * @remarks
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
 *   <RadioGroup defaultValue="starter">
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
function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      className={cn("grid w-full gap-2", className)}
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
        "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:bg-input/30 dark:data-checked:bg-primary dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      data-slot="radio-group-item"
      {...props}
    >
      {/* Indicator dot — only visible when data-checked is present */}
      <RadioPrimitive.Indicator
        className="flex size-4 items-center justify-center"
        data-slot="radio-group-indicator"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
