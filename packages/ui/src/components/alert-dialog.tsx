"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../utils/index";
import { Button } from "./button";

/**
 * Class-variance-authority recipe for {@link AlertDialogContent} sizing.
 *
 * Controls the `max-width` axis of the alert-dialog panel (and `max-height`
 * for the `full` variant). The `default` variant reproduces the original
 * `sm:max-w-sm` cap so upgrading is non-breaking.
 *
 * Exported so consumers can derive the same sizing on custom alert-dialog-like
 * surfaces without re-implementing the class list.
 *
 * @remarks
 * Only the max-width (and for `full`, max-height) axis is managed here.
 * All positioning, animation, background, and ring classes remain on the
 * base string inside {@link AlertDialogContent}.
 *
 * @example
 * ```ts
 * // Derive a class list for a non-AlertDialog panel that should match `lg` size.
 * const cls = alertDialogContentVariants({ size: "lg" });
 * ```
 *
 * {@link AlertDialogContent}
 */
const alertDialogContentVariants = cva("", {
  variants: {
    size: {
      sm: "max-w-xs",
      default: "max-w-xs sm:max-w-sm",
      lg: "sm:max-w-2xl",
      xl: "sm:max-w-4xl",
      full: "max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/** Props for {@link AlertDialog}. */
export type AlertDialogProps = AlertDialogPrimitive.Root.Props;

/**
 * Blocking confirmation dialog that requires the user to make a choice
 * before continuing.
 *
 * Unlike {@link Dialog} from `dialog.tsx`, an `AlertDialog` cannot be
 * dismissed by clicking the backdrop — the user must interact with one of
 * the action buttons. Use it for destructive or irreversible operations.
 *
 * Compose the parts as:
 * `AlertDialog` → `AlertDialogTrigger` → `AlertDialogContent` (which
 * internally mounts {@link AlertDialogPortal} and
 * {@link AlertDialogOverlay}), then inside `AlertDialogContent`:
 * {@link AlertDialogHeader} (holding an optional {@link AlertDialogMedia},
 * {@link AlertDialogTitle}, and {@link AlertDialogDescription}), and
 * {@link AlertDialogFooter} (holding {@link AlertDialogAction} and
 * {@link AlertDialogCancel}).
 *
 * @remarks
 * - `AlertDialogContent` accepts a `size` prop
 *   (`"sm" | "default" | "lg" | "xl" | "full"`). See
 *   {@link alertDialogContentVariants} for the max-width each size applies.
 *   `"default"` centres content on mobile and left-aligns on `sm+`; `"sm"`
 *   stays centred and uses a two-column footer grid.
 * - `AlertDialogMedia` renders a square icon container; when present on
 *   `sm+` screens with `size="default"`, the header switches to a
 *   multi-row grid so the icon spans the title and description rows.
 * - Always provide {@link AlertDialogTitle} — it is the accessible label
 *   announced by screen readers when the dialog opens.
 *
 * @example
 * ```tsx
 * <AlertDialog>
 *   <AlertDialogTrigger>Delete account</AlertDialogTrigger>
 *   <AlertDialogContent>
 *     <AlertDialogHeader>
 *       <AlertDialogTitle>Are you sure?</AlertDialogTitle>
 *       <AlertDialogDescription>
 *         This will permanently delete your account.
 *       </AlertDialogDescription>
 *     </AlertDialogHeader>
 *     <AlertDialogFooter>
 *       <AlertDialogCancel>Cancel</AlertDialogCancel>
 *       <AlertDialogAction variant="destructive-solid">
 *         Delete
 *       </AlertDialogAction>
 *     </AlertDialogFooter>
 *   </AlertDialogContent>
 * </AlertDialog>
 * ```
 */
function AlertDialog({ ...props }: AlertDialogProps) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

/** Button or element that opens the {@link AlertDialog} when activated. */
function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

/**
 * Teleports {@link AlertDialogContent} outside the DOM tree into
 * `document.body`, escaping overflow/stacking-context constraints.
 */
function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

/**
 * Semi-transparent backdrop behind {@link AlertDialogContent}; animates in
 * and out with a fade and optional backdrop blur.
 */
function AlertDialogOverlay({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      className={cn(
        "data-open:fade-in-0 data-closed:fade-out-0 fixed inset-0 isolate z-(--z-overlay) bg-overlay duration-(--duration-slow) data-closed:animate-out data-open:animate-in data-closed:duration-(--duration-base) supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      data-slot="alert-dialog-overlay"
      {...props}
    />
  );
}

/**
 * Scrollable panel that holds the alert dialog body.
 *
 * Mounts {@link AlertDialogPortal} and {@link AlertDialogOverlay}
 * automatically, then centres itself in the viewport.
 *
 * @remarks
 * - The `size` prop (`"sm" | "default" | "lg" | "xl" | "full"`) controls the
 *   maximum width of the panel via {@link alertDialogContentVariants}. The
 *   value is also forwarded as `data-size` so child layout selectors (e.g.
 *   `group-data-[size=default]/alert-dialog-content`) continue to work.
 * - `"default"` matches the original `sm:max-w-sm` cap — non-breaking.
 * - `"sm"` keeps the centred layout and renders a two-column footer grid.
 * - `"full"` also applies a complementary `max-h` to stay inside the viewport.
 *
 * @example
 * ```tsx
 * // Large alert dialog for a multi-step confirmation
 * <AlertDialogContent size="lg">
 *   <AlertDialogHeader>
 *     <AlertDialogTitle>Confirm migration</AlertDialogTitle>
 *   </AlertDialogHeader>
 * </AlertDialogContent>
 * ```
 *
 * {@link alertDialogContentVariants}
 */
function AlertDialogContent({
  className,
  size = "default",
  ...props
}: AlertDialogPrimitive.Popup.Props &
  VariantProps<typeof alertDialogContentVariants>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        className={cn(
          "group/alert-dialog-content data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-(--z-modal) grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg bg-background p-4 outline-none ring-1 ring-foreground/10 duration-(--duration-slow) data-closed:animate-out data-open:animate-in data-closed:duration-(--duration-base)",
          alertDialogContentVariants({ size }),
          className
        )}
        data-size={size}
        data-slot="alert-dialog-content"
        {...props}
      />
    </AlertDialogPortal>
  );
}

/**
 * Top region of {@link AlertDialogContent} that lays out
 * {@link AlertDialogMedia}, {@link AlertDialogTitle}, and
 * {@link AlertDialogDescription}.
 *
 * On mobile the content is centred; on `sm+` with `size="default"` it
 * left-aligns. When {@link AlertDialogMedia} is present the grid grows an
 * extra row so the icon spans both the title and description.
 *
 * @remarks
 * Pass `accent="destructive"` to tint the title text with the destructive
 * semantic token (`text-destructive`). This is useful for deletion or
 * irreversible-action dialogs where the header itself should signal danger.
 * The prop is optional and undefined by default, keeping all existing alert
 * dialogs visually unchanged.
 *
 * @example
 * ```tsx
 * // Destructive-tinted header for a delete confirmation
 * <AlertDialogHeader accent="destructive">
 *   <AlertDialogTitle>Delete account</AlertDialogTitle>
 *   <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
 * </AlertDialogHeader>
 * ```
 *
 * {@link AlertDialogContent}
 */
function AlertDialogHeader({
  className,
  accent,
  ...props
}: React.ComponentProps<"div"> & {
  /**
   * Optional colour accent applied to the header.
   * `"destructive"` tints the title text with `text-destructive` via a CSS
   * child selector so you don't need to style {@link AlertDialogTitle}
   * individually.
   */
  accent?: "destructive";
}) {
  return (
    <div
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        accent === "destructive" &&
          "*:data-[slot=alert-dialog-title]:text-destructive",
        className
      )}
      data-slot="alert-dialog-header"
      {...props}
    />
  );
}

/**
 * Bottom action bar for {@link AlertDialogContent}.
 *
 * On `size="sm"` renders a two-column grid so action and cancel sit
 * side-by-side; on `size="default"` stacks on mobile and rows on `sm+`.
 */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-lg border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      )}
      data-slot="alert-dialog-footer"
      {...props}
    />
  );
}

/**
 * Square icon or illustration container in {@link AlertDialogHeader}.
 *
 * Its presence switches the header to a multi-row grid (on `sm+` with
 * `size="default"`) so it visually anchors both the title and description.
 */
function AlertDialogMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
        className
      )}
      data-slot="alert-dialog-media"
      {...props}
    />
  );
}

/**
 * Accessible heading for the {@link AlertDialog}, announced by screen
 * readers when the dialog opens. Always include this for a11y.
 */
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn(
        "font-medium text-base sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      )}
      data-slot="alert-dialog-title"
      {...props}
    />
  );
}

/** Muted supporting text beneath {@link AlertDialogTitle}. */
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn(
        "text-balance text-muted-foreground text-sm md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      data-slot="alert-dialog-description"
      {...props}
    />
  );
}

/**
 * Confirmation {@link Button} in {@link AlertDialogFooter}; forwards all
 * `Button` props so you can set `variant="destructive-solid"` etc.
 */
function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(className)}
      data-slot="alert-dialog-action"
      {...props}
    />
  );
}

/**
 * Dismissal button in {@link AlertDialogFooter}.
 *
 * Delegates to the primitive's `Close` for accessible dismissal and
 * projects its styles onto a {@link Button} via the `render` prop.
 * Defaults to `variant="outline"`.
 */
function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}: AlertDialogPrimitive.Close.Props &
  Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Close
      className={cn(className)}
      data-slot="alert-dialog-cancel"
      render={<Button size={size} variant={variant} />}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  alertDialogContentVariants,
};
