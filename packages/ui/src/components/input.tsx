import { Input as InputPrimitive } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../utils/index";

/**
 * CVA recipe that drives the height axis of the `Input` component.
 *
 * @remarks
 * Every other token (border, focus ring, disabled/invalid states, etc.) lives
 * in the base class string passed to `cn`. Only the height varies per size so
 * that callers opting into `sm` or `lg` see a visually consistent change
 * without any other style leaking.
 *
 * @example
 * ```ts
 * inputVariants({ size: "lg" }) // → "h-9"
 * ```
 */
export const inputVariants = cva("", {
  variants: {
    size: {
      sm: "h-7",
      default: "h-8",
      lg: "h-9",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * Props for {@link Input}.
 *
 * @remarks
 * The native `<input size?: number>` attribute is omitted to prevent a type
 * clash with the design-system `size` prop. If you need the native `size`
 * HTML attribute, set it via a ref or with a cast.
 */
export type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>;

/**
 * A single-line text control for user input.
 *
 * Built on Base UI's `Input` primitive — every native `<input>` prop and ref
 * is forwarded. Applies the design-system's focus ring, disabled, and
 * `aria-invalid` visual states automatically.
 *
 * @remarks
 * - Pair every `Input` with a {@link Label} (via `htmlFor` / `id`) for
 *   accessibility. When building a form, prefer wrapping with
 *   {@link FormControl} and {@link FormItem} so IDs, descriptions, and
 *   validation states are wired up automatically.
 * - `type="file"` is styled: the file button is displayed inline and matches
 *   the foreground typography.
 * - `aria-invalid` is set by {@link FormControl} when the field has an error;
 *   the input shows a destructive ring automatically.
 * - Use `size` (`"sm"` | `"default"` | `"lg"`) to control height. The default
 *   matches the previous `h-8` appearance so existing usage is unaffected.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">Email</Label>
 * <Input id="email" type="email" placeholder="you@example.com" />
 *
 * // Smaller variant
 * <Input size="sm" placeholder="Compact field" />
 *
 * // Larger variant
 * <Input size="lg" placeholder="Spacious field" />
 * ```
 */
function Input({ className, type, size, ...props }: InputProps) {
  return (
    <InputPrimitive
      className={cn(
        "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80",
        inputVariants({ size }),
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
