"use client";

import { SearchIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Command as CommandPrimitive } from "cmdk";
import type * as React from "react";
import { cn } from "../utils/index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { InputGroup, InputGroupAddon } from "./input-group";

/**
 * Size tokens for the {@link CommandList} size axis.
 *
 * - `sm`      — compact: `py-1` item padding, `text-xs` labels.
 * - `default` — standard: `py-1.5` item padding, `text-sm` labels (unchanged).
 * - `lg`      — spacious: `py-2` item padding, `text-base` labels.
 *
 * The value is propagated downward via a `data-size` attribute so that
 * {@link CommandItem} (and any custom sub-parts) can react with
 * `group-data-[size=sm]:…` / `group-data-[size=lg]:…` selectors.
 */
type CommandListSize = "sm" | "default" | "lg";

/** Props for {@link Command}. */
export type CommandProps = React.ComponentProps<typeof CommandPrimitive>;

/**
 * A keyboard-navigable command palette built on the `cmdk` primitive.
 *
 * Compose it with {@link CommandInput}, {@link CommandList},
 * {@link CommandGroup}, {@link CommandItem}, and {@link CommandEmpty} to
 * build a filterable list of actions. For a floating modal variant, use
 * {@link CommandDialog} instead of embedding `Command` inline.
 *
 * @remarks
 * - Filtering and keyboard navigation (arrow keys, Enter, Escape) are
 *   handled entirely by the `cmdk` library; no additional wiring is needed.
 * - {@link CommandItem} automatically renders a tick icon when the item is
 *   checked (`data-checked="true"`); the icon is hidden when a
 *   {@link CommandShortcut} is present to avoid overlap.
 * - All styling runs on Tailwind v4 utility classes; override individual
 *   parts by passing `className` down the tree.
 *
 * @example
 * ```tsx
 * <Command>
 *   <CommandInput placeholder="Type a command…" />
 *   <CommandList>
 *     <CommandEmpty>No results found.</CommandEmpty>
 *     <CommandGroup heading="Actions">
 *       <CommandItem onSelect={() => runAction()}>
 *         New File
 *         <CommandShortcut>⌘N</CommandShortcut>
 *       </CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </Command>
 * ```
 */
function Command({ className, ...props }: CommandProps) {
  return (
    <CommandPrimitive
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-lg! bg-popover p-1 text-popover-foreground",
        className
      )}
      data-slot="command"
      {...props}
    />
  );
}

/**
 * A modal {@link Dialog} pre-configured for the command palette pattern.
 *
 * The title and description are rendered `sr-only` for screen readers while
 * remaining invisible to sighted users. Set `showCloseButton={true}` only
 * when the Escape key alone is insufficient for your use case.
 *
 * @remarks
 * The dialog is positioned at `top-1/3` (not centred) to keep it close to
 * where the user's gaze lands when they first open it.
 */
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "top-1/3 translate-y-0 overflow-hidden rounded-lg! p-0",
          className
        )}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

/**
 * The search input for a {@link Command} palette; renders inside an
 * {@link InputGroup} with a trailing search icon.
 */
function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="p-1 pb-0" data-slot="command-input-wrapper">
      <InputGroup className="h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!">
        <CommandPrimitive.Input
          className={cn(
            "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          data-slot="command-input"
          {...props}
        />
        <InputGroupAddon>
          <HugeiconsIcon
            className="size-4 shrink-0 opacity-50"
            icon={SearchIcon}
            strokeWidth={2}
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

/**
 * Scrollable container that holds all {@link CommandGroup}s and
 * {@link CommandEmpty}; capped at `max-h-72` with hidden scrollbars.
 *
 * @param size - Controls item density across the entire list.
 *   - `"sm"`      — `py-1` padding on items, `text-xs` item text.
 *   - `"default"` — `py-1.5` padding on items, `text-sm` item text (unchanged default).
 *   - `"lg"`      — `py-2` padding on items, `text-base` item text.
 *
 *   The value is forwarded as `data-size` so child items can respond via
 *   `group-data-[size=sm]:…` / `group-data-[size=lg]:…` Tailwind selectors.
 */
function CommandList({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List> & {
  size?: CommandListSize;
}) {
  return (
    <CommandPrimitive.List
      className={cn(
        "no-scrollbar max-h-72 scroll-py-1 overflow-y-auto overflow-x-hidden outline-none",
        className
      )}
      data-size={size}
      data-slot="command-list"
      {...props}
    />
  );
}

/**
 * Shown by `cmdk` when no {@link CommandItem}s match the current query;
 * renders centred placeholder text.
 */
function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className={cn("py-6 text-center text-sm", className)}
      data-slot="command-empty"
      {...props}
    />
  );
}

/**
 * A labelled section inside a {@link CommandList}; its heading text is
 * styled via the `[cmdk-group-heading]` attribute selector.
 */
function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      className={cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground **:[[cmdk-group-heading]]:text-xs",
        className
      )}
      data-slot="command-group"
      {...props}
    />
  );
}

/** A horizontal rule separating {@link CommandGroup}s. */
function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      className={cn("-mx-1 h-px bg-border", className)}
      data-slot="command-separator"
      {...props}
    />
  );
}

/**
 * A single selectable row inside a {@link CommandGroup}.
 *
 * @remarks
 * A tick icon is injected after `children` and is made visible when
 * `data-checked="true"` is set by `cmdk` (e.g. for multi-select palettes).
 * The tick is hidden via CSS when a {@link CommandShortcut} sibling is
 * present to avoid layout conflicts.
 *
 * Size density is inherited from the nearest `[data-size]` ancestor
 * (i.e. {@link CommandList}) via `group-data-[size=sm]:…` /
 * `group-data-[size=lg]:…` selectors — no additional prop is needed here.
 */
function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        // Base layout — unchanged default appearance.
        "group/command-item relative flex cursor-default select-none items-center gap-2 in-data-[slot=dialog-content]:rounded-lg! rounded-sm px-2 outline-hidden data-[disabled=true]:pointer-events-none data-selected:bg-muted data-selected:text-foreground data-[disabled=true]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-selected:*:[svg]:text-foreground",
        // Vertical padding / text-size respond to the CommandList `data-size` attribute.
        "py-1.5 text-sm",
        "in-data-[size=sm]:py-1 in-data-[size=sm]:text-xs",
        "in-data-[size=lg]:py-2 in-data-[size=lg]:text-base",
        className
      )}
      data-slot="command-item"
      {...props}
    >
      {children}
      {/* Tick appears when item is checked; hidden when shortcut is present */}
      <HugeiconsIcon
        className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
        icon={Tick02Icon}
        strokeWidth={2}
      />
    </CommandPrimitive.Item>
  );
}

/**
 * Keyboard shortcut hint pushed to the trailing end of a
 * {@link CommandItem}; inherits the selected item's foreground colour.
 */
function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-auto text-muted-foreground text-xs tracking-widest group-data-selected/command-item:text-foreground",
        className
      )}
      data-slot="command-shortcut"
      {...props}
    />
  );
}

export type { CommandListSize };
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
