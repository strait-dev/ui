"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type React from "react";
import { cn } from "../utils/index";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

/** Props for {@link NavigationRail}. */
export type NavigationRailProps = React.ComponentProps<"div"> & {
  /** Side of the layout the rail is anchored to; flips border and order. */
  orientation?: "left" | "right";
};

/**
 * A fixed-width vertical nav column that holds icon-only navigation items.
 *
 * Wraps its children in a {@link TooltipProvider} (delay 0) so every
 * {@link NavigationRailItem} can surface its label as a tooltip without
 * extra setup. Compose with {@link NavigationRailHeader},
 * {@link NavigationRailSection}, and {@link NavigationRailFooter} to build
 * the full rail layout.
 *
 * @remarks
 * - `orientation="left"` (default) renders a right border; `"right"` flips
 *   to a left border and uses CSS `order: last` so the rail sits at the
 *   trailing edge of a flex row without reordering the DOM.
 * - The rail is `h-full`, so its parent must constrain the height (typically
 *   a full-viewport flex container).
 *
 * @example
 * ```tsx
 * <NavigationRail>
 *   <NavigationRailHeader>
 *     <Logo />
 *   </NavigationRailHeader>
 *   <NavigationRailSection>
 *     <NavigationRailItem
 *       icon={HomeIcon}
 *       label="Home"
 *       isActive
 *     />
 *     <NavigationRailItem icon={SettingsIcon} label="Settings" />
 *   </NavigationRailSection>
 *   <NavigationRailFooter>
 *     <NavigationRailItem icon={UserIcon} label="Profile" />
 *   </NavigationRailFooter>
 * </NavigationRail>
 * ```
 */
export const NavigationRail = ({
  className,
  orientation = "left",
  children,
  ref,
  ...props
}: NavigationRailProps & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    className={cn(
      "flex h-full w-20 flex-col border-r bg-background",
      orientation === "right" && "order-last border-r-0 border-l",
      className
    )}
    data-slot="navigation-rail"
    ref={ref}
    {...props}
  >
    <TooltipProvider delay={0}>{children}</TooltipProvider>
  </div>
);

/** Props for {@link NavigationRailItem}. */
export type NavigationRailItemProps = {
  /** Hugeicons SVG element rendered as the button icon. */
  icon: IconSvgElement;
  /** Accessible text shown in the tooltip and as `sr-only` content. */
  label: string;
  /** Optional URL; pass when the item should behave as an anchor. */
  href?: string;
  /** Click handler for the icon button. */
  onClick?: () => void;
  /** Marks the item as the currently active route. */
  isActive?: boolean;
  /** Disables pointer events and reduces opacity when `true`. */
  disabled?: boolean;
  /** Optional indicator node (e.g. `<Ping>`) absolutely positioned at the
   * top-right corner of the button. */
  badge?: React.ReactNode;
};

/**
 * A single icon button inside a {@link NavigationRail}.
 *
 * Renders a square {@link Button} wrapped in a {@link Tooltip}; the tooltip
 * shows `label` on the right so the text label is always accessible without
 * consuming rail width. The `label` is also rendered as `sr-only` text
 * inside the button for screen readers.
 *
 * @remarks
 * - `badge` accepts any React node (e.g. a `<Ping>` indicator) and is
 *   absolutely positioned at the top-right corner of the button.
 * - `disabled` adds `pointer-events-none` and reduces opacity; it also
 *   passes the native `disabled` attribute to the underlying button.
 * - `isActive` switches the button to the `secondary` variant and adds an
 *   `bg-accent` class for the active ring treatment.
 */
export const NavigationRailItem = ({
  icon,
  label,
  onClick,
  isActive,
  disabled,
  badge,
  ref,
  ...props
}: NavigationRailItemProps & { ref?: React.Ref<HTMLButtonElement> }) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <Button
          className={cn(
            "relative h-14 w-14 rounded-lg",
            isActive ? "bg-accent" : null,
            disabled ? "pointer-events-none opacity-50" : null
          )}
          data-slot="navigation-rail-item"
          disabled={disabled}
          onClick={onClick}
          ref={ref}
          size="icon"
          variant={isActive ? "secondary" : "ghost"}
          {...props}
        />
      }
    >
      <HugeiconsIcon className="size-5" icon={icon} />
      {badge ? (
        <span className="absolute top-2 right-2 flex h-2 w-2">{badge}</span>
      ) : null}
      <span className="sr-only">{label}</span>
    </TooltipTrigger>
    <TooltipContent className="flex items-center gap-4" side="right">
      {label}
    </TooltipContent>
  </Tooltip>
);

/** Props for {@link NavigationRailSection}. */
export type NavigationRailSectionProps = {
  /** {@link NavigationRailItem} elements to render in this group. */
  children: React.ReactNode;
  /** Additional class names merged onto the section wrapper. */
  className?: string;
};

/**
 * A vertically stacked group of {@link NavigationRailItem}s inside a
 * {@link NavigationRail}.
 */
export const NavigationRailSection = ({
  children,
  className,
  ref,
  ...props
}: NavigationRailSectionProps & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    className={cn("flex flex-col items-center gap-2 py-2", className)}
    data-slot="navigation-rail-section"
    ref={ref}
    {...props}
  >
    {children}
  </div>
);

/** Props for {@link NavigationRailHeader}. */
export type NavigationRailHeaderProps = {
  /** Content rendered inside the header (typically a logo or app icon). */
  children: React.ReactNode;
  /** Additional class names merged onto the header wrapper. */
  className?: string;
};

/**
 * Fixed top area of a {@link NavigationRail}, typically used for a logo or
 * app icon; separated from the body by a bottom border.
 */
export const NavigationRailHeader = ({
  children,
  className,
  ref,
  ...props
}: NavigationRailHeaderProps & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    className={cn(
      "flex h-20 items-center justify-center border-b px-2",
      className
    )}
    data-slot="navigation-rail-header"
    ref={ref}
    {...props}
  >
    {children}
  </div>
);

/** Props for {@link NavigationRailFooter}. */
export type NavigationRailFooterProps = {
  /** Content rendered inside the footer (typically a profile item). */
  children: React.ReactNode;
  /** Additional class names merged onto the footer wrapper. */
  className?: string;
};

/**
 * Pinned bottom area of a {@link NavigationRail}; uses `mt-auto` to push
 * itself to the bottom of the flex column and adds a top border as a visual
 * divider.
 */
export const NavigationRailFooter = ({
  children,
  className,
  ref,
  ...props
}: NavigationRailFooterProps & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    className={cn(
      "mt-auto flex flex-col items-center gap-2 border-t py-2",
      className
    )}
    data-slot="navigation-rail-footer"
    ref={ref}
    {...props}
  >
    {children}
  </div>
);
