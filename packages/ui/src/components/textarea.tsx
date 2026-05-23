import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../utils/index";

/**
 * CVA recipe for the native `<textarea>` element.
 *
 * @remarks
 * **`size`** controls the minimum height of the textarea:
 * - `sm` — `min-h-16`  (compact; same as the legacy default)
 * - `default` — `min-h-16` (unchanged baseline)
 * - `lg` — `min-h-32`  (tall; useful for longer free-form text)
 *
 * **`resize`** maps to the CSS `resize` property:
 * - `none` — `resize-none`   user cannot resize
 * - `vertical` — `resize-y`   the default browser behaviour
 * - `auto` — `resize`         free resize in all directions
 *
 * Both axes default to the same visual output as the previous
 * single-variant component, so no existing usage is broken.
 */
const textareaVariants = cva(
  // Base classes shared by every variant combination
  [
    "field-sizing-content",
    "flex w-full rounded-lg border border-input bg-transparent px-2.5 py-2",
    "text-base outline-none transition-colors",
    "placeholder:text-muted-foreground",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "md:text-sm",
    "dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80",
  ],
  {
    variants: {
      /**
       * Controls the minimum height of the textarea.
       *
       * | Value | Class | Visual result |
       * |-------|-------|---------------|
       * | `sm` | `min-h-16` | Compact (same as original default) |
       * | `default` | `min-h-16` | Standard baseline (unchanged) |
       * | `lg` | `min-h-32` | Tall, for longer free-form input |
       */
      size: {
        sm: "min-h-16",
        default: "min-h-16",
        lg: "min-h-32",
      },
      /**
       * Controls whether and how the user can resize the textarea.
       *
       * | Value | Class | Behaviour |
       * |-------|-------|-----------|
       * | `none` | `resize-none` | Not resizable |
       * | `vertical` | `resize-y` | Vertical only (typical browser default) |
       * | `auto` | `resize` | Free resize in both axes |
       */
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        auto: "resize",
      },
    },
    defaultVariants: {
      size: "default",
      resize: "vertical",
    },
  }
);

/**
 * Props for {@link Textarea}.
 *
 * @remarks
 * Extends all native `<textarea>` attributes (forwarded via
 * `React.ComponentProps<"textarea">`). The native `rows` attribute is
 * left untouched; it remains available for controlling the initial row
 * count independently of the `size` variant.
 *
 * Note: the native `<textarea>` element has **no** `size` attribute,
 * so there is no numeric-`size` collision here. `rows` is left alone
 * per design-system convention.
 */
export type TextareaProps = React.ComponentProps<"textarea"> &
  VariantProps<typeof textareaVariants>;

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
 * - The `size` prop (`"sm" | "default" | "lg"`) overrides the minimum height
 *   without affecting native `rows` (which stays available for SSR / initial
 *   row hints).
 * - The `resize` prop (`"none" | "vertical" | "auto"`) controls whether the
 *   user can drag-resize the textarea.
 * - Pair every `Textarea` with a {@link Label} (via `htmlFor` / `id`).
 *   When building a form, wrap it with {@link FormControl} and
 *   {@link FormItem} so IDs, descriptions, and error states are wired up.
 * - `aria-invalid` is applied by {@link FormControl} on validation failure;
 *   the textarea renders a destructive ring automatically.
 *
 * @example
 * ```tsx
 * <Label htmlFor="bio">Bio</Label>
 * <Textarea id="bio" placeholder="Tell us about yourself…" />
 * ```
 *
 * @example Size and resize variants
 * ```tsx
 * <Textarea size="lg" resize="none" placeholder="Long-form content…" />
 * ```
 */
function Textarea({ className, size, resize, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(textareaVariants({ size, resize }), className)}
      data-slot="textarea"
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
