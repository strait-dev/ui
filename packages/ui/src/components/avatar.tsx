"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../utils/index";

/**
 * Rounded user-identity image with automatic fallback text.
 *
 * Built on Base UI's `Avatar` primitive. Compose it with {@link AvatarImage}
 * for the photo and {@link AvatarFallback} for the initials or icon shown
 * while the image loads (or when no `src` is provided). Attach an
 * {@link AvatarBadge} to surface a status indicator.
 *
 * @remarks
 * - The `size` prop (`"xs" | "sm" | "default" | "lg" | "xl"`) cascades to
 *   every sub-part via `data-size` and group selectors — set it once on the
 *   root.
 * - A subtle border overlay is rendered via an `::after` pseudo-element with
 *   `mix-blend-darken` / `mix-blend-lighten` so the border adapts to both
 *   light and dark themes without a hard colour token.
 * - Wrap multiple `Avatar` elements in an {@link AvatarGroup} to get the
 *   overlapping stack layout with ring separators.
 *
 * @example
 * ```tsx
 * <Avatar size="lg">
 *   <AvatarImage src="/avatars/acme.png" alt="Acme Corp" />
 *   <AvatarFallback>AC</AvatarFallback>
 *   <AvatarBadge intent="online" />
 * </Avatar>
 * ```
 */
function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "xs" | "default" | "sm" | "lg" | "xl";
}) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "group/avatar relative flex size-8 shrink-0 select-none rounded-lg after:absolute after:inset-0 after:rounded-lg after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 data-[size=xl]:size-12 data-[size=xs]:size-5 dark:after:mix-blend-lighten",
        className
      )}
      data-size={size}
      data-slot="avatar"
      {...props}
    />
  );
}

/**
 * Image layer inside an {@link Avatar}; Base UI hides it automatically
 * while the `src` is loading and shows {@link AvatarFallback} instead.
 */
function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      className={cn(
        "aspect-square size-full rounded-lg object-cover",
        className
      )}
      data-slot="avatar-image"
      {...props}
    />
  );
}

/**
 * Fallback layer shown inside an {@link Avatar} when the image is absent or
 * still loading; typically displays initials or a placeholder icon.
 */
function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center rounded-lg bg-muted text-muted-foreground text-sm group-data-[size=sm]/avatar:text-xs group-data-[size=xl]/avatar:text-base group-data-[size=xs]/avatar:text-xs",
        className
      )}
      data-slot="avatar-fallback"
      {...props}
    />
  );
}

/**
 * CVA recipe for {@link AvatarBadge} presence colours.
 *
 * @remarks
 * Each `intent` maps to a semantic colour token so the badge communicates
 * user presence without hard-coded palette values.
 *
 * | intent    | token                  | meaning                  |
 * |-----------|------------------------|--------------------------|
 * | `online`  | `bg-success`           | active and reachable     |
 * | `busy`    | `bg-destructive`       | do-not-disturb           |
 * | `away`    | `bg-warning`           | idle / temporarily away  |
 * | `offline` | `bg-muted-foreground`  | unavailable              |
 *
 * @example
 * ```tsx
 * <AvatarBadge intent="online" />
 * <AvatarBadge intent="busy" />
 * ```
 *
 * {@link AvatarBadge}
 */
const avatarBadgeVariants = cva("", {
  variants: {
    intent: {
      online: "bg-success",
      busy: "bg-destructive",
      away: "bg-warning",
      offline: "bg-muted-foreground",
    },
  },
});

/**
 * Status dot anchored to the bottom-right corner of an {@link Avatar}.
 *
 * Size scales with the parent `Avatar` size via group selectors. An
 * optional SVG icon (e.g. an online indicator) is hidden at the `"sm"` and
 * `"xs"` sizes where there is not enough space to render it legibly.
 *
 * Use the `intent` prop to apply a semantic presence colour via
 * {@link avatarBadgeVariants}. When omitted the badge uses `bg-primary`
 * (the original appearance), preserving backwards-compatibility.
 *
 * @example
 * ```tsx
 * <AvatarBadge intent="online" />   // green success dot
 * <AvatarBadge intent="busy" />     // red destructive dot
 * <AvatarBadge intent="away" />     // amber warning dot
 * <AvatarBadge intent="offline" />  // muted neutral dot
 * <AvatarBadge />                   // unchanged primary dot
 * ```
 *
 * {@link Avatar}
 */
function AvatarBadge({
  className,
  intent,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof avatarBadgeVariants>) {
  return (
    <span
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex select-none items-center justify-center rounded-sm bg-primary text-primary-foreground bg-blend-color ring-2 ring-background",
        "group-data-[size=xs]/avatar:size-1.5 group-data-[size=xs]/avatar:[&>svg]:hidden",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        "group-data-[size=xl]/avatar:size-3.5 group-data-[size=xl]/avatar:[&>svg]:size-2.5",
        avatarBadgeVariants({ intent }),
        className
      )}
      data-slot="avatar-badge"
      {...props}
    />
  );
}

/**
 * Overlapping stack of {@link Avatar} elements with ring separators.
 *
 * Children are shifted left via `negative-space-x-2` and gain a
 * `ring-2 ring-background` outline to separate them visually.
 */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      data-slot="avatar-group"
      {...props}
    />
  );
}

/**
 * Overflow count chip that matches {@link Avatar} sizing inside an
 * {@link AvatarGroup}; typically shows "+N" when the group is truncated.
 */
function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground text-sm ring-2 ring-background",
        "group-has-data-[size=xs]/avatar-group:size-5 group-has-data-[size=xs]/avatar-group:text-xs group-has-data-[size=xs]/avatar-group:[&>svg]:size-2.5",
        "group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        "group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5",
        "group-has-data-[size=xl]/avatar-group:size-12 group-has-data-[size=xl]/avatar-group:text-base group-has-data-[size=xl]/avatar-group:[&>svg]:size-6",
        "[&>svg]:size-4",
        className
      )}
      data-slot="avatar-group-count"
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  avatarBadgeVariants,
};
