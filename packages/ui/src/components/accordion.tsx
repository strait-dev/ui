"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva } from "class-variance-authority";
import { createContext, useContext } from "react";
import { cn } from "../utils/index";

/**
 * Visual style shared across an {@link Accordion} and its items.
 * - `default` — flush sections separated by a bottom divider.
 * - `outline` — each item is a bordered, rounded card with internal padding.
 * - `solid` — each item is a filled muted card with internal padding.
 */
type AccordionVariant = "default" | "outline" | "solid";

/** Spacing applied to the {@link Accordion} root per variant. */
const accordionRootVariants = cva("flex w-full flex-col", {
  variants: {
    variant: {
      default: "",
      outline: "gap-2",
      solid: "gap-2",
    },
  },
  defaultVariants: { variant: "default" },
});

/**
 * Class-variance-authority recipe for an {@link AccordionItem}.
 *
 * Exported so consumers can derive the same per-item look on custom markup.
 */
const accordionItemVariants = cva("", {
  variants: {
    variant: {
      default: "not-last:border-b",
      outline: "rounded-lg border px-4",
      solid: "rounded-lg bg-muted px-4",
    },
  },
  defaultVariants: { variant: "default" },
});

/** Propagates the {@link Accordion} `variant` down to each {@link AccordionItem}. */
const AccordionContext = createContext<AccordionVariant>("default");

/** Props for {@link Accordion}. */
export type AccordionProps = AccordionPrimitive.Root.Props & {
  /**
   * Visual style applied to every item. Each {@link AccordionItem} can
   * override it locally with its own `variant`. Defaults to `"default"`.
   */
  variant?: AccordionVariant;
};

/**
 * A vertically stacked set of collapsible sections, each with a trigger
 * and an animated content panel.
 *
 * Compose the root with its sub-parts: each section is an
 * {@link AccordionItem} containing an {@link AccordionTrigger} and an
 * {@link AccordionContent}. Built on Base UI's `Accordion` primitive, which
 * manages keyboard navigation and ARIA attributes automatically.
 *
 * @remarks
 * - Pass `type="single"` (default) to allow only one item open at a time,
 *   or `type="multiple"` to allow multiple open simultaneously.
 * - Use `defaultValue` / `value` + `onValueChange` for controlled mode.
 * - The trigger renders a down arrow icon that swaps to an up arrow when
 *   the item is expanded, via `group-aria-expanded` CSS selectors.
 * - Custom icons can be placed inside the trigger with
 *   `data-slot="accordion-trigger-icon"` to pick up automatic sizing.
 * - Use `variant` to switch between flush (`"default"`), bordered card
 *   (`"outline"`), and filled card (`"solid"`) layouts.
 *
 * @example
 * ```tsx
 * <Accordion type="single" collapsible variant="outline">
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Is it accessible?</AccordionTrigger>
 *     <AccordionContent>
 *       Yes. It follows the WAI-ARIA design pattern.
 *     </AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
function Accordion({
  className,
  variant = "default",
  ...props
}: AccordionProps) {
  return (
    <AccordionContext.Provider value={variant}>
      <AccordionPrimitive.Root
        className={cn(accordionRootVariants({ variant }), className)}
        data-slot="accordion"
        {...props}
      />
    </AccordionContext.Provider>
  );
}

/** Props for {@link AccordionItem}. */
export interface AccordionItemProps extends AccordionPrimitive.Item.Props {
  /**
   * Visual style for this item. Overrides the variant inherited from the
   * parent {@link Accordion} when set.
   */
  variant?: AccordionVariant;
}

/**
 * A single collapsible section inside an {@link Accordion}; wraps one
 * {@link AccordionTrigger} and one {@link AccordionContent}. Inherits the
 * parent's `variant` unless its own `variant` prop is supplied.
 */
function AccordionItem({ className, variant, ...props }: AccordionItemProps) {
  const inheritedVariant = useContext(AccordionContext);
  const resolvedVariant = variant ?? inheritedVariant;

  return (
    <AccordionPrimitive.Item
      className={cn(
        accordionItemVariants({ variant: resolvedVariant }),
        className
      )}
      data-slot="accordion-item"
      {...props}
    />
  );
}

/** Indicator style for {@link AccordionTrigger}. */
export type AccordionTriggerIndicator = "chevron" | "plus-minus" | "none";

/** Props for {@link AccordionTrigger}. */
export interface AccordionTriggerProps
  extends AccordionPrimitive.Trigger.Props {
  /**
   * Built-in collapse/expand indicator placement.
   * - `"chevron"` (default) — down arrow when collapsed, up arrow when open.
   * - `"plus-minus"` — plus glyph when collapsed, minus when open.
   * - `"none"` — suppress the built-in indicator; supply your own as the
   *   last child of the trigger (tag it `data-slot="accordion-trigger-icon"`
   *   to inherit sizing).
   */
  indicator?: AccordionTriggerIndicator;
}

/**
 * Clickable header button that expands or collapses an
 * {@link AccordionItem}. Renders inside an implicit `<h3>` via
 * `AccordionPrimitive.Header`. Toggles a built-in chevron or plus/minus
 * glyph to reflect the open state, or hides the built-in indicator entirely
 * via `indicator="none"`.
 */
function AccordionTrigger({
  className,
  children,
  indicator = "chevron",
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left font-medium text-sm outline-none transition-colors hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        {indicator === "chevron" && (
          <>
            <HugeiconsIcon
              aria-hidden="true"
              className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
              data-slot="accordion-trigger-icon"
              icon={ArrowDown01Icon}
              strokeWidth={2}
            />
            <HugeiconsIcon
              aria-hidden="true"
              className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
              data-slot="accordion-trigger-icon"
              icon={ArrowUp01Icon}
              strokeWidth={2}
            />
          </>
        )}
        {indicator === "plus-minus" && (
          <>
            <HugeiconsIcon
              aria-hidden="true"
              className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
              data-slot="accordion-trigger-icon"
              icon={PlusSignIcon}
              strokeWidth={2}
            />
            <HugeiconsIcon
              aria-hidden="true"
              className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
              data-slot="accordion-trigger-icon"
              icon={MinusSignIcon}
              strokeWidth={2}
            />
          </>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/**
 * Animated panel that reveals the body content of an {@link AccordionItem}.
 * Slides open/closed by transitioning `height` between `0` and Base UI's
 * `--accordion-panel-height` variable, driven by `data-starting-style` and
 * `data-ending-style` attributes the primitive sets during enter/exit.
 */
function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-(--duration-base) ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none"
      data-slot="accordion-content"
      {...props}
    >
      <div
        className={cn(
          "pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export type { AccordionVariant };
export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  accordionItemVariants,
};
