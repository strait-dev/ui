"use client";

import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";
import { cn } from "../utils/index";

/**
 * Right-click (or long-press) contextual menu anchored to an arbitrary
 * region of the page.
 *
 * Unlike {@link DropdownMenu}, which opens from a button, `ContextMenu`
 * opens at the pointer position in response to a secondary action (right-
 * click, `contextmenu` event). The trigger region is defined by wrapping
 * any element in `ContextMenuTrigger`.
 *
 * Compose the parts as:
 * `ContextMenu` → `ContextMenuTrigger` → `ContextMenuContent`, with item
 * parts inside: {@link ContextMenuItem}, {@link ContextMenuCheckboxItem},
 * {@link ContextMenuRadioGroup} + {@link ContextMenuRadioItem},
 * {@link ContextMenuSeparator}, {@link ContextMenuLabel}, and nested
 * submenus via {@link ContextMenuSub} + {@link ContextMenuSubTrigger} +
 * {@link ContextMenuSubContent}.
 *
 * @remarks
 * - `ContextMenuTrigger` adds `select-none` so text inside the region
 *   does not get selected on right-click.
 * - `ContextMenuContent` defaults to `side="right"` and
 *   `align="start"` since the menu opens to the right of the pointer.
 * - Use `inset` on label and item components for `pl-7` indent when
 *   mixing icon and text-only items.
 * - Use `variant="destructive"` on {@link ContextMenuItem} for
 *   irreversible actions.
 * - Append a {@link ContextMenuShortcut} inside an item to display a
 *   keyboard shortcut hint (visual only).
 *
 * @example
 * ```tsx
 * <ContextMenu>
 *   <ContextMenuTrigger>
 *     <div className="border p-4">Right-click here</div>
 *   </ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <ContextMenuItem>Open</ContextMenuItem>
 *     <ContextMenuSeparator />
 *     <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 * ```
 */
function ContextMenu({ ...props }: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

/**
 * Teleports {@link ContextMenuContent} outside the DOM tree into
 * `document.body`, escaping overflow/stacking-context constraints.
 */
function ContextMenuPortal({ ...props }: ContextMenuPrimitive.Portal.Props) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}

/**
 * The region that listens for the secondary action (right-click /
 * `contextmenu` event) to open the {@link ContextMenu}.
 *
 * `select-none` prevents accidental text selection on right-click.
 */
function ContextMenuTrigger({
  className,
  ...props
}: ContextMenuPrimitive.Trigger.Props) {
  return (
    <ContextMenuPrimitive.Trigger
      className={cn("select-none", className)}
      data-slot="context-menu-trigger"
      {...props}
    />
  );
}

/**
 * Floating panel that holds all menu items for {@link ContextMenu}.
 *
 * Internally wraps Base UI's Portal, Positioner, and Popup. Positioning
 * props (`side`, `sideOffset`, `align`, `alignOffset`) are forwarded to
 * the Positioner; everything else goes to the Popup.
 *
 * @remarks
 * `max-h-(--available-height)` and `overflow-y-auto` let the panel scroll
 * when the viewport is too short to show all items.
 */
function ContextMenuContent({
  className,
  align = "start",
  alignOffset = 4,
  side = "right",
  sideOffset = 0,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<
    ContextMenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <ContextMenuPrimitive.Portal>
      {/* isolate prevents z-index bleed from ancestor stacking contexts */}
      <ContextMenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50 outline-none"
        side={side}
        sideOffset={sideOffset}
      >
        <ContextMenuPrimitive.Popup
          className={cn(
            "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md outline-none ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in",
            className
          )}
          data-slot="context-menu-content"
          {...props}
        />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

/**
 * Semantic grouping wrapper for related {@link ContextMenuItem}s.
 * Pair with {@link ContextMenuLabel} to add a visible group heading.
 */
function ContextMenuGroup({ ...props }: ContextMenuPrimitive.Group.Props) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

/**
 * Non-interactive heading above a group of items in
 * {@link ContextMenuContent}.
 *
 * @remarks
 * `inset` adds `pl-7` to align with icon-bearing items in the same group.
 */
function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.GroupLabel
      className={cn(
        "px-1.5 py-1 font-medium text-muted-foreground text-xs data-inset:pl-7",
        className
      )}
      data-inset={inset}
      data-slot="context-menu-label"
      {...props}
    />
  );
}

/**
 * A single selectable action row inside {@link ContextMenuContent}.
 *
 * @remarks
 * - `inset` adds `pl-7` for text-only items sharing a group with icon
 *   items.
 * - `variant="destructive"` applies red text and a tinted focus
 *   background for irreversible actions.
 * - Optionally append a {@link ContextMenuShortcut} as the last child.
 */
function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ContextMenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <ContextMenuPrimitive.Item
      className={cn(
        "group/context-menu-item relative flex cursor-default select-none items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-7 data-[variant=destructive]:text-destructive data-disabled:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive",
        className
      )}
      data-inset={inset}
      data-slot="context-menu-item"
      data-variant={variant}
      {...props}
    />
  );
}

/**
 * Root container for a nested submenu inside {@link ContextMenu}.
 * Pair with {@link ContextMenuSubTrigger} and
 * {@link ContextMenuSubContent}.
 */
function ContextMenuSub({ ...props }: ContextMenuPrimitive.SubmenuRoot.Props) {
  return (
    <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />
  );
}

/**
 * Item row that opens a nested {@link ContextMenuSubContent} on hover or
 * focus. Renders a trailing right-arrow icon automatically.
 *
 * @remarks
 * `inset` adds `pl-7` indent for alignment with icon items.
 */
function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger
      className={cn(
        "flex cursor-default select-none items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-open:bg-accent data-inset:pl-7 data-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-inset={inset}
      data-slot="context-menu-sub-trigger"
      {...props}
    >
      {children}
      <HugeiconsIcon
        className="ml-auto"
        icon={ArrowRight01Icon}
        strokeWidth={2}
      />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

/**
 * Floating panel for a nested submenu, anchored to its
 * {@link ContextMenuSubTrigger}.
 *
 * Delegates to {@link ContextMenuContent} with `side="right"` fixed and
 * an elevated `shadow-lg`.
 */
function ContextMenuSubContent({
  ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
  return (
    <ContextMenuContent
      className="shadow-lg"
      data-slot="context-menu-sub-content"
      side="right"
      {...props}
    />
  );
}

/**
 * A checkable item inside {@link ContextMenuContent}.
 *
 * Renders a tick icon on the trailing edge when `checked` is `true`.
 * Control state with the `checked` prop (controlled) or let the primitive
 * manage it internally.
 *
 * @remarks
 * `inset` adds `pl-7` indent to align with other items.
 */
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        "relative flex cursor-default select-none items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-7 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-inset={inset}
      data-slot="context-menu-checkbox-item"
      {...props}
    >
      {/* Tick indicator — absolutely positioned at the trailing edge */}
      <span className="pointer-events-none absolute right-2">
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

/**
 * Groups {@link ContextMenuRadioItem}s so only one can be checked at a
 * time. Manage selection with the primitive's `value` / `onValueChange`
 * props.
 */
function ContextMenuRadioGroup({
  ...props
}: ContextMenuPrimitive.RadioGroup.Props) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

/**
 * A radio-style item inside {@link ContextMenuRadioGroup}.
 *
 * Renders a tick icon on the trailing edge when this item's value matches
 * the group's selected value.
 *
 * @remarks
 * `inset` adds `pl-7` indent to align with other items.
 */
function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ContextMenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.RadioItem
      className={cn(
        "relative flex cursor-default select-none items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-inset:pl-7 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-inset={inset}
      data-slot="context-menu-radio-item"
      {...props}
    >
      {/* Tick indicator — absolutely positioned at the trailing edge */}
      <span className="pointer-events-none absolute right-2">
        <ContextMenuPrimitive.RadioItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

/** Horizontal divider between groups in {@link ContextMenuContent}. */
function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuPrimitive.Separator.Props) {
  return (
    <ContextMenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      data-slot="context-menu-separator"
      {...props}
    />
  );
}

/**
 * Trailing keyboard shortcut hint inside a {@link ContextMenuItem}.
 *
 * Visual only — wire the actual keyboard handler separately. The hint
 * text inherits the item's focus colour via the parent group selector.
 */
function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto text-muted-foreground text-xs tracking-widest group-focus/context-menu-item:text-accent-foreground",
        className
      )}
      data-slot="context-menu-shortcut"
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
