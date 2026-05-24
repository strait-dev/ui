"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";

import { cn } from "../utils/index";

/**
 * A cross-browser custom scroll container with styled overlaid scrollbars.
 *
 * Composes Base UI's `ScrollArea` primitive parts: a root wrapper, a
 * viewport that clips and scrolls the content, a {@link ScrollBar} for
 * each active scroll axis, and a `Corner` where both bars meet. Only a
 * vertical scrollbar is included by default; add a second
 * `<ScrollBar orientation="horizontal" />` for bi-directional scrolling.
 *
 * @remarks
 * - The viewport inherits its parent's `border-radius` via
 *   `rounded-[inherit]`.
 * - The viewport is focusable and shows a ring on focus for keyboard
 *   accessibility.
 * - Content passed as `children` is rendered inside the viewport.
 *
 * @example
 * ```tsx
 * <ScrollArea className="h-72 w-full rounded-md border p-4">
 *   {longContent}
 * </ScrollArea>
 * ```
 */
function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative", className)}
      data-slot="scroll-area"
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className="size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        data-slot="scroll-area-viewport"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

/**
 * Styled scrollbar track and thumb rendered inside a {@link ScrollArea}.
 *
 * Defaults to `"vertical"` orientation; pass `orientation="horizontal"`
 * for the horizontal axis. The thumb is automatically sized by the
 * underlying Base UI primitive to reflect the visible content ratio.
 */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      className={cn(
        "flex touch-none select-none p-px transition-colors data-horizontal:h-2.5 data-vertical:h-full data-vertical:w-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:border-l data-vertical:border-l-transparent",
        className
      )}
      data-orientation={orientation}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        className="relative flex-1 rounded-full bg-border"
        data-slot="scroll-area-thumb"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
