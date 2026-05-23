"use client";

import type * as React from "react";

import { cn } from "../utils/index";

/**
 * Accessible label for a form control.
 *
 * Thin wrapper around a native `<label>` that applies typography and
 * peer/group disabled styles. All native `<label>` props and refs are
 * forwarded.
 *
 * @remarks
 * - `size` (`"sm"` | `"default"` | `"lg"`) controls the text size of the
 *   label. The default matches the existing `text-sm` styling:
 *   - `sm`      — `text-xs`
 *   - `default` — `text-sm` (unchanged)
 *   - `lg`      — `text-base`
 * - `required` appends a red asterisk (`*`) after the label text to hint
 *   that the associated control is mandatory. The asterisk is wrapped in
 *   `aria-hidden="true"` so it is not announced by screen readers — the
 *   `required` attribute on the control itself conveys this semantically.
 * - Associate this with a control via `htmlFor` pointing to the control's
 *   `id`, or by nesting the control directly inside the label.
 * - When the sibling control has the `disabled` attribute, CSS peer selectors
 *   automatically dim and disable pointer-events on the label.
 * - When a parent element carries `data-disabled="true"` (e.g. a
 *   {@link Field} in a disabled group), group selectors apply the same
 *   muted treatment.
 * - Within a form, prefer {@link FormLabel} which also reads validation
 *   state and turns red on error.
 *
 * @example
 * ```tsx
 * <Label htmlFor="name" required size="lg">Full name</Label>
 * <Input id="name" required />
 * ```
 */
function Label({
  className,
  children,
  required = false,
  size = "default",
  ...props
}: React.ComponentProps<"label"> & {
  /**
   * Text size of the label.
   * - `sm`      — `text-xs`
   * - `default` — `text-sm` (unchanged)
   * - `lg`      — `text-base`
   * @defaultValue "default"
   */
  size?: "sm" | "default" | "lg";
  /**
   * When `true`, appends an `aria-hidden` red asterisk after the label text
   * to signal that the associated control is required.
   * @defaultValue false
   */
  required?: boolean;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: this is a reusable Label primitive; consumers associate it with a control via htmlFor or by nesting one.
    <label
      className={cn(
        "flex select-none items-center gap-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        // Size axis
        size === "sm" && "text-xs",
        size === "default" && "text-sm",
        size === "lg" && "text-base",
        className
      )}
      data-slot="label"
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
      )}
    </label>
  );
}

export { Label };
