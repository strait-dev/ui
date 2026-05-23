"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";
import { cn } from "../utils/index";

// ---------------------------------------------------------------------------
// Size axis
// ---------------------------------------------------------------------------

/**
 * The three size steps available on {@link DropdownMenuContent}.
 *
 * The size cascades from the content popup to every item via
 * `data-size` on the popup element and `group-data-[size=…]` selectors on
 * each item.
 *
 * | Value     | Item padding  | Item text |
 * |-----------|---------------|-----------|
 * | `sm`      | `px-1 py-0.5` | `text-xs` |
 * | `default` | `px-1.5 py-1` | `text-sm` |
 * | `lg`      | `px-2 py-1.5` | `text-sm` |
 */
type DropdownMenuSize = "sm" | "default" | "lg";

/**
 * Floating list of actions that opens from a trigger button.
 *
 * `DropdownMenu` is the root state container. Compose the full tree as:
 * `DropdownMenu` → `DropdownMenuTrigger` → `DropdownMenuContent`, with
 * item parts inside the content: {@link DropdownMenuItem},
 * {@link DropdownMenuCheckboxItem}, {@link DropdownMenuRadioGroup} +
 * {@link DropdownMenuRadioItem}, {@link DropdownMenuSeparator},
 * {@link DropdownMenuLabel}, and nested submenus via
 * {@link DropdownMenuSub} + {@link DropdownMenuSubTrigger} +
 * {@link DropdownMenuSubContent}.
 *
 * @remarks
 * - `DropdownMenuContent` accepts `side`, `sideOffset`, `align`, and
 *   `alignOffset` to control panel placement relative to the trigger.
 * - The content panel matches the trigger width via `w-(--anchor-width)`,
 *   with `min-w-32` as a floor.
 * - Use `inset` on {@link DropdownMenuLabel} and {@link DropdownMenuItem}
 *   to add `pl-7` left-indent when mixing icon items and text-only items
 *   in the same group.
 * - Use `variant="destructive"` on {@link DropdownMenuItem} for
 *   irreversible actions; the item and its icons render in the destructive
 *   colour.
 * - Append a {@link DropdownMenuShortcut} inside an item to display a
 *   keyboard shortcut hint (visual only — wire the actual shortcut
 *   separately).
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger>Options</DropdownMenuTrigger>
 *   <DropdownMenuContent size="sm">
 *     <DropdownMenuLabel>My Account</DropdownMenuLabel>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem>
 *       Profile
 *       <DropdownMenuShortcut>P</DropdownMenuShortcut>
 *     </DropdownMenuItem>
 *     <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

/**
 * Teleports {@link DropdownMenuContent} outside the DOM tree into
 * `document.body`, escaping overflow/stacking-context constraints.
 */
function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

/** Button or element that opens the {@link DropdownMenu} when activated. */
function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

/**
 * Floating panel that holds all menu items for {@link DropdownMenu}.
 *
 * Internally wraps Base UI's Portal, Positioner, and Popup. The
 * positioning props (`side`, `sideOffset`, `align`, `alignOffset`) are
 * forwarded to the Positioner; everything else goes to the Popup.
 *
 * @remarks
 * `max-h-(--available-height)` and `overflow-y-auto` let the panel scroll
 * when the viewport is too short to show all items.
 *
 * **Size axis** — `size` is stamped onto the popup as `data-size`. Item
 * components (`DropdownMenuItem`, etc.) read it via `group-data-[size=…]`
 * selectors to scale their padding and text size.
 */
function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  size = "default",
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    /**
     * Controls item padding and text size for all items inside this menu.
     * Cascades via `data-size` on the popup + `group-data-[size=…]` on items.
     */
    size?: DropdownMenuSize;
  }) {
  return (
    <MenuPrimitive.Portal>
      {/* isolate prevents z-index bleed from ancestor stacking contexts */}
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50 outline-none"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          className={cn(
            // Named group so items can read data-size via group-data-[size=…]/dropdown-menu-content
            "group/dropdown-menu-content",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md outline-none ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in data-closed:overflow-hidden",
            className
          )}
          data-size={size}
          data-slot="dropdown-menu-content"
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

/**
 * Semantic grouping wrapper for related {@link DropdownMenuItem}s.
 * Pair with {@link DropdownMenuLabel} to add a visible group heading.
 */
function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

/**
 * Non-interactive heading above a group of items in
 * {@link DropdownMenuContent}.
 *
 * @remarks
 * `inset` adds `pl-7` to align with icon-bearing items in the same group.
 * Text size and padding cascade from the nearest `data-size` ancestor via
 * `group-data-[size=…]` selectors.
 */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      className={cn(
        // default
        "px-1.5 py-1 font-medium text-muted-foreground text-xs data-inset:pl-7",
        // sm — tighter
        "group-data-[size=sm]/dropdown-menu-content:px-1 group-data-[size=sm]/dropdown-menu-content:py-0.5",
        // lg — looser
        "group-data-[size=lg]/dropdown-menu-content:px-2 group-data-[size=lg]/dropdown-menu-content:py-1.5",
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-label"
      {...props}
    />
  );
}

/**
 * A single selectable action row inside {@link DropdownMenuContent}.
 *
 * @remarks
 * - `inset` adds `pl-7` for text-only items that share a group with
 *   icon-bearing items.
 * - `variant="destructive"` applies red text and a tinted focus background
 *   to signal an irreversible action.
 * - Optionally append a {@link DropdownMenuShortcut} as the last child to
 *   display a keyboard hint.
 * - Padding and text size cascade from the nearest `data-size` popup
 *   element via `group-data-[size=…]` selectors.
 */
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenuPrimitive.Item
      className={cn(
        // Base (default size)
        "group/dropdown-menu-item relative flex cursor-default select-none items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-7 data-[variant=destructive]:text-destructive data-disabled:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[variant=destructive]:*:[svg]:text-destructive",
        // sm override — tighter padding + smaller text
        "group-data-[size=sm]/dropdown-menu-content:px-1 group-data-[size=sm]/dropdown-menu-content:py-0.5 group-data-[size=sm]/dropdown-menu-content:text-xs",
        // lg override — looser padding
        "group-data-[size=lg]/dropdown-menu-content:px-2 group-data-[size=lg]/dropdown-menu-content:py-1.5",
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      {...props}
    />
  );
}

/**
 * Root container for a nested submenu inside {@link DropdownMenu}.
 * Pair with {@link DropdownMenuSubTrigger} and
 * {@link DropdownMenuSubContent}.
 */
function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

/**
 * Item row that opens a nested {@link DropdownMenuSubContent} on hover or
 * focus. Renders a trailing right-arrow icon automatically.
 *
 * @remarks
 * `inset` adds `pl-7` indent for alignment with icon items.
 * Padding and text size cascade from the nearest `data-size` popup element.
 */
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      className={cn(
        // Base (default size)
        "flex cursor-default select-none items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-open:bg-accent data-popup-open:bg-accent data-inset:pl-7 data-open:text-accent-foreground data-popup-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        // sm override
        "group-data-[size=sm]/dropdown-menu-content:px-1 group-data-[size=sm]/dropdown-menu-content:py-0.5 group-data-[size=sm]/dropdown-menu-content:text-xs",
        // lg override
        "group-data-[size=lg]/dropdown-menu-content:px-2 group-data-[size=lg]/dropdown-menu-content:py-1.5",
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      {children}
      <HugeiconsIcon
        className="ml-auto"
        icon={ArrowRight01Icon}
        strokeWidth={2}
      />
    </MenuPrimitive.SubmenuTrigger>
  );
}

/**
 * Floating panel for a nested submenu, anchored to its
 * {@link DropdownMenuSubTrigger}.
 *
 * Delegates to {@link DropdownMenuContent} with submenu-appropriate
 * defaults (`side="right"`, `alignOffset=-3`) and a narrower min-width.
 */
function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      align={align}
      alignOffset={alignOffset}
      className={cn(
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 w-auto min-w-[96px] rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in",
        className
      )}
      data-slot="dropdown-menu-sub-content"
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

/**
 * A checkable item inside {@link DropdownMenuContent}.
 *
 * Renders a tick icon on the trailing edge when `checked` is `true`.
 * Control state with the `checked` prop (controlled) or let the primitive
 * manage it internally.
 *
 * @remarks
 * `inset` adds `pl-7` indent to align with other items.
 * Padding and text size cascade from the nearest `data-size` popup element.
 */
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        // Base (default size)
        "relative flex cursor-default select-none items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-7 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        // sm override
        "group-data-[size=sm]/dropdown-menu-content:py-0.5 group-data-[size=sm]/dropdown-menu-content:pl-1 group-data-[size=sm]/dropdown-menu-content:text-xs",
        // lg override
        "group-data-[size=lg]/dropdown-menu-content:py-1.5 group-data-[size=lg]/dropdown-menu-content:pl-2",
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-checkbox-item"
      {...props}
    >
      {/* Tick indicator — absolutely positioned at the trailing edge */}
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

/**
 * Groups {@link DropdownMenuRadioItem}s so only one can be checked at a
 * time. Manage selection with the primitive's `value` / `onValueChange`
 * props.
 */
function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

/**
 * A radio-style item inside {@link DropdownMenuRadioGroup}.
 *
 * Renders a tick icon on the trailing edge when this item's value matches
 * the group's selected value.
 *
 * @remarks
 * `inset` adds `pl-7` indent to align with other items.
 * Padding and text size cascade from the nearest `data-size` popup element.
 */
function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.RadioItem
      className={cn(
        // Base (default size)
        "relative flex cursor-default select-none items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-7 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        // sm override
        "group-data-[size=sm]/dropdown-menu-content:py-0.5 group-data-[size=sm]/dropdown-menu-content:pl-1 group-data-[size=sm]/dropdown-menu-content:text-xs",
        // lg override
        "group-data-[size=lg]/dropdown-menu-content:py-1.5 group-data-[size=lg]/dropdown-menu-content:pl-2",
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-radio-item"
      {...props}
    >
      {/* Tick indicator — absolutely positioned at the trailing edge */}
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

/** Horizontal divider between groups in {@link DropdownMenuContent}. */
function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  );
}

/**
 * Trailing keyboard shortcut hint inside a {@link DropdownMenuItem}.
 *
 * Visual only — wire the actual keyboard handler separately. The hint
 * text inherits the item's focus colour via the parent group selector.
 */
function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto text-muted-foreground text-xs tracking-widest group-focus/dropdown-menu-item:text-accent-foreground",
        className
      )}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
