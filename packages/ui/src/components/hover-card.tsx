"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";

import { cn } from "../utils/index";

/** Props for {@link HoverCard}. */
export type HoverCardProps = PreviewCardPrimitive.Root.Props;

/**
 * Floating preview panel that appears on hover, built on Base UI's
 * `PreviewCard` primitive.
 *
 * Use `HoverCard` to surface supplemental, read-only information about a
 * link or element without requiring a click. For interactive floating
 * content use {@link Popover}; for short labels use
 * {@link Tooltip}.
 *
 * Compose the parts as:
 * `HoverCard` → `HoverCardTrigger` → `HoverCardContent` (which internally
 * mounts a Portal and Positioner).
 *
 * @remarks
 * - `HoverCardContent` exposes the same positioning props as
 *   {@link PopoverContent}: `side`, `sideOffset`, `align`, and
 *   `alignOffset`. Pass them directly — no extra wrapper needed.
 * - The panel animates in/out with a directional slide + scale + fade.
 * - `HoverCard` is pointer-driven and not keyboard-accessible; do not put
 *   information inside it that is unavailable through another path.
 *
 * @example
 * ```tsx
 * <HoverCard>
 *   <HoverCardTrigger>
 *     <a href="/profile">@username</a>
 *   </HoverCardTrigger>
 *   <HoverCardContent>
 *     <p className="font-medium">Full Name</p>
 *     <p className="text-muted-foreground text-sm">
 *       Member since 2021
 *     </p>
 *   </HoverCardContent>
 * </HoverCard>
 * ```
 */
function HoverCard({ ...props }: HoverCardProps) {
  return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />;
}

/** Element whose hover state opens the {@link HoverCard} panel. */
function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
  return (
    <PreviewCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  );
}

/**
 * Floating preview panel for {@link HoverCard}.
 *
 * Internally wraps Base UI's Portal, Positioner, and Popup. The
 * positioning props (`side`, `sideOffset`, `align`, `alignOffset`) are
 * forwarded to the Positioner; everything else goes to the Popup.
 *
 * @remarks
 * `origin-(--transform-origin)` keeps the scale animation anchored to the
 * side the panel opens from, matching the slide direction.
 */
function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  ...props
}: PreviewCardPrimitive.Popup.Props &
  Pick<
    PreviewCardPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
      {/* isolate prevents z-index bleed from ancestor stacking contexts */}
      <PreviewCardPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <PreviewCardPrimitive.Popup
          className={cn(
            "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-50 w-64 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-popover-foreground text-sm shadow-md outline-hidden ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in",
            className
          )}
          data-slot="hover-card-content"
          {...props}
        />
      </PreviewCardPrimitive.Positioner>
    </PreviewCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardContent, HoverCardTrigger };
