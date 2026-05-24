"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "../utils/index";

/** Props for {@link Switch}. */
export type SwitchProps = SwitchPrimitive.Root.Props & {
  /** Physical size of the switch track and thumb. @defaultValue "default" */
  size?: "sm" | "default" | "lg";
  /**
   * Colour intent of the checked track.
   * - `"default"` — uses the `primary` token (unchanged from before).
   * - `"destructive"` — uses `bg-destructive` when checked.
   * @defaultValue "default"
   */
  intent?: "default" | "destructive";
};

/**
 * A toggle control that switches between on and off states.
 *
 * Built on Base UI's `Switch` primitive — all primitive props and ref are
 * forwarded. The sliding thumb is managed by an inner
 * `SwitchPrimitive.Thumb` that translates horizontally based on the checked
 * state.
 *
 * @remarks
 * - `size` (`"default"` | `"sm"` | `"lg"`) scales both the track and the
 *   thumb together via `data-size` attribute selectors; set it once on the
 *   root.
 *   - `sm`      — 24 × 14 px track / 12 px thumb
 *   - `default` — 32 × 18.4 px track / 16 px thumb
 *   - `lg`      — 44 × 24 px track / 20 px thumb
 * - `intent` (`"default"` | `"destructive"`) tints the checked track.
 *   `"destructive"` replaces the primary colour with `bg-destructive` when
 *   the switch is on — useful for high-stakes toggles (e.g. "delete
 *   account", "disable service").
 * - Pair with a {@link Label} or {@link FieldLabel} via `htmlFor` / `id`
 *   for accessibility. An expanded tap-target is applied via an `after:`
 *   pseudo-element (`after:-inset-x-3 after:-inset-y-2`).
 * - Pass `defaultChecked` (uncontrolled) or `checked` + `onCheckedChange`
 *   (controlled) to manage state.
 *
 * @example
 * ```tsx
 * // Large destructive switch
 * <div className="flex items-center gap-2">
 *   <Switch id="delete-account" intent="destructive" size="lg" />
 *   <Label htmlFor="delete-account">Delete account data on logout</Label>
 * </div>
 * ```
 */
function Switch({
  className,
  intent = "default",
  size = "default",
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        // after: pseudo expands the interactive hit area
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent outline-none transition-all after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        // Size axis — track dimensions
        "data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]",
        "data-[size=default]:h-[18.4px] data-[size=default]:w-[32px]",
        "data-[size=lg]:h-[24px] data-[size=lg]:w-[44px]",
        // Unchecked track colour (shared across all intents)
        "data-unchecked:bg-input dark:data-unchecked:bg-input/80",
        // Checked track colour — intent=default
        "data-[intent=default]:data-checked:bg-primary",
        // Checked track colour — intent=destructive
        "data-[intent=destructive]:data-checked:bg-destructive",
        // Disabled / invalid
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      // Propagate size and intent to thumb/track via group-data selectors
      data-intent={intent}
      data-size={size}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-background ring-0 transition-transform",
          // Thumb size per track size
          "group-data-[size=sm]/switch:size-3",
          "group-data-[size=default]/switch:size-4",
          "group-data-[size=lg]/switch:size-5",
          // Thumb translation: unchecked stays at 0, checked slides right
          "group-data-[size=sm]/switch:data-unchecked:translate-x-0",
          "group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)]",
          "group-data-[size=default]/switch:data-unchecked:translate-x-0",
          "group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)]",
          "group-data-[size=lg]/switch:data-unchecked:translate-x-0",
          "group-data-[size=lg]/switch:data-checked:translate-x-[calc(100%-2px)]",
          // Dark-mode thumb colouring
          "dark:data-checked:bg-primary-foreground dark:data-unchecked:bg-foreground"
        )}
        data-slot="switch-thumb"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
