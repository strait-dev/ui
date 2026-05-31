"use client";

import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import type React from "react";

import { cn } from "../utils/index";

// Open / close hover delay in milliseconds.
const PREVIEW_CARD_DELAY = 300;

/** Props for {@link PreviewCard}. */
export type PreviewCardProps = React.ComponentProps<
  typeof PreviewCardPrimitive.Root
>;

/**
 * A hover-activated floating card that previews rich content for a
 * trigger element, built on Base UI's `PreviewCard` primitives.
 *
 * @remarks
 * Compose the parts in this order:
 * 1. `PreviewCard` — stateless root context provider.
 * 2. `PreviewCardTrigger` — the element the user hovers; defaults to a
 *    300 ms open and close delay.
 * 3. `PreviewCardPortal` — renders the popup outside the DOM tree.
 * 4. `PreviewCardPositioner` — positions the popup relative to the
 *    trigger with an 8 px side offset.
 * 5. `PreviewCardPopup` — the visible surface with scale+opacity
 *    enter/exit transitions.
 * 6. Optionally `PreviewCardArrow` — a filled SVG arrow pointing at
 *    the trigger.
 * 7. Optionally `PreviewCardBackdrop` — a full-screen overlay beneath
 *    the popup (useful for blocking interaction on mobile).
 *
 * All parts forward their Base UI primitive props plus `className`.
 *
 * @example
 * ```tsx
 * <PreviewCard>
 *   <PreviewCardTrigger>
 *     <a href="/user/jane">@jane</a>
 *   </PreviewCardTrigger>
 *   <PreviewCardPortal>
 *     <PreviewCardPositioner>
 *       <PreviewCardPopup>
 *         <PreviewCardArrow />
 *         <UserProfile userId="jane" />
 *       </PreviewCardPopup>
 *     </PreviewCardPositioner>
 *   </PreviewCardPortal>
 * </PreviewCard>
 * ```
 */
function PreviewCard({ ...props }: PreviewCardProps) {
  return <PreviewCardPrimitive.Root data-slot="preview-card" {...props} />;
}

/**
 * The element that opens the {@link PreviewCard} on hover.
 * Defaults to a 300 ms open and close delay.
 */
function PreviewCardTrigger({
  delay = PREVIEW_CARD_DELAY,
  closeDelay = PREVIEW_CARD_DELAY,
  className,
  ...props
}: React.ComponentProps<typeof PreviewCardPrimitive.Trigger>) {
  return (
    <PreviewCardPrimitive.Trigger
      className={className}
      closeDelay={closeDelay}
      data-slot="preview-card-trigger"
      delay={delay}
      {...props}
    />
  );
}

/**
 * Teleports the {@link PreviewCard} popup outside the DOM hierarchy
 * to avoid overflow / stacking-context clipping.
 */
function PreviewCardPortal({
  ...props
}: React.ComponentProps<typeof PreviewCardPrimitive.Portal>) {
  return (
    <PreviewCardPrimitive.Portal data-slot="preview-card-portal" {...props} />
  );
}

/**
 * Positions the {@link PreviewCardPopup} relative to the trigger
 * with an 8 px side offset.
 */
function PreviewCardPositioner({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof PreviewCardPrimitive.Positioner>) {
  return (
    <PreviewCardPrimitive.Positioner
      className={cn("z-50", className)}
      data-slot="preview-card-positioner"
      sideOffset={sideOffset}
      {...props}
    />
  );
}

/**
 * The visible floating surface of a {@link PreviewCard}; animates
 * in and out with a scale + opacity transition.
 */
function PreviewCardPopup({
  className,
  ...props
}: React.ComponentProps<typeof PreviewCardPrimitive.Popup>) {
  return (
    <PreviewCardPrimitive.Popup
      className={cn(
        "w-80 origin-[var(--transform-origin)] rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg outline-hidden transition-[transform,scale,opacity] data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
      data-slot="preview-card-popup"
      {...props}
    />
  );
}

/**
 * An SVG arrow that points from the {@link PreviewCardPopup} toward
 * its trigger; uses a drop-shadow to simulate a border.
 */
function PreviewCardArrow({
  className,
  ...props
}: React.ComponentProps<typeof PreviewCardPrimitive.Arrow>) {
  return (
    <PreviewCardPrimitive.Arrow
      className={cn(
        "-my-px fill-popover drop-shadow-[0_1px_0_hsl(var(--border))]",
        className
      )}
      data-slot="preview-card-arrow"
      {...props}
    />
  );
}

/**
 * A fixed full-screen overlay rendered beneath the
 * {@link PreviewCardPopup}, blocking pointer interaction with the
 * page while the card is open.
 */
function PreviewCardBackdrop({
  className,
  ...props
}: React.ComponentProps<typeof PreviewCardPrimitive.Backdrop>) {
  return (
    <PreviewCardPrimitive.Backdrop
      className={cn("fixed inset-0 z-40", className)}
      data-slot="preview-card-backdrop"
      {...props}
    />
  );
}

export {
  PreviewCard,
  PreviewCardArrow,
  PreviewCardBackdrop,
  PreviewCardPopup,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardTrigger,
};
