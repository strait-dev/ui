import { cn } from "../utils/index";

/** Props for {@link AspectRatio}. */
export type AspectRatioProps = React.ComponentProps<"div"> & {
  /**
   * Width-to-height ratio as a plain number (e.g. `16 / 9`, `4 / 3`, `1`).
   * Passed to the `--ratio` CSS custom property consumed by `aspect-(--ratio)`.
   */
  ratio: number;
};

/**
 * Container that enforces a fixed width-to-height ratio on its content.
 *
 * Passes the `ratio` value to a CSS custom property (`--ratio`) consumed by
 * the `aspect-(--ratio)` utility, keeping the implementation purely in CSS
 * without JavaScript resize observers.
 *
 * @remarks
 * - `ratio` is a plain number (e.g. `16 / 9`, `4 / 3`, `1`). Fractional
 *   values are valid — pass the result of a division expression directly.
 * - The container is `position: relative` so absolutely-positioned children
 *   (e.g. a full-cover image or video) fill the reserved space correctly.
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <img
 *     src="/hero.jpg"
 *     alt="Hero"
 *     className="absolute inset-0 size-full object-cover"
 *   />
 * </AspectRatio>
 * ```
 */
function AspectRatio({ ratio, className, ...props }: AspectRatioProps) {
  return (
    <div
      className={cn("relative aspect-(--ratio)", className)}
      data-slot="aspect-ratio"
      style={
        {
          // Expose ratio as a CSS var consumed by the aspect utility class
          "--ratio": ratio,
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { AspectRatio };
