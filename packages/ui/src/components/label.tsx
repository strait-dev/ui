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
 * - Associate this with a control via `htmlFor` pointing to the control's
 *   `id`, or by nesting the control directly inside the label.
 * - When the sibling control has the `disabled` attribute, CSS peer selectors
 *   automatically dim and disable pointer-events on the label.
 * - When a parent element carries `data-disabled="true"` (e.g. a
 *   {@link Field} in a disabled group), group selectors apply the same
 *   muted treatment.
 * - Within react-hook-form, prefer {@link FormLabel} which also reads
 *   validation state and turns red on error.
 *
 * @example
 * ```tsx
 * <Label htmlFor="name">Full name</Label>
 * <Input id="name" />
 * ```
 */
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: this is a reusable Label primitive; consumers associate it with a control via htmlFor or by nesting one.
    <label
      className={cn(
        "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className
      )}
      data-slot="label"
      {...props}
    />
  );
}

export { Label };
