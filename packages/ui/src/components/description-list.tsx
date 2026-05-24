import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../utils/index";

// ---------------------------------------------------------------------------
// descriptionListVariants — drives `orientation` and `size` on the root <dl>.
// ---------------------------------------------------------------------------

/**
 * CVA variants for the {@link DescriptionList} component.
 *
 * **orientation**
 * - `vertical` (default) — term/detail pairs stack vertically; pairs are
 *   separated by a row gap controlled by `size`.
 * - `horizontal` — two-column CSS grid layout. Each `<dt>` lands in the left
 *   column (max `12rem`) and the paired `<dd>` sits to its right on the same
 *   row, thanks to `grid-auto-flow: row` on a two-column grid.
 *
 * **size** — controls text size and row gap.
 * - `sm` — `text-sm`, `gap-y-2`
 * - `default` — `text-sm`, `gap-y-3`
 * - `lg` — `text-base`, `gap-y-4`
 */
export const descriptionListVariants = cva("w-full", {
  variants: {
    orientation: {
      vertical: "flex flex-col",
      horizontal: "grid grid-cols-[minmax(0,12rem)_1fr] items-baseline gap-x-6",
    },
    size: {
      sm: "gap-y-2 text-sm",
      default: "gap-y-3 text-sm",
      lg: "gap-y-4 text-base",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    size: "default",
  },
});

type DescriptionListVariantProps = VariantProps<typeof descriptionListVariants>;

// ---------------------------------------------------------------------------
// Prop types
// ---------------------------------------------------------------------------

/**
 * Props for the {@link DescriptionList} root component.
 *
 * Extends all native `<dl>` attributes and adds CVA variant axes plus the
 * optional `divided` divider toggle.
 *
 * @property orientation - Layout axis: `"vertical"` (default) or
 *   `"horizontal"` (two-column grid).
 * @property size - Spacing and text-size preset: `"sm" | "default" | "lg"`.
 * @property divided - When `true`, renders a subtle bottom border between
 *   rows. **Supported for `horizontal` orientation only** — in horizontal
 *   mode the `<dl>` grid places `<dt>` and `<dd>` as adjacent siblings in
 *   the same row, so borders are applied to both via
 *   `[&>dt]` / `[&>dd]` selectors while exempting the last pair with
 *   `[&>*:nth-last-child(-n+2)]:border-b-0`. For `vertical` orientation,
 *   `divided` has no effect; add borders directly to pairs via `className`
 *   if needed.
 */
export type DescriptionListProps = React.ComponentProps<"dl"> &
  DescriptionListVariantProps & {
    /**
     * Adds a subtle bottom border between rows (horizontal orientation only).
     *
     * @defaultValue false
     */
    divided?: boolean;
  };

/** Props for the {@link DescriptionTerm} sub-component (`<dt>`). */
export type DescriptionTermProps = React.ComponentProps<"dt">;

/** Props for the {@link DescriptionDetails} sub-component (`<dd>`). */
export type DescriptionDetailsProps = React.ComponentProps<"dd">;

// ---------------------------------------------------------------------------
// DescriptionList
// ---------------------------------------------------------------------------

/**
 * Semantic description list root (`<dl>`). Compose with {@link DescriptionTerm}
 * and {@link DescriptionDetails} to build accessible key–value displays.
 *
 * @remarks
 * Uses the native `<dl>`/`<dt>`/`<dd>` elements for semantic correctness and
 * accessibility. Two layout orientations are available:
 *
 * - **`vertical`** (default) — each term/details pair stacks; pairs are
 *   separated by a vertical gap that scales with `size`.
 * - **`horizontal`** — a two-column CSS grid where the term occupies the left
 *   column (capped at `12rem`) and the details fill the remaining width,
 *   sitting on the same row. Because `<dt>` and `<dd>` are flat siblings
 *   inside the `<dl>`, the two-column grid with `grid-auto-flow: row` places
 *   them correctly without any wrapper element.
 *
 * The `divided` prop adds a subtle `border-b` between rows; it is **only
 * implemented for `horizontal` orientation**. See {@link DescriptionListProps}
 * for full details.
 *
 * @example
 * ```tsx
 * // Vertical (default)
 * <DescriptionList>
 *   <DescriptionTerm>Name</DescriptionTerm>
 *   <DescriptionDetails>Alice Martin</DescriptionDetails>
 *   <DescriptionTerm>Role</DescriptionTerm>
 *   <DescriptionDetails>Senior Engineer</DescriptionDetails>
 * </DescriptionList>
 * ```
 *
 * @example
 * ```tsx
 * // Horizontal, divided
 * <DescriptionList orientation="horizontal" divided>
 *   <DescriptionTerm>Order</DescriptionTerm>
 *   <DescriptionDetails>#10042</DescriptionDetails>
 *   <DescriptionTerm>Total</DescriptionTerm>
 *   <DescriptionDetails>$128.00</DescriptionDetails>
 * </DescriptionList>
 * ```
 */
function DescriptionList({
  className,
  orientation = "vertical",
  size = "default",
  divided = false,
  ref,
  ...props
}: DescriptionListProps & { ref?: React.Ref<HTMLDListElement> }) {
  return (
    <dl
      className={cn(
        descriptionListVariants({ orientation, size }),
        divided &&
          orientation === "horizontal" && [
            "[&>dt]:border-border [&>dt]:border-b [&>dt]:pb-2",
            "[&>dd]:border-border [&>dd]:border-b [&>dd]:pb-2",
            "[&>*:nth-last-child(-n+2)]:border-b-0 [&>*:nth-last-child(-n+2)]:pb-0",
          ],
        className
      )}
      data-slot="description-list"
      ref={ref}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// DescriptionTerm
// ---------------------------------------------------------------------------

/**
 * A single term (`<dt>`) in a {@link DescriptionList}.
 *
 * @remarks
 * Rendered as a native `<dt>` element with muted, medium-weight label
 * styling. In `horizontal` orientation the term occupies the left grid
 * column; in `vertical` orientation it precedes its paired
 * {@link DescriptionDetails}.
 *
 * For `vertical` orientation, pairs of `<DescriptionTerm>` +
 * `<DescriptionDetails>` are typically wrapped in a containing `<div>` if
 * richer per-pair layout or borders are needed. For `horizontal` orientation
 * do **not** wrap — the two-column grid on the `<dl>` depends on flat
 * `<dt>`/`<dd>` siblings.
 *
 * @example
 * ```tsx
 * <DescriptionList orientation="horizontal">
 *   <DescriptionTerm>Status</DescriptionTerm>
 *   <DescriptionDetails>Active</DescriptionDetails>
 * </DescriptionList>
 * ```
 */
function DescriptionTerm({
  className,
  ref,
  ...props
}: DescriptionTermProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <dt
      className={cn("font-medium text-muted-foreground", className)}
      data-slot="description-term"
      ref={ref}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// DescriptionDetails
// ---------------------------------------------------------------------------

/**
 * The details/value element (`<dd>`) paired with a {@link DescriptionTerm}.
 *
 * @remarks
 * Rendered as a native `<dd>` with the default browser margin reset (`m-0`)
 * and `text-foreground` so values use the primary text colour. In
 * `horizontal` orientation this element flows into the right grid column
 * automatically.
 *
 * @example
 * ```tsx
 * <DescriptionList>
 *   <DescriptionTerm>Plan</DescriptionTerm>
 *   <DescriptionDetails>Pro — billed annually</DescriptionDetails>
 * </DescriptionList>
 * ```
 */
function DescriptionDetails({
  className,
  ref,
  ...props
}: DescriptionDetailsProps & { ref?: React.Ref<HTMLElement> }) {
  return (
    <dd
      className={cn("m-0 text-foreground", className)}
      data-slot="description-details"
      ref={ref}
      {...props}
    />
  );
}

export { DescriptionDetails, DescriptionList, DescriptionTerm };
