"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Tick02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { cn } from "../utils/index";

// ---------------------------------------------------------------------------
// Size context — set once on Select root, consumed by SelectContent/SelectItem
// ---------------------------------------------------------------------------

/**
 * Available size values for the Select component system.
 *
 * | Value | Trigger height | Item padding/text |
 * |-------|---------------|-------------------|
 * | `sm` | `h-7` | `py-0.5 text-xs` |
 * | `default` | `h-8` | `py-1 text-sm` |
 * | `lg` | `h-9` | `py-1.5 text-sm` |
 */
export type SelectSize = "sm" | "default" | "lg";

/**
 * Internal context that threads the `size` value from the
 * {@link Select} root down to {@link SelectContent} and
 * {@link SelectItem} without prop-drilling.
 */
const SelectSizeContext = React.createContext<SelectSize>("default");

// ---------------------------------------------------------------------------
// Internal items context (unchanged from original)
// ---------------------------------------------------------------------------

/** Internal map of option value → display label, shared via context. */
type ItemsMap = Map<string, string>;

/**
 * Internal context used by {@link Select} to pass the items registry
 * down to {@link SelectValue} and {@link SelectItem} without prop
 * drilling.
 */
const SelectItemsContext = React.createContext<{
  register: (value: string, label: string) => void;
  items: ItemsMap;
}>({
  register: () => {
    // default no-op
  },
  items: new Map(),
});

// ---------------------------------------------------------------------------
// Select root
// ---------------------------------------------------------------------------

/**
 * Accessible single-value dropdown built on Base UI's `Select`
 * primitive.
 *
 * Compose it with {@link SelectTrigger} (containing
 * {@link SelectValue}), {@link SelectContent} (containing
 * {@link SelectItem} / {@link SelectGroup} / {@link SelectLabel}),
 * and the optional {@link SelectSeparator}.
 *
 * @remarks
 * - `Select` maintains an internal registry that maps each option
 *   `value` to its display label. {@link SelectValue} reads that
 *   registry to show the human-readable label for the current
 *   selection without re-traversing the React tree.
 * - The optional `size` prop (`"sm" | "default" | "lg"`) is stored in
 *   {@link SelectSizeContext} and automatically cascades to
 *   {@link SelectTrigger}, {@link SelectContent}, and every
 *   {@link SelectItem}. You only need to set it once on the root.
 *   You can also override size directly on `<SelectTrigger size="…" />`.
 * - For accessible forms, pair the trigger with a `<Label>` whose
 *   `htmlFor` points to the trigger's `id`.
 * - To make the dropdown controlled, pass `value` and
 *   `onValueChange` to the root. Uncontrolled usage relies on
 *   `defaultValue`.
 *
 * @example
 * ```tsx
 * <Select defaultValue="react" size="lg">
 *   <SelectTrigger className="w-40">
 *     <SelectValue placeholder="Pick a framework" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="react">React</SelectItem>
 *     <SelectItem value="vue">Vue</SelectItem>
 *     <SelectItem value="svelte">Svelte</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
function Select({
  children,
  size = "default",
  ...props
}: SelectPrimitive.Root.Props<string> & {
  /** Size applied to the entire Select system via context. */
  size?: SelectSize;
}) {
  const itemsRef = React.useRef<ItemsMap>(new Map());
  // Dummy counter used only to force a re-render when new items
  // register themselves after the initial mount.
  const [, forceUpdate] = React.useState(0);

  const contextValue = React.useMemo(
    () => ({
      register: (value: string, label: string) => {
        // Only update (and re-render) when the label actually changes,
        // preventing infinite update loops.
        if (itemsRef.current.get(value) !== label) {
          itemsRef.current.set(value, label);
          forceUpdate((n) => n + 1);
        }
      },
      items: itemsRef.current,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <SelectSizeContext.Provider value={size}>
      <SelectItemsContext.Provider value={contextValue}>
        <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>
      </SelectItemsContext.Provider>
    </SelectSizeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// SelectGroup
// ---------------------------------------------------------------------------

/** Container that visually groups related {@link SelectItem}s. */
function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      className={cn("scroll-my-1 p-1", className)}
      data-slot="select-group"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// SelectValue
// ---------------------------------------------------------------------------

/**
 * Renders the currently selected option's label inside
 * {@link SelectTrigger}.
 *
 * @remarks
 * Looks up the human-readable label from the internal items registry
 * populated by each rendered {@link SelectItem}. Falls back to
 * stringifying the raw value when no matching label is found.
 * The `placeholder` is shown (muted) when no value is selected.
 */
function SelectValue({
  className,
  placeholder,
  ...props
}: Omit<SelectPrimitive.Value.Props, "children"> & {
  placeholder?: string;
}) {
  const { items } = React.useContext(SelectItemsContext);

  return (
    <SelectPrimitive.Value
      className={cn("flex flex-1 text-left", className)}
      data-slot="select-value"
      {...props}
    >
      {(value) => {
        if (value == null || value === "") {
          return <span className="text-muted-foreground">{placeholder}</span>;
        }
        const label = items.get(String(value));
        return <>{label ?? String(value)}</>;
      }}
    </SelectPrimitive.Value>
  );
}

// ---------------------------------------------------------------------------
// SelectTrigger
// ---------------------------------------------------------------------------

/**
 * Props for {@link SelectTrigger}.
 *
 * @remarks
 * `SelectPrimitive.Trigger.Props` extends `HTMLButtonElement` props via
 * Base UI's `BaseUIComponentProps<'button', …>`. A native `<button>`
 * element does **not** expose a `size` attribute in the HTML spec
 * (unlike `<input>` or `<select>`), so there is no numeric-`size`
 * collision and no `Omit` is required here.
 */
export type SelectTriggerProps = SelectPrimitive.Trigger.Props & {
  /**
   * Height / border-radius scale of the trigger button.
   *
   * | Value | Height class | Border-radius note |
   * |-------|-------------|-------------------|
   * | `sm` | `h-7` | Tighter radius |
   * | `default` | `h-8` | Standard |
   * | `lg` | `h-9` | Standard |
   *
   * Falls back to the value provided by the nearest {@link Select} root
   * via context when omitted.
   */
  size?: SelectSize;
};

/**
 * The button that opens the {@link SelectContent} dropdown.
 *
 * @remarks
 * The `size` prop (`"sm" | "default" | "lg"`) adjusts height and border
 * radius. When omitted, inherits the value from the nearest {@link Select}
 * root via {@link SelectSizeContext}. Always place a {@link SelectValue}
 * inside to display the current selection. The chevron icon is rendered
 * automatically.
 *
 * A `data-size` attribute is written onto the DOM element so descendent
 * items can use `group-data-[size=…]` selectors to cascade size-aware
 * styles (mirroring the `card.tsx` cascade pattern).
 */
function SelectTrigger({
  className,
  size: sizeProp,
  children,
  ...props
}: SelectTriggerProps) {
  const contextSize = React.useContext(SelectSizeContext);
  const size = sizeProp ?? contextSize;

  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex w-fit select-none items-center justify-between gap-1.5 whitespace-nowrap rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm outline-none transition-colors",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "data-placeholder:text-muted-foreground",
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5",
        "dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        // size-specific overrides
        "data-[size=sm]:h-7 data-[size=sm]:rounded-lg",
        "data-[size=default]:h-8",
        "data-[size=lg]:h-9 data-[size=lg]:text-sm",
        className
      )}
      data-size={size}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <HugeiconsIcon
            className="pointer-events-none size-4 text-muted-foreground"
            icon={UnfoldMoreIcon}
            strokeWidth={2}
          />
        }
      />
    </SelectPrimitive.Trigger>
  );
}

// ---------------------------------------------------------------------------
// SelectContent
// ---------------------------------------------------------------------------

/**
 * Floating dropdown panel rendered via a portal inside
 * {@link Select}.
 *
 * @remarks
 * Wraps Base UI's `Positioner` + `Popup`. The `side`, `sideOffset`,
 * `align`, and `alignOffset` props control placement. When
 * `alignItemWithTrigger` is `true` (default), the popup scrolls so
 * the selected item aligns with the trigger, matching native `<select>`
 * behaviour.
 *
 * Accepts an optional `size` prop that overrides the context value.
 * The resolved size is written as a `data-size` attribute on the popup
 * element so individual {@link SelectItem}s can adapt via
 * `group-data-[size=…]` cascade selectors.
 *
 * Embed {@link SelectItem}s directly or group them with
 * {@link SelectGroup} / {@link SelectLabel} / {@link SelectSeparator}.
 */
function SelectContent({
  className,
  children,
  size: sizeProp,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  > & {
    /** Override the size inherited from {@link Select} root context. */
    size?: SelectSize;
  }) {
  const contextSize = React.useContext(SelectSizeContext);
  const size = sizeProp ?? contextSize;

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        alignOffset={alignOffset}
        className="isolate z-(--z-popover)"
        side={side}
        sideOffset={sideOffset}
      >
        <SelectPrimitive.Popup
          className={cn(
            "data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95",
            "relative isolate z-(--z-popover) max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-(--duration-base) data-closed:duration-(--duration-fast)",
            "data-[align-trigger=true]:animate-none data-closed:animate-out data-open:animate-in",
            // group class enables cascade to SelectItem via group-data-[size=…]
            "group/select-content",
            className
          )}
          data-align-trigger={alignItemWithTrigger}
          data-size={size}
          data-slot="select-content"
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

// ---------------------------------------------------------------------------
// SelectLabel
// ---------------------------------------------------------------------------

/** Muted section heading rendered above a {@link SelectGroup}. */
function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      className={cn("px-1.5 py-1 text-muted-foreground text-xs", className)}
      data-slot="select-label"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// SelectItem
// ---------------------------------------------------------------------------

/**
 * A single selectable option inside {@link SelectContent}.
 *
 * @remarks
 * On mount the item registers its `value` → label pair in the
 * {@link SelectItemsContext} so {@link SelectValue} can display the
 * correct label without traversing children. When `children` is a
 * string it is used as the label; otherwise the raw `value` string
 * is used as a fallback. A checkmark indicator appears on the
 * selected item.
 *
 * Item padding and text size cascade automatically from the `data-size`
 * written by the nearest {@link SelectContent} ancestor via the
 * `group-data-[size=…]/select-content` pattern:
 *
 * | Size | Padding | Text size |
 * |------|---------|-----------|
 * | `sm` | `py-0.5` | `text-xs` |
 * | `default` | `py-1` | `text-sm` |
 * | `lg` | `py-1.5` | `text-sm` |
 */
function SelectItem({
  className,
  children,
  value,
  ...props
}: SelectPrimitive.Item.Props) {
  const { register } = React.useContext(SelectItemsContext);

  // Register value → label so SelectValue can resolve the label
  // without traversing the React tree.
  React.useEffect(() => {
    if (value != null) {
      const label = typeof children === "string" ? children : String(value);
      register(String(value), label);
    }
  }, [value, children, register]);

  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-default select-none items-center gap-1.5 rounded-md pr-8 pl-1.5 outline-hidden",
        "focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        "*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        // size cascade from SelectContent group (default: py-1 text-sm)
        "py-1 text-sm",
        "group-data-[size=sm]/select-content:py-0.5 group-data-[size=sm]/select-content:text-xs",
        "group-data-[size=lg]/select-content:py-1.5 group-data-[size=lg]/select-content:text-sm",
        className
      )}
      data-slot="select-item"
      value={value}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <HugeiconsIcon
          className="pointer-events-none"
          icon={Tick02Icon}
          strokeWidth={2}
        />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

// ---------------------------------------------------------------------------
// SelectSeparator
// ---------------------------------------------------------------------------

/** Thin horizontal divider between option groups in a {@link Select}. */
function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      data-slot="select-separator"
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Scroll buttons
// ---------------------------------------------------------------------------

/**
 * Arrow button that appears at the top of {@link SelectContent} when
 * the list is scrollable; clicking it scrolls the list up.
 */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="select-scroll-up-button"
      {...props}
    >
      <HugeiconsIcon aria-hidden="true" icon={ArrowUp01Icon} strokeWidth={2} />
    </SelectPrimitive.ScrollUpArrow>
  );
}

/**
 * Arrow button that appears at the bottom of {@link SelectContent}
 * when the list is scrollable; clicking it scrolls the list down.
 */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      data-slot="select-scroll-down-button"
      {...props}
    >
      <HugeiconsIcon
        aria-hidden="true"
        icon={ArrowDown01Icon}
        strokeWidth={2}
      />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
