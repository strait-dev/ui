"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "../utils/index";

/**
 * A toggle control that switches between on and off states.
 *
 * Built on Base UI's `Switch` primitive — all primitive props and ref are
 * forwarded. The sliding thumb is managed by an inner
 * `SwitchPrimitive.Thumb` that translates horizontally based on the checked
 * state.
 *
 * @remarks
 * - `size` (`"default"` | `"sm"`) scales both the track and the thumb
 *   together via `data-size` attribute selectors; set it once on the root.
 * - Pair with a {@link Label} or {@link FieldLabel} via `htmlFor` / `id`
 *   for accessibility. An expanded tap-target is applied via an `after:`
 *   pseudo-element (`after:-inset-x-3 after:-inset-y-2`).
 * - `data-checked` / `data-unchecked` drive the track background color and
 *   the thumb translation; `data-disabled` handles pointer-events and
 *   opacity.
 * - `aria-invalid` is set by {@link FormControl} on validation failure,
 *   triggering a destructive ring.
 * - Pass `defaultChecked` (uncontrolled) or `checked` + `onCheckedChange`
 *   (controlled) to manage state.
 *
 * @example
 * ```tsx
 * <div className="flex items-center gap-2">
 *   <Switch id="notifications" defaultChecked />
 *   <Label htmlFor="notifications">Enable notifications</Label>
 * </div>
 * ```
 */
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        // after: pseudo expands the interactive hit area
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent outline-none transition-all after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=sm]:h-[14px] data-[size=default]:w-[32px] data-[size=sm]:w-[24px] data-disabled:cursor-not-allowed data-checked:bg-primary data-unchecked:bg-input data-disabled:opacity-50 dark:data-unchecked:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      // Propagate size to thumb via group-data selectors
      data-size={size}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground"
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
