import { cn } from "../utils/index";

/**
 * Pulsing placeholder used while content is loading.
 *
 * Renders a rounded muted rectangle with a CSS `animate-pulse` animation.
 * Size the element with `w-*`/`h-*` (or `size-*`) utility classes to match
 * the content it stands in for. Multiple `Skeleton` elements can be composed
 * to replicate a full content layout.
 *
 * @remarks
 * The component is a plain `<div>`, so it carries no ARIA role. Wrap a
 * group of skeletons in a container with `aria-busy="true"` and
 * `aria-label="Loading…"` to communicate the loading state to screen
 * readers.
 *
 * @example
 * ```tsx
 * <div aria-busy="true" aria-label="Loading profile">
 *   <Skeleton className="h-10 w-10 rounded-full" />
 *   <Skeleton className="h-4 w-48" />
 *   <Skeleton className="h-4 w-32" />
 * </div>
 * ```
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      data-slot="skeleton"
      {...props}
    />
  );
}

export { Skeleton };
