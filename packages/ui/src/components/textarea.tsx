import type * as React from "react";

import { cn } from "../utils/index";

/**
 * A multi-line text control for longer user input.
 *
 * Thin wrapper around a native `<textarea>` that applies the design-system's
 * border, focus ring, disabled, and `aria-invalid` states. All native
 * `<textarea>` props and refs are forwarded.
 *
 * @remarks
 * - Uses the CSS `field-sizing: content` property so the control grows with
 *   its content automatically; a `min-h-16` baseline prevents it from
 *   collapsing to zero height.
 * - Pair every `Textarea` with a {@link Label} (via `htmlFor` / `id`).
 *   When using react-hook-form, wrap it with {@link FormControl} and
 *   {@link FormItem} so IDs, descriptions, and error states are wired up.
 * - `aria-invalid` is applied by {@link FormControl} on validation failure;
 *   the textarea renders a destructive ring automatically.
 *
 * @example
 * ```tsx
 * <Label htmlFor="bio">Bio</Label>
 * <Textarea id="bio" placeholder="Tell us about yourself…" />
 * ```
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        // field-sizing-content enables auto-grow with content
        "field-sizing-content flex min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80",
        className
      )}
      data-slot="textarea"
      {...props}
    />
  );
}

export { Textarea };
