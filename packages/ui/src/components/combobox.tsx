"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { cn } from "../utils/index";
import { Button } from "./button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group";

/**
 * Root state provider for the combobox. Wrap all other
 * `Combobox*` parts inside it.
 *
 * @remarks
 * A direct re-export of Base UI's `Combobox.Root`; pass `value` /
 * `onValueChange` for controlled usage, or `defaultValue` for
 * uncontrolled usage. Supports both single and multiple selection
 * depending on the `multiple` prop from Base UI.
 *
 * For a combobox with chip-style multi-value display use
 * {@link ComboboxChips} + {@link ComboboxChip} + {@link ComboboxChipsInput}.
 * For a simple text-input trigger use {@link ComboboxInput}.
 *
 * @example
 * ```tsx
 * <Combobox>
 *   <ComboboxInput placeholder="Search…" />
 *   <ComboboxContent>
 *     <ComboboxList>
 *       <ComboboxItem value="react">React</ComboboxItem>
 *       <ComboboxItem value="vue">Vue</ComboboxItem>
 *       <ComboboxEmpty>No results.</ComboboxEmpty>
 *     </ComboboxList>
 *   </ComboboxContent>
 * </Combobox>
 * ```
 */
const Combobox = ComboboxPrimitive.Root;

/** Renders the current value of a {@link Combobox}. */
function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

/**
 * Toggle button that opens or closes the {@link ComboboxContent}
 * dropdown; appends a down-chevron icon after `children`.
 */
function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      data-slot="combobox-trigger"
      {...props}
    >
      {children}
      <HugeiconsIcon
        className="pointer-events-none size-4 text-muted-foreground"
        icon={ArrowDown01Icon}
        strokeWidth={2}
      />
    </ComboboxPrimitive.Trigger>
  );
}

/**
 * Ghost icon-button that clears the current {@link Combobox} value;
 * rendered as an {@link InputGroupButton} so it sits flush inside an
 * {@link InputGroupAddon}.
 */
function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      className={cn(className)}
      data-slot="combobox-clear"
      render={<InputGroupButton size="icon-xs" variant="ghost" />}
      {...props}
    >
      <HugeiconsIcon
        className="pointer-events-none"
        icon={Cancel01Icon}
        strokeWidth={2}
      />
    </ComboboxPrimitive.Clear>
  );
}

/**
 * Text input for typing search queries inside a {@link Combobox},
 * wrapped in an {@link InputGroup} with optional addon buttons.
 *
 * @remarks
 * - `showTrigger` (default `true`) appends a {@link ComboboxTrigger}
 *   button that toggles the dropdown without typing. The trigger is
 *   hidden automatically when a {@link ComboboxClear} button is
 *   present via the `group-has-data-[slot=combobox-clear]` selector.
 * - `showClear` (default `false`) appends a {@link ComboboxClear}
 *   button that resets the selected value.
 * - Pass extra children (e.g. a leading icon addon) after the built-in
 *   buttons; they are rendered after the inline-end addon.
 */
function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  showClear?: boolean;
}) {
  return (
    <InputGroup className={cn("w-auto", className)}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            aria-label="Toggle suggestions"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            data-slot="input-group-button"
            disabled={disabled}
            render={<ComboboxTrigger />}
            size="icon-xs"
            variant="ghost"
          />
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

/**
 * Floating dropdown panel for a {@link Combobox}, rendered via a
 * portal.
 *
 * @remarks
 * Wraps Base UI's `Positioner` + `Popup`. The `side`, `sideOffset`,
 * `align`, and `alignOffset` props control placement. When the
 * `anchor` prop is provided (see {@link useComboboxAnchor}), the
 * popup anchors to a custom element (e.g. a chips container) instead
 * of the trigger, and a `data-chips` attribute enables chip-mode
 * min-width styles.
 *
 * Place a {@link ComboboxList} (containing {@link ComboboxItem}s)
 * inside, optionally preceded by an inline search
 * {@link ComboboxInput}.
 */
function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <ComboboxPrimitive.Popup
          className={cn(
            "group/combobox-content data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 relative max-h-(--available-height) w-(--anchor-width) min-w-[calc(var(--anchor-width)+--spacing(7))] max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-closed:animate-out data-open:animate-in *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none",
            className
          )}
          data-chips={!!anchor}
          data-slot="combobox-content"
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

/**
 * Scrollable list container inside {@link ComboboxContent}; place
 * {@link ComboboxItem}s or {@link ComboboxGroup}s directly inside.
 */
function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      className={cn(
        "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
        className
      )}
      data-slot="combobox-list"
      {...props}
    />
  );
}

/**
 * A single selectable option inside {@link ComboboxList}; renders a
 * checkmark indicator when the item is selected.
 */
function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50 not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot="combobox-item"
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <HugeiconsIcon
          className="pointer-events-none"
          icon={Tick02Icon}
          strokeWidth={2}
        />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}

/**
 * Groups related {@link ComboboxItem}s; pair with
 * {@link ComboboxLabel} to give the group an accessible heading.
 */
function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      className={cn(className)}
      data-slot="combobox-group"
      {...props}
    />
  );
}

/** Muted group heading rendered above a set of {@link ComboboxItem}s
 *  inside a {@link ComboboxGroup}. */
function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      className={cn("px-2 py-1.5 text-muted-foreground text-xs", className)}
      data-slot="combobox-label"
      {...props}
    />
  );
}

/**
 * Virtualisation wrapper for large lists; pass your data array via
 * Base UI's `Collection` API instead of mapping over
 * {@link ComboboxItem}s manually.
 */
function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  );
}

/**
 * Slot rendered (as `flex`) inside {@link ComboboxContent} when the
 * filtered list is empty; hidden otherwise via the
 * `group-data-empty/combobox-content` selector.
 */
function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      className={cn(
        "hidden w-full justify-center py-2 text-center text-muted-foreground text-sm group-data-empty/combobox-content:flex",
        className
      )}
      data-slot="combobox-empty"
      {...props}
    />
  );
}

/** Thin horizontal divider between item groups in {@link ComboboxList}. */
function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      data-slot="combobox-separator"
      {...props}
    />
  );
}

/**
 * Multi-value input container that shows the current selection as
 * {@link ComboboxChip} badges and hosts a {@link ComboboxChipsInput}
 * for filtering.
 *
 * @remarks
 * Pair with {@link useComboboxAnchor} + {@link ComboboxContent}'s
 * `anchor` prop so the dropdown aligns to this element rather than
 * the default trigger. Focus ring and `aria-invalid` styles are
 * applied to the wrapper rather than the inner input.
 */
function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      className={cn(
        "flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-data-[slot=combobox-chip]:px-1 has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      data-slot="combobox-chips"
      {...props}
    />
  );
}

/**
 * A badge representing one selected value inside
 * {@link ComboboxChips}.
 *
 * @remarks
 * When `showRemove` is `true` (default), a ghost remove button is
 * appended that deselects the option. Set `showRemove={false}` for
 * non-removable chips (e.g. fixed / required options).
 */
function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) {
  return (
    <ComboboxPrimitive.Chip
      className={cn(
        "flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 whitespace-nowrap rounded-sm bg-muted px-1.5 font-medium text-foreground text-xs has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-data-[slot=combobox-chip-remove]:pr-0 has-disabled:opacity-50",
        className
      )}
      data-slot="combobox-chip"
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          className="-ml-1 opacity-50 hover:opacity-100"
          data-slot="combobox-chip-remove"
          render={<Button size="icon-xs" variant="ghost" />}
        >
          <HugeiconsIcon
            className="pointer-events-none"
            icon={Cancel01Icon}
            strokeWidth={2}
          />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}

/**
 * Inline text input rendered inside {@link ComboboxChips} that
 * filters available options as the user types.
 */
function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      className={cn("min-w-16 flex-1 outline-none", className)}
      data-slot="combobox-chip-input"
      {...props}
    />
  );
}

/**
 * Returns a stable `ref` object that can be passed as the `anchor`
 * prop of {@link ComboboxContent} and attached to a custom anchor
 * element (e.g. a {@link ComboboxChips} container) so the dropdown
 * positions itself relative to that element.
 */
function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
