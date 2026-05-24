import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../utils/index";
import { Separator } from "./separator";

/**
 * Vertical list wrapper that spaces {@link Item} children and adapts gaps
 * to the `size` of the items it contains.
 *
 * @remarks
 * Uses `role="list"` on a `<div>` rather than a semantic `<ul>` because
 * children may be links, divs, or other non-`<li>` elements.
 */
function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: items may be links/divs rather than <li>, so the group uses role="list" on a div instead of <ul>/<ol>.
    <div
      className={cn(
        "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2",
        className
      )}
      data-slot="item-group"
      role="list"
      {...props}
    />
  );
}

/**
 * Horizontal rule that visually divides sections inside an
 * {@link ItemGroup}.
 */
function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn("my-2", className)}
      data-slot="item-separator"
      orientation="horizontal"
      {...props}
    />
  );
}

/**
 * Class-variance-authority recipe for {@link Item}.
 *
 * Exposes two axes:
 * - `variant` — surface style. `"default"` has no border; `"outline"` shows
 *   a visible border; `"muted"` uses a subtle muted background; `"ghost"`
 *   has a fully transparent background that only shows a tint on hover —
 *   ideal for sidebar navigation or contextual menus where the background
 *   should remain invisible until the user interacts.
 * - `size` — `"default"` and `"sm"` share the same padding while `"xs"`
 *   is more compact and adjusts padding when nested inside a dropdown menu.
 *   `"xl"` provides generous padding and slightly larger text for prominent
 *   list rows such as onboarding steps or feature tiles.
 */
const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-lg border text-sm outline-none transition-colors duration-100 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
        muted: "border-transparent bg-muted/50",
        /**
         * Transparent background with a hover tint only — no resting surface
         * color. Suitable for sidebar nav rows and contextual menu entries
         * where the background should only emerge on interaction.
         */
        ghost: "border-transparent bg-transparent hover:bg-muted/60",
      },
      size: {
        default: "gap-2.5 px-3 py-2.5",
        sm: "gap-2.5 px-3 py-2.5",
        xs: "gap-2 in-data-[slot=dropdown-menu-content]:p-0 px-2.5 py-2",
        /**
         * Generous padding and `text-base` for prominent list entries such as
         * onboarding steps, feature tiles, or hero-level navigation rows.
         */
        xl: "gap-3 px-4 py-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/** Props for {@link Item}. */
export type ItemProps = useRender.ComponentProps<"div"> &
  VariantProps<typeof itemVariants>;

/**
 * Flexible row-level container for list entries, menu rows, or card-like
 * tiles in an {@link ItemGroup}.
 *
 * Rendered as a `<div>` by default; swap the underlying element via the
 * `render` prop (e.g. `render={<a href="…" />}` for a navigable row).
 * Appearance is controlled by {@link itemVariants} through `variant` and
 * `size`.
 *
 * @remarks
 * - Compose with {@link ItemMedia}, {@link ItemContent} (containing
 *   {@link ItemTitle} and {@link ItemDescription}), and {@link ItemActions}
 *   to build rich list rows.
 * - `size` and `variant` are forwarded through the `state` object so
 *   descendant parts can respond via `group-data-[size=*]` selectors.
 * - When `size="xs"` and the item lives inside a
 *   `[data-slot=dropdown-menu-content]`, horizontal padding is removed to
 *   align flush with the menu edge.
 *
 * @example
 * ```tsx
 * <ItemGroup>
 *   <Item variant="outline" render={<a href="/users/1" />}>
 *     <ItemMedia variant="image">
 *       <img src="/avatars/1.png" alt="" />
 *     </ItemMedia>
 *     <ItemContent>
 *       <ItemTitle>Jane Smith</ItemTitle>
 *       <ItemDescription>Admin · Last seen 2h ago</ItemDescription>
 *     </ItemContent>
 *     <ItemActions>
 *       <Button size="icon-sm" variant="ghost" aria-label="More" />
 *     </ItemActions>
 *   </Item>
 * </ItemGroup>
 * ```
 */
function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: ItemProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(itemVariants({ variant, size, className })),
      },
      props
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
    },
  });
}

/**
 * Class-variance-authority recipe for {@link ItemMedia}.
 *
 * Exposes one axis:
 * - `variant` — `"default"` is transparent (for custom content);
 *   `"icon"` enforces a 16 × 16 SVG size; `"image"` creates a fixed square
 *   container with `object-cover` clipping that scales with the parent
 *   {@link Item} `size`.
 */
const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Leading visual slot inside an {@link Item} — accepts an icon, avatar, or
 * thumbnail image; styled via {@link itemMediaVariants}.
 */
function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      className={cn(itemMediaVariants({ variant, className }))}
      data-slot="item-media"
      data-variant={variant}
      {...props}
    />
  );
}

/**
 * Flex column that holds {@link ItemTitle} and {@link ItemDescription}
 * inside an {@link Item}; grows to fill remaining row space.
 */
function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      data-slot="item-content"
      {...props}
    />
  );
}

/** Primary one-line label inside an {@link ItemContent}. */
function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "line-clamp-1 flex w-fit items-center gap-2 font-medium text-sm leading-snug underline-offset-4",
        className
      )}
      data-slot="item-title"
      {...props}
    />
  );
}

/**
 * Two-line clamped supporting copy beneath an {@link ItemTitle}; reduces
 * to `text-xs` at the `"xs"` item size.
 */
function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "line-clamp-2 text-left font-normal text-muted-foreground text-sm leading-normal group-data-[size=xs]/item:text-xs [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      data-slot="item-description"
      {...props}
    />
  );
}

/**
 * Trailing controls (buttons, badges, menus) pinned to the right of an
 * {@link Item} row.
 */
function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-2", className)}
      data-slot="item-actions"
      {...props}
    />
  );
}

/**
 * Full-width row at the top of an {@link Item} for a label and a trailing
 * control on the same line; `basis-full` forces it to its own flex row.
 */
function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      data-slot="item-header"
      {...props}
    />
  );
}

/**
 * Full-width row at the bottom of an {@link Item}; mirrors the layout of
 * {@link ItemHeader} for a footer-level label and trailing control.
 */
function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      data-slot="item-footer"
      {...props}
    />
  );
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
};
