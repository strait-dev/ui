"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./command";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * A single selectable entry inside a {@link CommandMenuGroup}.
 *
 * @remarks
 * `keywords` are fed to the underlying `cmdk` `CommandItem` value/keywords
 * so fuzzy search works across more than just the visible `label`.
 */
export type CommandMenuItem = {
  /** Visible label rendered inside the palette row. */
  label: string;
  /** Optional leading icon — must be a Hugeicons `IconSvgElement`. */
  icon?: IconSvgElement;
  /**
   * Optional keyboard shortcut shown right-aligned, e.g. `"⌘P"`.
   * Rendered via the {@link CommandShortcut} primitive.
   */
  shortcut?: string;
  /**
   * Extra search tokens beyond `label`; passed to `cmdk` as the `value`
   * attribute alongside the label so items surface under synonyms.
   */
  keywords?: string[];
  /** Called when the item is activated (clicked or `Enter`). */
  onSelect: () => void;
};

/**
 * A named group of {@link CommandMenuItem}s rendered with a section heading
 * inside the {@link CommandMenu} palette.
 */
export type CommandMenuGroup = {
  /** Section heading displayed above the group's items. */
  heading: string;
  /** Ordered list of items in this group. */
  items: CommandMenuItem[];
};

/**
 * Props for the {@link CommandMenu} component.
 *
 * @remarks
 * `open` / `onOpenChange` follow the standard controlled / uncontrolled
 * duality: pass both to drive the palette externally, omit both to let
 * `CommandMenu` manage its own state.
 */
export type CommandMenuProps = {
  /** Groups of items rendered inside the palette. */
  groups: CommandMenuGroup[];
  /**
   * Controlled open state; when provided alongside `onOpenChange` the
   * parent fully owns open/close.
   */
  open?: boolean;
  /** Called when the palette requests an open-state change. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Placeholder text shown in the search input.
   * @defaultValue "Type a command or search..."
   */
  placeholder?: string;
  /**
   * Global hotkey that toggles the palette.
   * Uses `react-hotkeys-hook` notation — `"mod"` maps to `⌘` on macOS and
   * `Ctrl` on Windows/Linux.
   * @defaultValue "mod+k"
   */
  hotkey?: string;
  /**
   * Optional element rendered outside the dialog; clicking it opens the
   * palette. Typically a `<Button>` or an `<kbd>` hint.
   */
  trigger?: React.ReactNode;
  /**
   * Message shown by {@link CommandEmpty} when no items match the current
   * query.
   * @defaultValue "No results found."
   */
  emptyMessage?: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * A ⌘K command palette that combines the design-system {@link CommandDialog}
 * with a global hotkey from `react-hotkeys-hook`.
 *
 * Compose `groups` to populate the palette. Pass a `trigger` element to add a
 * clickable opener (e.g. a button that shows the shortcut hint). The palette
 * registers a global hotkey (`mod+k` by default) so it can be opened from
 * anywhere on the page without a focused trigger.
 *
 * @remarks
 * - The component supports both **controlled** (`open` + `onOpenChange`) and
 *   **uncontrolled** modes (no props needed beyond `groups`).
 * - Icons must be `IconSvgElement` values from `@hugeicons/core-free-icons`;
 *   they are rendered with a fixed `size={16}` via `HugeiconsIcon`.
 * - Items are searchable by `label` and by any extra `keywords` you provide.
 * - Selecting an item fires its `onSelect` callback, then closes the palette.
 *
 * @example
 * ```tsx
 * <CommandMenu
 *   groups={[
 *     {
 *       heading: "Navigation",
 *       items: [
 *         { label: "Home", icon: Home01Icon, shortcut: "⌘H", onSelect: () => router.push("/") },
 *         { label: "Settings", icon: Settings01Icon, onSelect: () => router.push("/settings") },
 *       ],
 *     },
 *   ]}
 *   trigger={<Button variant="outline" size="sm">Open palette</Button>}
 * />
 * ```
 *
 * @see {@link CommandMenuGroup}
 * @see {@link CommandMenuItem}
 */
function CommandMenu({
  groups,
  open,
  onOpenChange,
  placeholder = "Type a command or search...",
  hotkey = "mod+k",
  trigger,
  emptyMessage = "No results found.",
}: CommandMenuProps) {
  const isControlled = open !== undefined;

  const [localOpen, setLocalOpen] = React.useState(false);

  // Derive the effective open state and its setter.
  const effectiveOpen = isControlled ? open : localOpen;

  const setEffectiveOpen = React.useCallback(
    (next: boolean) => {
      if (isControlled) {
        onOpenChange?.(next);
      } else {
        setLocalOpen(next);
        onOpenChange?.(next);
      }
    },
    [isControlled, onOpenChange]
  );

  const toggleOpen = React.useCallback(() => {
    setEffectiveOpen(!effectiveOpen);
  }, [effectiveOpen, setEffectiveOpen]);

  // Register the global hotkey.
  useHotkeys(
    hotkey,
    () => {
      toggleOpen();
    },
    {
      enableOnFormTags: true,
      preventDefault: true,
    },
    [toggleOpen]
  );

  const handleSelect = React.useCallback(
    (item: CommandMenuItem) => {
      item.onSelect();
      setEffectiveOpen(false);
    },
    [setEffectiveOpen]
  );

  // Inject the open handler onto the trigger element (if provided) so we
  // avoid wrapping it in a non-interactive element.
  const triggerProps: React.HTMLAttributes<HTMLElement> & {
    "data-slot"?: string;
  } = {
    "data-slot": "command-menu-trigger",
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      const original = (
        trigger as React.ReactElement<React.HTMLAttributes<HTMLElement>>
      ).props.onClick;
      original?.(e);
      setEffectiveOpen(true);
    },
  };
  const triggerWithHandler =
    trigger != null && React.isValidElement(trigger)
      ? React.cloneElement(
          trigger as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
          triggerProps
        )
      : trigger;

  return (
    <>
      {triggerWithHandler != null && triggerWithHandler}
      <CommandDialog
        data-slot="command-menu"
        onOpenChange={setEffectiveOpen}
        open={effectiveOpen}
      >
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {groups.map((group) => (
              <CommandGroup heading={group.heading} key={group.heading}>
                {group.items.map((item) => {
                  const itemValue = item.keywords
                    ? [item.label, ...item.keywords].join(" ")
                    : item.label;

                  return (
                    <CommandItem
                      key={item.label}
                      onSelect={() => handleSelect(item)}
                      value={itemValue}
                    >
                      {item.icon != null && (
                        <HugeiconsIcon icon={item.icon} size={16} />
                      )}
                      <span>{item.label}</span>
                      {item.shortcut != null && (
                        <CommandShortcut>{item.shortcut}</CommandShortcut>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

export { CommandMenu };
