"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "../utils/index";

/**
 * Shared configuration provider for one or more {@link Tooltip} instances.
 *
 * Wrap a subtree with `TooltipProvider` to set a common `delay` (open
 * delay in ms) and other provider-level props. All `Tooltip` roots inside
 * the provider inherit these settings unless overridden locally.
 *
 * @remarks
 * The default `delay` here is `0` (show immediately). Increase it to
 * reduce noise for power users who don't need labels on every hover.
 */
function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  );
}

/**
 * Short, non-interactive label that appears near an element on hover or
 * focus, built on Base UI's `Tooltip` primitive.
 *
 * Use `Tooltip` for labelling icon buttons, truncated text, or other
 * elements that benefit from a brief explanatory string. For richer
 * interactive content use {@link Popover}; for hover-only previews use
 * {@link HoverCard}.
 *
 * Compose the parts as:
 * `Tooltip` → `TooltipTrigger` → `TooltipContent`.
 * Wrap multiple tooltips in a {@link TooltipProvider} to share open-delay
 * settings.
 *
 * @remarks
 * - `TooltipContent` accepts `side`, `sideOffset`, `align`, and
 *   `alignOffset` to control placement.
 * - An arrow pointing to the trigger is rendered automatically inside the
 *   content panel.
 * - The content panel supports a `data-[slot=kbd]` child to show a
 *   keyboard shortcut badge; padding is tuned automatically when one is
 *   present.
 * - Always ensure the trigger element has an accessible label — do not
 *   rely solely on the tooltip text for a11y.
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger asChild>
 *       <Button size="icon" aria-label="Settings">
 *         <SettingsIcon />
 *       </Button>
 *     </TooltipTrigger>
 *     <TooltipContent>Settings</TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

/** Element whose hover/focus state opens the {@link Tooltip}. */
function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * Floating label panel for {@link Tooltip}.
 *
 * Internally wraps Base UI's Portal, Positioner, Popup, and Arrow. The
 * positioning props (`side`, `sideOffset`, `align`, `alignOffset`) are
 * forwarded to the Positioner; everything else goes to the Popup.
 *
 * @remarks
 * - The arrow is absolutely positioned and rotated 45 ° to form a diamond
 *   tip; its translate/position values handle all four sides.
 * - `data-[state=delayed-open]` animation classes are included alongside
 *   the standard `data-open` ones to handle the open-delay state from
 *   {@link TooltipProvider}.
 * - Include a child with `data-slot="kbd"` to display a keyboard shortcut
 *   inside the tooltip.
 */
function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPrimitive.Portal>
      {/* isolate prevents z-index bleed from ancestor stacking contexts */}
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <TooltipPrimitive.Popup
          className={cn(
            "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-background text-xs has-data-[slot=kbd]:pr-1.5 data-[state=delayed-open]:animate-in data-closed:animate-out data-open:animate-in **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
            className
          )}
          data-slot="tooltip-content"
          {...props}
        >
          {children}
          {/* Arrow rotated 45° to form a diamond tip pointing at the trigger */}
          <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-start]:top-1/2! data-[side=left]:top-1/2! data-[side=right]:top-1/2! data-[side=inline-start]:-right-1 data-[side=left]:-right-1 data-[side=top]:-bottom-2.5 data-[side=inline-end]:-left-1 data-[side=right]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:-translate-y-1/2 data-[side=right]:-translate-y-1/2" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
