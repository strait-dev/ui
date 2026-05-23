import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "../utils/index";

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
 *
 * @example
 * ```tsx
 * <div className="flex items-center gap-2">
 *   <Checkbox id="terms" />
 *   <Label htmlFor="terms">Accept terms and conditions</Label>
 * </div>
 * ```
 */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        // after: pseudo expands the interactive hit area
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 group-has-disabled/field:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:bg-input/30 dark:data-checked:bg-primary dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      data-slot="checkbox"
      {...props}
    >
      {/* Indicator is only visible when data-checked is present */}
      <CheckboxPrimitive.Indicator
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
        data-slot="checkbox-indicator"
      >
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
