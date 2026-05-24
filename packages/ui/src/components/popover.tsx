"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type * as React from "react";

import { cn } from "../utils/index";

// ---------------------------------------------------------------------------
// Size axis
// ---------------------------------------------------------------------------

/**
 * The three size steps available on {@link PopoverContent}.
 *
 * | Value     | Padding     | Text size |
 * |-----------|-------------|-----------|
 * | `sm`      | `p-2`       | `text-xs` |
 * | `default` | `p-2.5`     | `text-sm` |
 * | `lg`      | `p-4`       | `text-sm` |
 */
type PopoverSize = "sm" | "default" | "lg";

// ---------------------------------------------------------------------------
// Popover (root)
// ---------------------------------------------------------------------------

/**
 * Floating panel anchored to a trigger element for rich non-modal content.
 *
 * Unlike a tooltip, a `Popover` is interactive — it can contain forms,
 * buttons, or other focusable elements. It does not block the rest of the
 * page (non-modal), so users can still interact with the background.
 *
 * Compose the parts as:
 * `Popover` → `PopoverTrigger` → `PopoverContent` (which internally mounts
 * a Portal and Positioner). Inside `PopoverContent` use
 * {@link PopoverHeader} (holding {@link PopoverTitle} and
 * {@link PopoverDescription}) followed by body content.
 *
 * @remarks
 * - `PopoverContent` merges positioning props (`side`, `sideOffset`,
 *   `align`, `alignOffset`) onto the underlying `Positioner`, so you can
 *   control placement without nesting extra components.
 * - The content panel animates in/out with a slide + scale + fade keyed
 *   off `data-[side=*]` for the correct direction.
 * - The positioner carries `isolate z-50` to avoid stacking-context bleed.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger>More info</PopoverTrigger>
 *   <PopoverContent side="bottom" align="start">
 *     <PopoverHeader>
 *       <PopoverTitle>Details</PopoverTitle>
 *       <PopoverDescription>
 *         Extra context about this item.
 *       </PopoverDescription>
 *     </PopoverHeader>
 *     <p>Body content here.</p>
 *   </PopoverContent>
 * </Popover>
 * ```
 */
function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

// ---------------------------------------------------------------------------
// PopoverTrigger
// ---------------------------------------------------------------------------

/** Button or element that opens the {@link Popover} when activated. */
function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

// ---------------------------------------------------------------------------
// PopoverContent
// ---------------------------------------------------------------------------

/**
 * Floating panel for {@link Popover} content.
 *
 * Internally wraps Base UI's Portal, Positioner, and Popup. The
 * positioning props (`side`, `sideOffset`, `align`, `alignOffset`) are
 * passed directly to the Positioner; everything else goes to the Popup.
 *
 * @remarks
 * `origin-(--transform-origin)` keeps the scale animation anchored to the
 * side the panel opens from, matching the slide direction.
 *
 * **Size axis** — controls the panel's padding and (for `sm`) text size:
 *
 * | `size`    | Padding | Text   |
 * |-----------|---------|--------|
 * | `sm`      | `p-2`   | `text-xs` |
 * | `default` | `p-2.5` | `text-sm` (unchanged) |
 * | `lg`      | `p-4`   | `text-sm` (unchanged) |
 */
function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  size = "default",
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    /**
     * Controls padding (and text size for `sm`) of the popover panel.
     * Defaults to `"default"` to preserve the existing look.
     */
    size?: PopoverSize;
  }) {
  return (
    <PopoverPrimitive.Portal>
      {/* isolate prevents z-index bleed from ancestor stacking contexts */}
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <PopoverPrimitive.Popup
          className={cn(
            // Positioning / animation (keep verbatim)
            "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 data-closed:animate-out data-open:animate-in",
            // Shape / colour / layout (keep verbatim)
            "z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover text-popover-foreground shadow-md outline-hidden ring-1 ring-foreground/10 duration-100",
            // Size variants — padding + text
            size === "sm" && "p-2 text-xs",
            size === "default" && "p-2.5 text-sm",
            size === "lg" && "p-4 text-sm",
            className
          )}
          data-size={size}
          data-slot="popover-content"
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

// ---------------------------------------------------------------------------
// PopoverHeader
// ---------------------------------------------------------------------------

/**
 * Optional title/description container at the top of
 * {@link PopoverContent}.
 */
function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-0.5 text-sm", className)}
      data-slot="popover-header"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// PopoverTitle
// ---------------------------------------------------------------------------

/** Accessible heading for the {@link Popover} panel. */
function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      className={cn("font-medium", className)}
      data-slot="popover-title"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// PopoverDescription
// ---------------------------------------------------------------------------

/** Muted supporting text beneath {@link PopoverTitle}. */
function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      className={cn("text-muted-foreground", className)}
      data-slot="popover-description"
      {...props}
    />
  );
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
