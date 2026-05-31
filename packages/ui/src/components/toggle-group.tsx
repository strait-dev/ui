"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../utils/index";
import { toggleVariants } from "./toggle";

/**
 * Internal context that distributes shared `emphasis`, `size`, `variant`,
 * `spacing`, and `orientation` values from {@link ToggleGroup} down to every
 * {@link ToggleGroupItem} without requiring per-item prop drilling.
 */
const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }
>({
  size: "default",
  emphasis: "default",
  variant: "default",
  spacing: 0,
  orientation: "horizontal",
});

/** Props for {@link ToggleGroup}. */
export type ToggleGroupProps = ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    /**
     * Pixel gap between items, passed as `--gap` CSS custom property.
     * When `0` (default), items are fused edge-to-edge with shared
     * borders collapsed.
     */
    spacing?: number;
    /**
     * Layout direction of the group.
     * - `"horizontal"` — items are arranged in a row (default).
     * - `"vertical"` — items are stacked in a column.
     * Note: `aria-orientation` is suppressed because `role="group"` does
     * not permit that attribute.
     */
    orientation?: "horizontal" | "vertical";
  };

/**
 * A managed group of {@link ToggleGroupItem} controls, handling single or
 * multiple selection and keyboard navigation.
 *
 * Built on Base UI's `ToggleGroup` primitive. Styling and layout props are
 * passed once on the root and distributed to every item via
 * {@link ToggleGroupContext}.
 *
 * @remarks
 * - `emphasis`, `size`, and `variant` cascade to items; individual items can
 *   override them only when the context values are absent.
 * - `spacing` (a positive integer, default `0`) sets the gap between items
 *   via a CSS custom property. When `0`, items are fused edge-to-edge with
 *   shared borders collapsed, matching a {@link ButtonGroup} aesthetic.
 * - `orientation` defaults to `"horizontal"`; set `"vertical"` to stack
 *   items in a column. Note: `aria-orientation` is intentionally suppressed
 *   because `role="group"` does not allow that attribute.
 * - `size` accepts `"xs"`, `"sm"`, `"default"`, `"lg"`, `"xl"` (mirroring
 *   the expanded {@link Toggle} size axis).
 * - `variant` tints each item's pressed/active state with a semantic colour
 *   token; set once on the group to apply uniformly.
 *
 * @example
 * ```tsx
 * <ToggleGroup type="multiple" emphasis="outline" size="sm" variant="success">
 *   <ToggleGroupItem value="bold" aria-label="Bold">
 *     <BoldIcon />
 *   </ToggleGroupItem>
 *   <ToggleGroupItem value="italic" aria-label="Italic">
 *     <ItalicIcon />
 *   </ToggleGroupItem>
 * </ToggleGroup>
 * ```
 */

function ToggleGroup({
  className,
  emphasis,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive
      // role="group" does not permit aria-orientation; strip the attribute
      // Base UI's CompositeRoot would otherwise emit (fails axe aria-allowed-attr).
      aria-orientation={undefined}
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-vertical:flex-col data-vertical:items-stretch data-[size=sm]:rounded-lg",
        className
      )}
      data-emphasis={emphasis}
      data-orientation={orientation}
      data-size={size}
      data-slot="toggle-group"
      data-spacing={spacing}
      data-variant={variant}
      style={{ "--gap": spacing } as React.CSSProperties}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ emphasis, variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

/**
 * Individual selectable item within a {@link ToggleGroup}.
 *
 * Inherits `emphasis`, `variant`, `size`, and `spacing` from
 * {@link ToggleGroupContext}; per-item props serve as fallbacks when the
 * context values are absent. Border-collapsing and corner-rounding are handled
 * automatically based on the item's position and the group's spacing setting.
 */
function ToggleGroupItem({
  className,
  children,
  emphasis = "default",
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <TogglePrimitive
      className={cn(
        "shrink-0 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:rounded-none group-data-vertical/toggle-group:data-[spacing=0]:data-[emphasis=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[emphasis=outline]:border-l-0 group-data-[spacing=0]/toggle-group:px-2 group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-vertical/toggle-group:data-[spacing=0]:data-[emphasis=outline]:first:border-t group-data-horizontal/toggle-group:data-[spacing=0]:data-[emphasis=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg",
        toggleVariants({
          emphasis: context.emphasis ?? emphasis,
          variant: context.variant ?? variant,
          size: context.size ?? size,
        }),
        className
      )}
      data-emphasis={context.emphasis ?? emphasis}
      data-size={context.size ?? size}
      data-slot="toggle-group-item"
      data-spacing={context.spacing}
      data-variant={context.variant ?? variant}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}

export { ToggleGroup, ToggleGroupItem };
