import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for the {@link Spinner}.
 *
 * Exposes one axis:
 * - `size` — dimension presets from `xs` through `xl`. The `default` value
 *   preserves the original `size-4` appearance so existing usage is unaffected.
 *
 * Exported so consumers can derive the size class without rendering a full
 * `Spinner` (e.g. to size a custom icon in a loading slot).
 */
const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-3.5",
      default: "size-4",
      lg: "size-6",
      xl: "size-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * Props for {@link Spinner}.
 *
 * Extends the native `<svg>` element props forwarded to `HugeiconsIcon`,
 * adding the `size` axis from {@link spinnerVariants}.
 */
interface SpinnerProps
  extends React.ComponentProps<"svg">,
    VariantProps<typeof spinnerVariants> {}

/**
 * Animated loading indicator built on the HugeIcons `Loading03` glyph.
 *
 * Renders a spinning SVG with `role="status"` and `aria-label="Loading"` so
 * screen readers announce the loading state without extra markup.
 *
 * Size is controlled via the `size` prop (`xs | sm | default | lg | xl`).
 * Additional Tailwind classes (e.g. `text-primary`) can be passed through
 * `className` and are merged after the variant classes.
 *
 * @remarks
 * - The `default` size renders at `size-4` (16 × 16 px), matching the
 *   original hard-coded dimensions — no visual change for existing usage.
 * - `strokeWidth` defaults to `2` and is forwarded to the icon.
 * - Because `HugeiconsIcon` accepts SVG props, all standard `<svg>` attributes
 *   (e.g. `aria-label`, `aria-hidden`) are supported.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" />
 * <Spinner size="xs" className="text-muted-foreground" />
 * <Spinner strokeWidth={1.5} />
 * ```
 */
function Spinner({ className, size, strokeWidth = 2, ...props }: SpinnerProps) {
  return (
    <HugeiconsIcon
      aria-label="Loading"
      className={cn(spinnerVariants({ size }), className)}
      data-slot="spinner"
      icon={Loading03Icon}
      role="status"
      // Ensure strokeWidth is always a number even if passed as a string attr
      strokeWidth={Number(strokeWidth)}
      {...props}
    />
  );
}

export { Spinner, type SpinnerProps, spinnerVariants };
