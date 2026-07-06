"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for the {@link TooltipContent} popup.
 *
 * Exposes two axes:
 * - `variant` — surface colour scheme. `default` uses an inverted (dark)
 *   surface (`bg-foreground text-background`) for maximum contrast; `light`
 *   uses the popover surface (`bg-popover text-popover-foreground border`)
 *   for a softer, theme-aware appearance.
 * - `size` — padding and text-size preset. `default` preserves the original
 *   `px-3 py-1.5 text-xs` appearance; `sm` tightens it to `px-2 py-1
 *   text-xs`.
 *
 * All animation, positioning, and `data-[slot=kbd]` adjustment classes are
 * part of the base string and are never affected by variant switching.
 *
 * Exported so consumers can derive the same visual style independently.
 */
const tooltipContentVariants = cva(
  [
    // Animation & state classes — preserved across all variants
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=inline-end]:slide-in-from-left-2",
    "data-[side=inline-start]:slide-in-from-right-2",
    "data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2",
    "data-[side=top]:slide-in-from-bottom-2",
    "data-[state=delayed-open]:fade-in-0",
    "data-[state=delayed-open]:zoom-in-95",
    "data-open:fade-in-0",
    "data-open:zoom-in-95",
    "data-closed:fade-out-0",
    "data-closed:zoom-out-95",
    // Layout & shape — preserved across all variants
    "z-(--z-tooltip) inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md",
    // Kbd child styling — preserved across all variants
    "has-data-[slot=kbd]:pr-1.5",
    "data-[state=delayed-open]:animate-in",
    "data-closed:animate-out",
    "data-open:animate-in",
    "**:data-[slot=kbd]:relative",
    "**:data-[slot=kbd]:isolate",
    "**:data-[slot=kbd]:z-(--z-tooltip)",
    "**:data-[slot=kbd]:rounded-sm",
  ].join(" "),
  {
    variants: {
      /**
       * Surface colour scheme.
       *
       * - `default` — inverted surface (`bg-foreground / text-background`):
       *   high-contrast dark pill, identical to the original design.
       * - `light` — popover surface (`bg-popover / text-popover-foreground`
       *   with a `border`): softer, theme-aware tooltip for contexts where
       *   the dark pill would feel too heavy.
       */
      variant: {
        default: "bg-foreground text-background",
        light: "border bg-popover text-popover-foreground shadow-sm",
      },
      /**
       * Padding + text-size preset.
       *
       * - `default` — `px-3 py-1.5 text-xs` (original).
       * - `sm` — `px-2 py-1 text-xs` (compact).
       */
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-1.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

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

/** Props for {@link Tooltip}. */
export type TooltipProps = TooltipPrimitive.Root.Props;

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
 * - An arrow pointing to the trigger is rendered automatically inside
 *   the content panel.
 * - Always ensure the trigger element has an accessible label — do not
 *   rely solely on the tooltip text for a11y.
 *
 * @example
 * ```tsx
 * <TooltipProvider>
 *   <Tooltip>
 *     <TooltipTrigger
 *       render={<Button size="icon" aria-label="Settings" />}
 *     >
 *       <SettingsIcon />
 *     </TooltipTrigger>
 *     <TooltipContent>Settings</TooltipContent>
 *   </Tooltip>
 * </TooltipProvider>
 * ```
 */
function Tooltip({ ...props }: TooltipProps) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

/** Element whose hover/focus state opens the {@link Tooltip}. */
function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * Props for {@link TooltipContent}.
 *
 * Merges Base UI Popup props, Base UI Positioner placement props, and the
 * variant axes from {@link tooltipContentVariants}.
 */
interface TooltipContentProps
  extends TooltipPrimitive.Popup.Props,
    Pick<
      TooltipPrimitive.Positioner.Props,
      "align" | "alignOffset" | "side" | "sideOffset"
    >,
    VariantProps<typeof tooltipContentVariants> {}

/**
 * Floating label panel for {@link Tooltip}.
 *
 * Internally wraps Base UI's Portal, Positioner, Popup, and Arrow. The
 * positioning props (`side`, `sideOffset`, `align`, `alignOffset`) are
 * forwarded to the Positioner; `variant` and `size` drive styling via
 * {@link tooltipContentVariants}; everything else goes to the Popup.
 *
 * @remarks
 * - The arrow inherits the popup background automatically by sharing the
 *   same `bg-*` class. For the `light` variant the arrow also gets a border
 *   treatment via a thin shadow outline.
 * - `data-[state=delayed-open]` animation classes handle the open-delay
 *   state from {@link TooltipProvider}.
 * - Include a child with `data-slot="kbd"` to display a keyboard shortcut
 *   inside the tooltip.
 *
 * @example
 * ```tsx
 * <TooltipContent variant="light" size="sm">Compact light tooltip</TooltipContent>
 * ```
 */
function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  variant,
  size,
  children,
  ...props
}: TooltipContentProps) {
  // Compute the arrow background class to stay in sync with the popup surface.
  // For 'light' we use bg-popover; for 'default' we use bg-foreground.
  const arrowBg =
    variant === "light"
      ? "bg-popover fill-popover"
      : "bg-foreground fill-foreground";

  return (
    <TooltipPrimitive.Portal>
      {/* isolate prevents z-index bleed from ancestor stacking contexts */}
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-(--z-tooltip)"
        side={side}
        sideOffset={sideOffset}
      >
        <TooltipPrimitive.Popup
          className={cn(tooltipContentVariants({ variant, size }), className)}
          data-slot="tooltip-content"
          {...props}
        >
          {children}
          {/* Arrow rotated 45° to form a diamond tip pointing at the trigger */}
          <TooltipPrimitive.Arrow
            className={cn(
              "z-(--z-tooltip) size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px]",
              "data-[side=bottom]:top-1",
              "data-[side=inline-end]:top-1/2! data-[side=inline-start]:top-1/2! data-[side=left]:top-1/2! data-[side=right]:top-1/2!",
              "data-[side=inline-start]:-right-1 data-[side=left]:-right-1",
              "data-[side=top]:-bottom-2.5",
              "data-[side=inline-end]:-left-1 data-[side=right]:-left-1",
              "data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:-translate-y-1/2 data-[side=right]:-translate-y-1/2",
              arrowBg
            )}
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export {
  Tooltip,
  TooltipContent,
  type TooltipContentProps,
  TooltipProvider,
  TooltipTrigger,
  tooltipContentVariants,
};
