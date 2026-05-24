"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../utils/index";
import { Button } from "./button";
import { Input, type InputProps } from "./input";
import { Textarea } from "./textarea";

/**
 * A composite control that visually merges an input (or textarea)
 * with leading/trailing addons, icons, buttons, or labels into a
 * single bordered group.
 *
 * Compose it with {@link InputGroupInput} (or
 * {@link InputGroupTextarea}) as the primary control and one or more
 * {@link InputGroupAddon}s, {@link InputGroupButton}s, or
 * {@link InputGroupText}s for decorations.
 *
 * @remarks
 * - Focus, error (`aria-invalid`), and disabled styles are applied to
 *   the wrapper `<div>` via child-targeting selectors, so the inner
 *   input does not need its own ring styles.
 * - Use `data-align="block-start"` / `data-align="block-end"` addons
 *   for stacked (top / bottom) labels; `inline-start` / `inline-end`
 *   for side addons.
 * - Wrapping a `<textarea>` via {@link InputGroupTextarea} causes the
 *   group to grow vertically (`h-auto`).
 *
 * @example
 * ```tsx
 * <InputGroup>
 *   <InputGroupAddon align="inline-start">
 *     <SearchIcon />
 *   </InputGroupAddon>
 *   <InputGroupInput placeholder="Search…" />
 *   <InputGroupAddon align="inline-end">
 *     <InputGroupButton>Go</InputGroupButton>
 *   </InputGroupAddon>
 * </InputGroup>
 * ```
 */
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: an input group bundles a control with addons; role="group" on a div is the intended pattern (no native element fits).
    <div
      className={cn(
        "group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input outline-none transition-colors in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-start]]:h-auto has-[>textarea]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:flex-col has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot][aria-invalid=true]]:border-destructive has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
        className
      )}
      data-slot="input-group"
      role="group"
      {...props}
    />
  );
}

/**
 * Class-variance-authority recipe for {@link InputGroupAddon}.
 *
 * Exposes one axis:
 * - `align` — where the addon attaches to the {@link InputGroup}:
 *   `"inline-start"` (left), `"inline-end"` (right), `"block-start"`
 *   (top), or `"block-end"` (bottom). Block-aligned addons span the
 *   full width and stack the group vertically.
 */
const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 font-medium text-muted-foreground text-sm group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end":
          "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

/**
 * Decorative zone attached to one edge of an {@link InputGroup};
 * holds icons, text labels, {@link InputGroupButton}s, or `<kbd>`
 * shortcuts.
 *
 * @remarks
 * The `align` prop positions the addon relative to the group's
 * primary control (see {@link inputGroupAddonVariants}). A click on
 * the addon that doesn't hit a child `<button>` is forwarded to the
 * group's `<input>` to keep the UX familiar.
 */
function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: the click only forwards focus to the group's input as a convenience; the input itself is fully keyboard accessible.
    // biome-ignore lint/a11y/useSemanticElements: an addon labels/decorates the group's control; role="group" on a div is the intended pattern (no native element fits).
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: the click only forwards focus to the group's input; the input itself is fully keyboard accessible.
    <div
      className={cn(inputGroupAddonVariants({ align }), className)}
      data-align={align}
      data-slot="input-group-addon"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      role="group"
      {...props}
    />
  );
}

/**
 * Class-variance-authority recipe for {@link InputGroupButton}.
 *
 * Exposes one axis:
 * - `size` — compact sizes designed to sit flush inside the group
 *   boundary: `"xs"` (text button), `"sm"` (slightly taller),
 *   `"icon-xs"` (square icon), `"icon-sm"` (larger square icon).
 */
const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
);

/**
 * A compact {@link Button} tuned for placement inside an
 * {@link InputGroupAddon}.
 *
 * @remarks
 * Sizing comes from {@link inputGroupButtonVariants} rather than
 * `buttonVariants`, so it uses a restricted `size` set. The `type`
 * defaults to `"button"` to prevent accidental form submissions when
 * the group is inside a `<form>`.
 */
function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  }) {
  return (
    <Button
      className={cn(inputGroupButtonVariants({ size }), className)}
      data-size={size}
      type={type}
      variant={variant}
      {...props}
    />
  );
}

/**
 * Static muted text or icon decoration placed inside an
 * {@link InputGroupAddon} — not interactive, unlike
 * {@link InputGroupButton}.
 */
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-muted-foreground text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  );
}

/**
 * The primary `<input>` control inside an {@link InputGroup}; strips
 * its own border and ring so the group wrapper owns all focus/error
 * styling.
 */
function InputGroupInput({ className, ...props }: InputProps) {
  return (
    <Input
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className
      )}
      data-slot="input-group-control"
      {...props}
    />
  );
}

/**
 * A multi-line `<textarea>` variant of {@link InputGroupInput};
 * causes the parent {@link InputGroup} to grow vertically and resizes
 * vertically only (`resize-y` is disabled to `resize-none` for
 * predictable layout).
 */
function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className
      )}
      data-slot="input-group-control"
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
