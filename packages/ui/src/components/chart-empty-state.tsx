import { ChartLineData01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type React from "react";

import { cn } from "../utils/index";

/**
 * Props for {@link ChartEmptyState}.
 */
type ChartEmptyStateProps = {
  /**
   * Hugeicons icon value rendered in the icon tile.
   *
   * Accepts any `IconSvgElement` from `@hugeicons/core-free-icons`. Defaults
   * to {@link ChartLineData01Icon} when omitted.
   */
  icon?: IconSvgElement;
  /**
   * Optional bold-ish heading rendered above the message.
   *
   * Accepts any React node, though a plain string is the most common value.
   */
  title?: React.ReactNode;
  /**
   * Required muted body copy that explains why no data is available.
   *
   * Kept deliberately narrow (`max-w-[220px]`) to encourage concise wording.
   */
  message: string;
  /**
   * Optional call-to-action rendered below the message.
   *
   * Typically a `<Button>` pointing users toward an action that will populate
   * the chart (e.g. "Add data source", "Run a query").
   */
  action?: React.ReactNode;
  /** Additional Tailwind class names merged onto the root element. */
  className?: string;
};

/**
 * Centered empty state for charts and data panels that have no content.
 *
 * Renders a compact column — icon tile, optional heading, muted message, and
 * an optional CTA — intended to sit inside a chart container when the dataset
 * is empty, loading has completed without results, or a filter returns zero
 * matches.
 *
 * @remarks
 * The component is intentionally thin and presentational: it holds no state
 * and emits no side-effects, so no `"use client"` directive is required for
 * React Server Components usage.
 *
 * The icon sits in a `size-10 rounded-lg bg-muted` tile to create visual
 * separation without overpowering the surrounding chart chrome. Override the
 * default {@link ChartLineData01Icon} by passing any `IconSvgElement` from
 * `@hugeicons/core-free-icons`.
 *
 * @example
 * ```tsx
 * // Minimal — message only
 * <ChartEmptyState message="No data available for this period." />
 *
 * // With title and CTA
 * <ChartEmptyState
 *   title="Nothing to display"
 *   message="Add a data source to start seeing charts here."
 *   action={<Button size="sm">Add data source</Button>}
 * />
 *
 * // Custom icon
 * import { BarChartIcon } from "@hugeicons/core-free-icons";
 * <ChartEmptyState
 *   icon={BarChartIcon}
 *   message="Run a query to populate this chart."
 * />
 * ```
 */
function ChartEmptyState({
  icon = ChartLineData01Icon,
  title,
  message,
  action,
  className,
}: ChartEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-8 text-center",
        className
      )}
      data-slot="chart-empty-state"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <HugeiconsIcon
          className="text-muted-foreground"
          icon={icon}
          size={20}
        />
      </div>
      {title ? <p className="font-medium text-sm">{title}</p> : null}
      <p className="max-w-[220px] text-muted-foreground text-sm">{message}</p>
      {action ? action : null}
    </div>
  );
}

export { ChartEmptyState, type ChartEmptyStateProps };
