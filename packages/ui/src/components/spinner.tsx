import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "../utils/index";

/**
 * Animated loading indicator built on the HugeIcons `Loading03` glyph.
 *
 * Renders a 16 × 16 spinning SVG with `role="status"` and `aria-label="Loading"`
 * so screen readers announce the loading state without extra markup.
 *
 * @remarks
 * - The default size is 16 × 16 (`size-4`); override with a Tailwind `size-*`
 *   class via `className`.
 * - `strokeWidth` defaults to `2` and is forwarded to the icon; adjust for
 *   thicker or thinner strokes.
 * - Because `HugeiconsIcon` accepts SVG props, all standard `<svg>` attributes
 *   (e.g. `aria-label`, `aria-hidden`) are supported.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner className="size-6" strokeWidth={1.5} />
 * ```
 */
function Spinner({
  className,
  strokeWidth = 2,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <HugeiconsIcon
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      data-slot="spinner"
      icon={Loading03Icon}
      role="status"
      // Ensure strokeWidth is always a number even if passed as a string attr
      strokeWidth={Number(strokeWidth)}
      {...props}
    />
  );
}

export { Spinner };
