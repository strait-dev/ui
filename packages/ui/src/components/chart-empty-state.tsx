import { ChartLineData01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

import { cn } from "../utils/index";

/**
 * Class-variance-authority recipe for {@link ChartEmptyState}.
 *
 * Controls icon tile dimensions + text scale across three sizes:
 * - `"sm"` — compact tile (`size-7`, icon `14px`), `text-xs` message.
 * - `"default"` — original look (`size-10`, icon `20px`), `text-sm` message.
 * - `"lg"` — prominent tile (`size-14`, icon `28px`), `text-base` message.
 */
const chartEmptyStateVariants = cva("", {
  variants: {
    size: {
      sm: "",
      default: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/** Resolved per-size values used in the JSX. */
const SIZE_CONFIG = {
  sm: {
    tile: "size-7",
    iconSize: 14,
    titleClass: "text-xs",
    messageClass: "text-xs",
  },
  default: {
    tile: "size-10",
    iconSize: 20,
    titleClass: "text-sm",
    messageClass: "text-sm",
  },
  lg: {
    tile: "size-14",
    iconSize: 28,
    titleClass: "text-base font-semibold",
    messageClass: "text-base",
  },
} as const;

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
  /**
   * Controls the overall visual scale of the empty state.
   *
   * - `"sm"` — compact tile and `text-xs` copy for small panels.
   * - `"default"` — original sizing (unchanged).
   * - `"lg"` — larger tile and `text-base` copy for hero / full-page states.
   */
  size?: VariantProps<typeof chartEmptyStateVariants>["size"];
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
  size = "default",
  className,
}: ChartEmptyStateProps) {
  const cfg = SIZE_CONFIG[size ?? "default"];
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-8 text-center",
        className
      )}
      data-size={size}
      data-slot="chart-empty-state"
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-muted",
          cfg.tile
        )}
      >
        <HugeiconsIcon
          className="text-muted-foreground"
          icon={icon}
          size={cfg.iconSize}
        />
      </div>
      {title ? (
        <p className={cn("font-medium", cfg.titleClass)}>{title}</p>
      ) : null}
      <p
        className={cn("max-w-[220px] text-muted-foreground", cfg.messageClass)}
      >
        {message}
      </p>
      {action ? action : null}
    </div>
  );
}

export { ChartEmptyState, type ChartEmptyStateProps };
