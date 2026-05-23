"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";
import { cn } from "../utils/index";
import { Button } from "./button";

/**
 * Modal overlay that interrupts the user to focus on a single task or
 * message.
 *
 * Compose the parts in this order:
 * `Dialog` → `DialogTrigger` → `DialogContent` (which internally mounts a
 * {@link DialogPortal}, {@link DialogOverlay}, and an optional close button),
 * then inside `DialogContent`: {@link DialogHeader} (holding
 * {@link DialogTitle} and {@link DialogDescription}), body content, and
 * {@link DialogFooter}.
 *
 * @remarks
 * - `DialogContent` renders inside a portal so it escapes overflow/stacking
 *   contexts. It includes a backdrop blur overlay and centres itself in the
 *   viewport.
 * - Pass `showCloseButton={false}` to `DialogContent` when you want to
 *   manage dismissal yourself (e.g. a wizard that must not be accidentally
 *   closed).
 * - `DialogFooter` accepts `showCloseButton` to render a built-in "Close"
 *   button as a convenience.
 * - Always include a {@link DialogTitle} (even if visually hidden) so screen
 *   readers can announce the dialog purpose when it opens.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger>Open</DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Confirm deletion</DialogTitle>
 *       <DialogDescription>
 *         This action cannot be undone.
 *       </DialogDescription>
 *     </DialogHeader>
 *     <DialogFooter showCloseButton>
 *       <Button variant="destructive-solid">Delete</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/** Button or element that opens the {@link Dialog} when activated. */
function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/**
 * Teleports {@link DialogContent} outside the current DOM tree into
 * `document.body`, escaping any overflow or stacking-context constraints.
 */
function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/** Programmatic close control for the {@link Dialog}. */
function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/**
 * Semi-transparent backdrop rendered behind {@link DialogContent}.
 * Animates in/out with a fade; applies a backdrop blur when the browser
 * supports the `backdrop-filter` API.
 */
function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        "data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 data-closed:animate-out data-open:animate-in supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      data-slot="dialog-overlay"
      {...props}
    />
  );
}

/**
 * Scrollable panel that holds the dialog body.
 *
 * Mounts {@link DialogPortal} and {@link DialogOverlay} automatically, then
 * centres itself in the viewport with a scale + fade entrance animation.
 *
 * @remarks
 * - `showCloseButton` (default `true`) renders a ghost icon button in the
 *   top-right corner. Set to `false` when the footer already provides a
 *   "Close" action or when the dialog must be explicitly confirmed.
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        className={cn(
          "data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-background p-4 text-sm outline-none ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in sm:max-w-sm",
          className
        )}
        data-slot="dialog-content"
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                className="absolute top-2 right-2"
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

/**
 * Top region of {@link DialogContent} for {@link DialogTitle} and
 * {@link DialogDescription}.
 */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      data-slot="dialog-header"
      {...props}
    />
  );
}

/**
 * Bottom action bar for {@link DialogContent}.
 *
 * Renders children in a row on `sm+` screens and stacks them on mobile.
 * Set `showCloseButton` to append a built-in "Close" dismiss button so
 * callers don't have to wire one up themselves.
 */
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      data-slot="dialog-footer"
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

/**
 * Accessible heading for the {@link Dialog}, announced by screen readers
 * when the dialog opens. Always provide this (or a visually-hidden
 * equivalent) for a11y.
 */
function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cn("font-medium text-base leading-none", className)}
      data-slot="dialog-title"
      {...props}
    />
  );
}

/** Muted supporting text beneath {@link DialogTitle}. */
function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cn(
        "text-muted-foreground text-sm *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      data-slot="dialog-description"
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
