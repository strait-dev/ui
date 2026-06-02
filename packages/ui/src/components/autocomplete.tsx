"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { Cancel01Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../utils/index";
import { ScrollArea } from "./scroll-area";

/**
 * CVA recipe driving the height, horizontal padding, and trigger/clear offset
 * of the {@link AutocompleteInput}. Heights mirror the {@link Input} primitive
 * (`sm` → `h-7`, `default` → `h-8`, `lg` → `h-9`) so autocompletes line up with
 * other form controls.
 */
const inputVariants = cva(
  "flex w-full min-w-0 rounded-lg border border-input bg-transparent text-foreground text-sm outline-none transition-colors placeholder:text-muted-foreground read-only:cursor-not-allowed read-only:bg-muted/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80",
  {
    variants: {
      size: {
        sm: "h-7 px-2.5 [&~[data-slot=autocomplete-clear]]:end-1.5 [&~[data-slot=autocomplete-trigger]]:end-1.5",
        default:
          "h-8 px-2.5 [&~[data-slot=autocomplete-clear]]:end-2 [&~[data-slot=autocomplete-trigger]]:end-2",
        lg: "h-9 px-3 [&~[data-slot=autocomplete-clear]]:end-2.5 [&~[data-slot=autocomplete-trigger]]:end-2.5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

/** Props for {@link Autocomplete}. */
export type AutocompleteProps = React.ComponentProps<
  typeof AutocompletePrimitive.Root
>;

/**
 * Root state provider for the autocomplete. Wrap all other `Autocomplete*`
 * parts inside it.
 *
 * @remarks
 * A direct re-export of Base UI's `Autocomplete.Root`. Pass `items` (a flat
 * array or array of groups), `value` / `onValueChange` for a controlled input
 * string, and `mode` (`"list"` | `"both"` | `"inline"` | `"none"`) to choose
 * between filtering and inline completion. Set `autoHighlight` to pre-highlight
 * the first match as the user types.
 *
 * @example
 * ```tsx
 * <Autocomplete items={fruits}>
 *   <AutocompleteInput placeholder="Search fruits…" />
 *   <AutocompleteContent>
 *     <AutocompleteEmpty>No results.</AutocompleteEmpty>
 *     <AutocompleteList>
 *       {(item: string) => (
 *         <AutocompleteItem key={item} value={item}>
 *           {item}
 *         </AutocompleteItem>
 *       )}
 *     </AutocompleteList>
 *   </AutocompleteContent>
 * </Autocomplete>
 * ```
 */
const Autocomplete = AutocompletePrimitive.Root;

/** Renders the current value of an {@link Autocomplete}. */
function AutocompleteValue({ ...props }: AutocompletePrimitive.Value.Props) {
  return (
    <AutocompletePrimitive.Value data-slot="autocomplete-value" {...props} />
  );
}

/**
 * Text input for typing search queries inside an {@link Autocomplete}.
 *
 * @remarks
 * Wrapped in a `relative` container so the optional inline buttons can be
 * absolutely positioned. `showTrigger` appends an {@link AutocompleteTrigger}
 * chevron that opens the list, and `showClear` appends an
 * {@link AutocompleteClear} button; when both are present the trigger hides
 * itself in favour of the clear button.
 */
function AutocompleteInput({
  className,
  size = "default",
  showClear = false,
  showTrigger = false,
  ...props
}: Omit<AutocompletePrimitive.Input.Props, "size"> &
  VariantProps<typeof inputVariants> & {
    /** Append an {@link AutocompleteClear} button inside the field. */
    showClear?: boolean;
    /** Append an {@link AutocompleteTrigger} chevron inside the field. */
    showTrigger?: boolean;
  }) {
  return (
    <div className="relative w-full">
      <AutocompletePrimitive.Input
        className={cn(
          inputVariants({ size }),
          (showClear || showTrigger) && "pe-8",
          className
        )}
        data-size={size}
        data-slot="autocomplete-input"
        {...props}
      />
      {showTrigger && <AutocompleteTrigger />}
      {showClear && <AutocompleteClear />}
    </div>
  );
}

/**
 * Live-region status line (e.g. "5 results") rendered above the
 * {@link AutocompleteList}; collapses to nothing when empty.
 */
function AutocompleteStatus({
  className,
  ...props
}: AutocompletePrimitive.Status.Props) {
  return (
    <AutocompletePrimitive.Status
      className={cn(
        "px-2 py-1.5 text-muted-foreground text-sm empty:m-0 empty:p-0",
        className
      )}
      data-slot="autocomplete-status"
      {...props}
    />
  );
}

/** Portals the {@link AutocompleteContent} into `document.body`. */
function AutocompletePortal({ ...props }: AutocompletePrimitive.Portal.Props) {
  return (
    <AutocompletePrimitive.Portal data-slot="autocomplete-portal" {...props} />
  );
}

/** Dimmed overlay rendered behind {@link AutocompleteContent} when enabled. */
function AutocompleteBackdrop({
  ...props
}: AutocompletePrimitive.Backdrop.Props) {
  return (
    <AutocompletePrimitive.Backdrop
      data-slot="autocomplete-backdrop"
      {...props}
    />
  );
}

/** Positions the {@link AutocompleteContent} popup relative to its anchor. */
function AutocompletePositioner({
  className,
  ...props
}: AutocompletePrimitive.Positioner.Props) {
  return (
    <AutocompletePrimitive.Positioner
      className={cn("z-50 outline-none", className)}
      data-slot="autocomplete-positioner"
      {...props}
    />
  );
}

/**
 * Scrollable list container inside {@link AutocompleteContent}; place
 * {@link AutocompleteItem}s, {@link AutocompleteGroup}s, or a render function
 * directly inside. Wraps content in a {@link ScrollArea}.
 */
function AutocompleteList({
  className,
  scrollAreaClassName,
  ...props
}: AutocompletePrimitive.List.Props & {
  /** Extra classes for the wrapping {@link ScrollArea}. */
  scrollAreaClassName?: string;
}) {
  return (
    <ScrollArea
      className={cn(
        "size-full min-h-0 **:data-[slot=scroll-area-viewport]:overscroll-contain",
        scrollAreaClassName
      )}
    >
      <AutocompletePrimitive.List
        className={cn("not-empty:scroll-py-1 not-empty:p-1", className)}
        data-slot="autocomplete-list"
        {...props}
      />
    </ScrollArea>
  );
}

/**
 * Virtualisation wrapper for large lists; pass your data array via Base UI's
 * `Collection` API instead of mapping over {@link AutocompleteItem}s manually.
 */
function AutocompleteCollection({
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Collection>) {
  return (
    <AutocompletePrimitive.Collection
      data-slot="autocomplete-collection"
      {...props}
    />
  );
}

/** A single row inside a grid-mode {@link AutocompleteList}. */
function AutocompleteRow({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Row>) {
  return (
    <AutocompletePrimitive.Row
      className={cn("flex items-center gap-2", className)}
      data-slot="autocomplete-row"
      {...props}
    />
  );
}

/** A single selectable option inside {@link AutocompleteList}. */
function AutocompleteItem({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Item>) {
  return (
    <AutocompletePrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-foreground text-sm outline-hidden transition-colors data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot="autocomplete-item"
      {...props}
    />
  );
}

/** Props for {@link AutocompleteContent}. */
export interface AutocompleteContentProps
  extends React.ComponentProps<typeof AutocompletePrimitive.Popup> {
  /** Alignment of the popup against its anchor (default `"start"`). */
  align?: AutocompletePrimitive.Positioner.Props["align"];
  /** Offset in pixels along the alignment axis (default `0`). */
  alignOffset?: AutocompletePrimitive.Positioner.Props["alignOffset"];
  /** Custom anchor element to position against instead of the input. */
  anchor?: AutocompletePrimitive.Positioner.Props["anchor"];
  /** Render an {@link AutocompleteBackdrop} behind the popup. */
  showBackdrop?: boolean;
  /** Preferred side to place the popup (default `"bottom"`). */
  side?: AutocompletePrimitive.Positioner.Props["side"];
  /** Gap in pixels between the popup and its anchor (default `4`). */
  sideOffset?: AutocompletePrimitive.Positioner.Props["sideOffset"];
}

/**
 * Floating dropdown panel for an {@link Autocomplete}, rendered via a portal.
 *
 * @remarks
 * Composes {@link AutocompletePortal}, {@link AutocompletePositioner}, and Base
 * UI's `Popup`. Place an {@link AutocompleteList} (with {@link AutocompleteItem}s
 * or {@link AutocompleteGroup}s) and an {@link AutocompleteEmpty} inside.
 */
function AutocompleteContent({
  className,
  children,
  showBackdrop = false,
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  side = "bottom",
  anchor,
  ...props
}: AutocompleteContentProps) {
  return (
    <AutocompletePortal>
      {showBackdrop && <AutocompleteBackdrop />}
      <AutocompletePositioner
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        side={side}
        sideOffset={sideOffset}
      >
        <AutocompletePrimitive.Popup
          className={cn(
            "flex max-h-[min(var(--available-height),24rem)] w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) flex-col overflow-hidden rounded-lg bg-popover py-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 transition-[transform,opacity] data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0",
            className
          )}
          data-slot="autocomplete-popup"
          {...props}
        >
          {children}
        </AutocompletePrimitive.Popup>
      </AutocompletePositioner>
    </AutocompletePortal>
  );
}

/**
 * Groups related {@link AutocompleteItem}s; pair with
 * {@link AutocompleteGroupLabel} to give the group an accessible heading.
 */
function AutocompleteGroup({
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Group>) {
  return (
    <AutocompletePrimitive.Group data-slot="autocomplete-group" {...props} />
  );
}

/** Muted group heading rendered above a set of {@link AutocompleteItem}s. */
function AutocompleteGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.GroupLabel>) {
  return (
    <AutocompletePrimitive.GroupLabel
      className={cn(
        "px-2 py-1.5 font-medium text-muted-foreground text-xs",
        className
      )}
      data-slot="autocomplete-group-label"
      {...props}
    />
  );
}

/** Slot shown inside {@link AutocompleteContent} when no items match. */
function AutocompleteEmpty({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Empty>) {
  return (
    <AutocompletePrimitive.Empty
      className={cn(
        "px-2 py-1.5 text-center text-muted-foreground text-sm empty:m-0 empty:p-0",
        className
      )}
      data-slot="autocomplete-empty"
      {...props}
    />
  );
}

/**
 * Button that clears the {@link AutocompleteInput} value; absolutely positioned
 * inside the field and hidden until there is a value to clear.
 */
function AutocompleteClear({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Clear>) {
  return (
    <AutocompletePrimitive.Clear
      aria-label="Clear"
      className={cn(
        "absolute top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none data-disabled:pointer-events-none",
        className
      )}
      data-slot="autocomplete-clear"
      {...props}
    >
      <HugeiconsIcon
        aria-hidden="true"
        className="size-4"
        icon={Cancel01Icon}
        strokeWidth={2}
      />
    </AutocompletePrimitive.Clear>
  );
}

/**
 * Chevron button that opens the {@link AutocompleteContent} list; absolutely
 * positioned inside the field and hidden when an {@link AutocompleteClear}
 * button is also present.
 */
function AutocompleteTrigger({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Trigger>) {
  return (
    <AutocompletePrimitive.Trigger
      aria-label="Show options"
      className={cn(
        "absolute top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none has-[+[data-slot=autocomplete-clear]]:hidden data-disabled:pointer-events-none",
        className
      )}
      data-slot="autocomplete-trigger"
      {...props}
    >
      <HugeiconsIcon
        aria-hidden="true"
        className="size-4"
        icon={UnfoldMoreIcon}
        strokeWidth={2}
      />
    </AutocompletePrimitive.Trigger>
  );
}

/** Optional arrow that visually connects the popup to its anchor. */
function AutocompleteArrow({
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Arrow>) {
  return (
    <AutocompletePrimitive.Arrow data-slot="autocomplete-arrow" {...props} />
  );
}

/** Thin horizontal divider between item groups in {@link AutocompleteList}. */
function AutocompleteSeparator({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Separator>) {
  return (
    <AutocompletePrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      data-slot="autocomplete-separator"
      {...props}
    />
  );
}

export {
  Autocomplete,
  AutocompleteArrow,
  AutocompleteBackdrop,
  AutocompleteClear,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompleteRow,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  AutocompleteValue,
};
