import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../utils/index";

// ---------------------------------------------------------------------------
// cardVariants — drives the `variant` axis on the Card root element.
// ---------------------------------------------------------------------------

/**
 * CVA variants for the {@link Card} component.
 *
 * - `default` — subtle ring border on a card background (existing style).
 * - `outline` — visible `border` instead of ring; keeps `bg-card`.
 * - `ghost`   — transparent background, no ring or border.
 */
export const cardVariants = cva(
  // Base classes shared across all variants
  "group/card flex flex-col overflow-hidden rounded-xl text-card-foreground text-sm",
  {
    variants: {
      variant: {
        default: "bg-card ring-1 ring-foreground/10",
        outline: "border bg-card",
        ghost: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type CardVariantProps = VariantProps<typeof cardVariants>;

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
 * **Size** (`"default" | "sm" | "lg"`) cascades to every sub-part via a
 * `data-size` attribute and `group-data-[size=…]/card:` selectors, so set it
 * once on the root:
 * - `sm`  — gap-3 / py-3; header/content `px-3`; footer `px-3 py-2`.
 * - `default` — gap-4 / py-4; header/content `px-4`; footer `px-4 py-2.5`.
 * - `lg`  — gap-6 / py-6; header/content `px-6`; footer `px-6 py-3.5`.
 *
 * **Variant** (`"default" | "outline" | "ghost"`) controls the card's surface
 * decoration:
 * - `default` — `bg-card` with a 1 px ring (`ring-foreground/10`).
 * - `outline` — visible `border` + `bg-card`; ring is removed.
 * - `ghost`   — `bg-transparent`; no ring or border (useful inside already-
 *   surfaced containers).
 *
 * A full-bleed image as the first or last child is corner-rounded automatically.
 *
 * @example
 * ```tsx
 * <Card size="lg" variant="outline">
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
  variant = "default",
  ...props
}: React.ComponentProps<"div"> &
  CardVariantProps & { size?: "default" | "sm" | "lg" }) {
  return (
    <div
      className={cn(
        cardVariants({ variant }),
        // gap / py: default → sm → lg
        "gap-4 py-4",
        "data-[size=sm]:gap-3 data-[size=sm]:py-3",
        "data-[size=lg]:gap-6 data-[size=lg]:py-6",
        // image helpers
        "has-[>img:first-child]:pt-0 has-data-[slot=card-footer]:pb-0 data-[size=lg]:has-data-[slot=card-footer]:pb-0 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
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
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        "group-data-[size=sm]/card:px-3",
        "group-data-[size=lg]/card:px-6",
        "[.border-b]:pb-4 group-data-[size=lg]/card:[.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-3",
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
        "font-medium text-base leading-snug",
        "group-data-[size=sm]/card:text-sm",
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
      className={cn(
        "px-4",
        "group-data-[size=sm]/card:px-3",
        "group-data-[size=lg]/card:px-6",
        className
      )}
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
        "flex items-center rounded-b-xl border-t bg-muted/50 px-4 py-2.5",
        "group-data-[size=sm]/card:px-3 group-data-[size=sm]/card:py-2",
        "group-data-[size=lg]/card:px-6 group-data-[size=lg]/card:py-3.5",
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
