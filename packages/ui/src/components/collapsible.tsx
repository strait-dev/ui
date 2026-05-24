"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";

/**
 * A lightweight single-panel show/hide container driven by a trigger.
 *
 * Compose the root with {@link CollapsibleTrigger} (the control that
 * toggles visibility) and {@link CollapsibleContent} (the panel that
 * appears or disappears). Built on Base UI's `Collapsible` primitive,
 * which manages `aria-expanded` and keyboard interaction automatically.
 *
 * @remarks
 * - Use `open` + `onOpenChange` for controlled mode, or `defaultOpen` for
 *   uncontrolled.
 * - For a list of collapsible sections with coordinated single-open
 *   behaviour, prefer {@link Accordion} instead.
 *
 * @example
 * ```tsx
 * <Collapsible>
 *   <CollapsibleTrigger>Show details</CollapsibleTrigger>
 *   <CollapsibleContent>Hidden content here.</CollapsibleContent>
 * </Collapsible>
 * ```
 */
function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

/**
 * Button that toggles the open/closed state of a {@link Collapsible}.
 * Sets `aria-expanded` automatically via the Base UI primitive.
 */
function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  );
}

/**
 * The panel whose visibility is controlled by a {@link CollapsibleTrigger}.
 * Hidden when the parent {@link Collapsible} is closed; revealed when open.
 */
function CollapsibleContent({ ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
