"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "../utils/index";

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
 *
 * @example
 * ```tsx
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Is it accessible?</AccordionTrigger>
 *     <AccordionContent>
 *       Yes. It follows the WAI-ARIA design pattern.
 *     </AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      className={cn("flex w-full flex-col", className)}
      data-slot="accordion"
      {...props}
    />
  );
}

/**
 * A single collapsible section inside an {@link Accordion}; wraps one
 * {@link AccordionTrigger} and one {@link AccordionContent}.
 * Renders a bottom border except on the last item.
 */
function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      className={cn("not-last:border-b", className)}
      data-slot="accordion-item"
      {...props}
    />
  );
}

/**
 * Clickable header button that expands or collapses an
 * {@link AccordionItem}. Renders inside an implicit `<h3>` via
 * `AccordionPrimitive.Header`, and toggles between a down and up arrow
 * icon to reflect the open state.
 */
function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left font-medium text-sm outline-none transition-all hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <HugeiconsIcon
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
          data-slot="accordion-trigger-icon"
          icon={ArrowDown01Icon}
          strokeWidth={2}
        />
        <HugeiconsIcon
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
          data-slot="accordion-trigger-icon"
          icon={ArrowUp01Icon}
          strokeWidth={2}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/**
 * Animated panel that reveals the body content of an {@link AccordionItem}.
 * Slides open/closed via `animate-accordion-down` / `animate-accordion-up`
 * keyframes driven by `data-open` and `data-closed` attributes from the
 * Base UI primitive.
 */
function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      className="overflow-hidden text-sm data-closed:animate-accordion-up data-open:animate-accordion-down"
      data-slot="accordion-content"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
