"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";
import { cn } from "../utils/index";
import { Button } from "./button";

/** Props for {@link Sheet}. */
export type SheetProps = SheetPrimitive.Root.Props;

/**
 * Edge-anchored sliding panel built on Base UI's Dialog primitive.
 *
 * Unlike {@link Drawer} (which uses Vaul), `Sheet` is entirely driven by
 * Base UI's Dialog and uses CSS transitions keyed off `data-[side=*]`
 * attributes for directional enter/exit animations.
 *
 * Compose the parts as:
 * `Sheet` → `SheetTrigger` → `SheetContent` (which internally mounts
 * {@link SheetPortal} and {@link SheetOverlay}), then inside
 * `SheetContent`: {@link SheetHeader} (holding {@link SheetTitle} and
 * {@link SheetDescription}), body content, and {@link SheetFooter}.
 *
 * @remarks
 * - The `side` prop on `SheetContent` (`"top" | "right" | "bottom" |
 *   "left"`, default `"right"`) controls the panel origin. It is forwarded
 *   as `data-side` and drives all anchoring, sizing, border placement, and
 *   enter/exit translate animations.
 * - `showCloseButton` (default `true`) renders a ghost icon button in the
 *   top-right corner. Set to `false` when you manage dismissal via footer
 *   actions.
 * - Always provide a {@link SheetTitle} for screen-reader accessibility.
 *
 * @example
 * ```tsx
 * <Sheet>
 *   <SheetTrigger>Open settings</SheetTrigger>
 *   <SheetContent side="right">
 *     <SheetHeader>
 *       <SheetTitle>Settings</SheetTitle>
 *       <SheetDescription>Manage your preferences.</SheetDescription>
 *     </SheetHeader>
 *     <div className="px-4 flex-1">…</div>
 *     <SheetFooter>
 *       <SheetClose>Done</SheetClose>
 *     </SheetFooter>
 *   </SheetContent>
 * </Sheet>
 * ```
 */
function Sheet({ ...props }: SheetProps) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

/**
 * Button or element that opens the {@link Sheet} when activated.
 *
 * `nativeButton={false}` relaxes the Base UI assertion that the trigger
 * must be a native `<button>`, enabling use of custom trigger elements.
 */
function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return (
    <SheetPrimitive.Trigger
      data-slot="sheet-trigger"
      nativeButton={false}
      {...props}
    />
  );
}

/** Programmatic close control for the {@link Sheet}. */
function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

/**
 * Teleports {@link SheetContent} outside the DOM tree into `document.body`,
 * escaping overflow/stacking-context constraints.
 */
function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

/**
 * Semi-transparent backdrop behind {@link SheetContent}; fades in/out via
 * `data-starting-style` / `data-ending-style` and applies a backdrop blur
 * when the browser supports it.
 */
function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-(--z-overlay) bg-overlay transition-opacity duration-(--duration-slow) data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-(--duration-base) supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      data-slot="sheet-overlay"
      {...props}
    />
  );
}

/**
 * The sliding panel itself.
 *
 * Mounts {@link SheetPortal} and {@link SheetOverlay} automatically.
 * The `side` prop determines which edge the panel originates from; all
 * anchoring, sizing, rounding, and enter/exit translations are driven by
 * the resulting `data-side` attribute.
 *
 * @remarks
 * - `side="left"` and `side="right"` panels are `w-3/4` up to `sm:max-w-sm`.
 * - `side="top"` and `side="bottom"` panels span the full width (`inset-x-0`)
 *   with auto height.
 * - `showCloseButton` renders a ghost `×` icon in the top-right corner.
 */
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        className={cn(
          "fixed z-(--z-modal) flex flex-col gap-4 bg-background bg-clip-padding text-sm shadow-lg transition duration-(--duration-slow) ease-in-out data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=bottom]:inset-x-0 data-[side=top]:inset-x-0 data-[side=left]:inset-y-0 data-[side=right]:inset-y-0 data-[side=top]:top-0 data-[side=right]:right-0 data-[side=bottom]:bottom-0 data-[side=left]:left-0 data-[side=bottom]:h-auto data-[side=left]:h-full data-[side=right]:h-full data-[side=top]:h-auto data-[side=left]:w-3/4 data-[side=right]:w-3/4 data-[side=bottom]:border-t data-[side=left]:border-r data-[side=top]:border-b data-[side=right]:border-l data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-(--duration-base) data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
          className
        )}
        data-side={side}
        data-slot="sheet-content"
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                className="absolute top-3 right-3"
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

/**
 * Top region of {@link SheetContent} for {@link SheetTitle} and
 * {@link SheetDescription}.
 */
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-0.5 p-4", className)}
      data-slot="sheet-header"
      {...props}
    />
  );
}

/**
 * Bottom action bar for {@link SheetContent}; pushes to the end of the
 * flex column with `mt-auto`.
 */
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      data-slot="sheet-footer"
      {...props}
    />
  );
}

/**
 * Accessible heading for the {@link Sheet}, announced by screen readers
 * when the panel opens. Always provide this for a11y.
 */
function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      className={cn("font-medium text-base text-foreground", className)}
      data-slot="sheet-title"
      {...props}
    />
  );
}

/** Muted supporting text beneath {@link SheetTitle}. */
function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="sheet-description"
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
