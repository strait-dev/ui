import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/index";
import { Separator } from "./separator";

/**
 * Class-variance-authority recipe for {@link ButtonGroup}.
 *
 * Exposes one axis:
 * - `orientation` — `"horizontal"` (default) arranges children in a row,
 *   collapsing interior borders and rounding only the outermost corners.
 *   `"vertical"` stacks children in a column with the same border treatment.
 *
 * Exported so consumers can reuse the layout classes outside the component.
 */
const buttonGroupVariants = cva(
  "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "*:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0",
        vertical:
          "flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

/** Props for {@link ButtonGroup}. */
export type ButtonGroupProps = React.ComponentProps<"div"> &
  VariantProps<typeof buttonGroupVariants>;

/**
 * A toolbar-style container that fuses a set of related controls into a
 * single visual unit.
 *
 * Compose it with {@link ButtonGroupText}, {@link ButtonGroupSeparator},
 * and any number of `Button`, `Select`, or `Input` elements. Sibling
 * controls have their interior borders removed and their adjacent corners
 * squared off so the group reads as one cohesive element.
 *
 * @remarks
 * - `orientation` defaults to `"horizontal"`; set it to `"vertical"` to
 *   stack controls in a column with the same edge-merging treatment.
 * - Nested `ButtonGroup` elements are automatically spaced with a gap
 *   instead of being fused, allowing visual sub-grouping.
 * - Each focusable child is elevated (`z-10`) when focused so its
 *   focus ring is never clipped by a sibling.
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button variant="outline">Bold</Button>
 *   <ButtonGroupSeparator />
 *   <Button variant="outline">Italic</Button>
 *   <ButtonGroupText>px</ButtonGroupText>
 * </ButtonGroup>
 * ```
 */
function ButtonGroup({ className, orientation, ...props }: ButtonGroupProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a button toolbar groups related actions; role="group" on a div is the intended, accessible pattern (no native element fits).
    <div
      className={cn(buttonGroupVariants({ orientation }), className)}
      data-orientation={orientation}
      data-slot="button-group"
      role="group"
      {...props}
    />
  );
}

/**
 * Static text or icon label rendered as a fused segment inside a
 * {@link ButtonGroup}; styled to match adjacent button heights.
 * Accepts a `render` prop to swap the underlying element.
 */
function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex items-center gap-2 rounded-lg border bg-muted px-2.5 font-medium text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  });
}

/**
 * Thin divider line that visually separates segments inside a
 * {@link ButtonGroup}; defaults to `"vertical"` orientation and
 * stretches to the full cross-axis height of the group.
 */
function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn(
        "relative self-stretch bg-input data-horizontal:mx-px data-vertical:my-px data-vertical:h-auto data-horizontal:w-auto",
        className
      )}
      data-slot="button-group-separator"
      orientation={orientation}
      {...props}
    />
  );
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
};
