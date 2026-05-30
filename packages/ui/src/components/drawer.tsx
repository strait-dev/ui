"use client";

import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "../utils/index";

/** Props for {@link Drawer}. */
export type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root>;

/**
 * Edge-anchored panel that slides in from any side of the viewport,
 * powered by the Vaul library.
 *
 * Compose the parts as:
 * `Drawer` → `DrawerTrigger` → `DrawerContent` (which internally mounts
 * {@link DrawerPortal} and {@link DrawerOverlay}), then inside
 * `DrawerContent`: {@link DrawerHeader} (holding {@link DrawerTitle} and
 * {@link DrawerDescription}), body content, and {@link DrawerFooter}.
 *
 * @remarks
 * - The slide direction is controlled by the `direction` prop on `Drawer`
 *   (the Vaul root). `DrawerContent` reads the `data-vaul-drawer-direction`
 *   attribute to apply the correct anchoring, sizing, and border.
 * - A drag handle pill is rendered automatically at the top of the panel
 *   when `direction="bottom"` (the default). It is hidden for other
 *   directions.
 * - For `bottom` and `top` drawers, the panel is capped at 80 vh to keep
 *   the page partially visible underneath.
 * - For `left` and `right` drawers, the panel is `w-3/4` and capped at
 *   `sm:max-w-sm`.
 * - Always include a {@link DrawerTitle} for screen-reader accessibility.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger>Open</DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Filters</DrawerTitle>
 *       <DrawerDescription>
 *         Refine the list below.
 *       </DrawerDescription>
 *     </DrawerHeader>
 *     <div className="px-4">…</div>
 *     <DrawerFooter>
 *       <DrawerClose>Done</DrawerClose>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
function Drawer({ ...props }: DrawerProps) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

/** Button or element that opens the {@link Drawer} when activated. */
function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

/**
 * Teleports {@link DrawerContent} outside the DOM tree into `document.body`,
 * escaping overflow/stacking-context constraints.
 */
function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

/** Programmatic close control for the {@link Drawer}. */
function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

/**
 * Semi-transparent backdrop behind {@link DrawerContent}; fades in/out
 * and applies a backdrop blur when the browser supports it.
 */
function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      className={cn(
        "data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 z-50 bg-black/10 data-closed:animate-out data-open:animate-in supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      data-slot="drawer-overlay"
      {...props}
    />
  );
}

/**
 * The sliding panel itself.
 *
 * Mounts {@link DrawerPortal} and {@link DrawerOverlay} automatically.
 * Layout, sizing, border, and rounding all derive from the
 * `data-vaul-drawer-direction` attribute set by the Vaul root.
 *
 * @remarks
 * The drag-handle pill (`h-1 w-[100px]`) is only visible for
 * `direction="bottom"` drawers; it is hidden via a group data selector
 * for all other directions.
 */
function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        className={cn(
          "group/drawer-content fixed z-50 flex h-auto flex-col bg-background text-sm data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=left]:rounded-r-lg data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=right]:rounded-l-lg data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm",
          className
        )}
        data-slot="drawer-content"
        {...props}
      >
        {/* Drag handle — only visible for bottom-direction drawers */}
        <div className="mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

/**
 * Top region of {@link DrawerContent} for {@link DrawerTitle} and
 * {@link DrawerDescription}. Text is centred for `top`/`bottom` drawers
 * and left-aligned for `left`/`right` drawers on `md+` screens.
 */
function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left",
        className
      )}
      data-slot="drawer-header"
      {...props}
    />
  );
}

/**
 * Bottom action bar for {@link DrawerContent}; pushes to the end of
 * the flex column with `mt-auto`.
 */
function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      data-slot="drawer-footer"
      {...props}
    />
  );
}

/**
 * Accessible heading for the {@link Drawer}, announced by screen readers
 * when the panel opens. Always provide this for a11y.
 */
function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn("font-medium text-base text-foreground", className)}
      data-slot="drawer-title"
      {...props}
    />
  );
}

/** Muted supporting text beneath {@link DrawerTitle}. */
function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="drawer-description"
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
