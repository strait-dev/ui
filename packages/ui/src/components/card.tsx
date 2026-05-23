import type * as React from "react";

import { cn } from "../utils/index";

/**
 * A surface that groups related content and actions into a bordered container.
 *
 * `Card` is the root; compose it from the sub-parts in this file —
 * {@link CardHeader} (holding {@link CardTitle}, {@link CardDescription}, and
 * an optional {@link CardAction}), {@link CardContent}, and {@link CardFooter}.
 * Each part tags itself with a `data-slot`, which the others use to adapt
 * spacing (e.g. the footer reveals its top border, the header switches to a
 * two-column grid when an action is present).
 *
 * @remarks
 * The `size` prop (`"default" | "sm"`) cascades to every sub-part via a
 * `data-size` attribute and group selectors, so set it once on the root. A
 * full-bleed image as the first or last child is corner-rounded automatically.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Invoice</CardTitle>
 *     <CardDescription>Due May 30</CardDescription>
 *     <CardAction><Button size="icon-sm" aria-label="More" /></CardAction>
 *   </CardHeader>
 *   <CardContent>…</CardContent>
 *   <CardFooter>…</CardFooter>
 * </Card>
 * ```
 */
function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-card-foreground text-sm ring-1 ring-foreground/10 has-[>img:first-child]:pt-0 has-data-[slot=card-footer]:pb-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      data-size={size}
      data-slot="card"
      {...props}
    />
  );
}

/**
 * Top region of a {@link Card}. Lays out {@link CardTitle},
 * {@link CardDescription}, and an optional {@link CardAction} on a grid that
 * reflows to make room for the action.
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] group-data-[size=sm]/card:px-3 [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      data-slot="card-header"
      {...props}
    />
  );
}

/** Accessible heading for a {@link Card}, rendered inside {@link CardHeader}. */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-medium text-base leading-snug group-data-[size=sm]/card:text-sm",
        className
      )}
      data-slot="card-title"
      {...props}
    />
  );
}

/** Muted supporting text beneath a {@link CardTitle}. */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="card-description"
      {...props}
    />
  );
}

/**
 * Trailing control (button, menu, etc.) pinned to the top-right of a
 * {@link CardHeader}; its presence switches the header to a two-column grid.
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      data-slot="card-action"
      {...props}
    />
  );
}

/** Primary body region of a {@link Card}. */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      data-slot="card-content"
      {...props}
    />
  );
}

/**
 * Bottom region of a {@link Card} for actions or summaries; renders a muted bar
 * with a top divider.
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-2 flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      data-slot="card-footer"
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
