import { cn } from "../utils/index";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

/** A single segment in an {@link ExecutionTraceBar}. */
type TraceSegment = {
  /** Human-readable label shown in the legend and tooltip. */
  label: string;
  /** Numeric value this segment represents (e.g. milliseconds). */
  value: number;
  /**
   * Optional CSS color string for this segment's swatch and bar slice.
   * When omitted, a color is assigned from the `var(--chart-1..5)` cycle.
   */
  color?: string;
};

/**
 * Props for {@link ExecutionTraceBar}.
 *
 * @remarks
 * `segments` is the only required prop. A sensible `formatValue` should be
 * provided whenever values have a natural unit (e.g. `(n) => \`${n}ms\``).
 */
type ExecutionTraceBarProps = {
  /** Ordered list of segments to display in the bar. */
  segments: TraceSegment[];
  /**
   * Denominator for percentage calculations.
   * Defaults to the sum of all segment values.
   */
  total?: number;
  /**
   * Whether to render the segment legend below the bar.
   * @defaultValue true
   */
  showLegend?: boolean;
  /**
   * Formats a raw numeric value for display in tooltips and the legend.
   * @defaultValue `(n) => String(n)`
   * @example `(n) => \`${n}ms\``
   */
  formatValue?: (n: number) => string;
  className?: string;
};

/** Default CSS color tokens for each chart index (0–4). */
const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

/**
 * Returns the CSS color for a segment, cycling through `CHART_COLORS` when
 * the segment provides no explicit color.
 */
function resolveColor(segment: TraceSegment, index: number): string {
  if (segment.color) {
    return segment.color;
  }
  return CHART_COLORS[index % CHART_COLORS.length];
}

/**
 * Horizontal stacked proportional bar that visualises time or value breakdown
 * across labelled segments, with per-segment tooltips and an optional legend.
 *
 * @remarks
 * - Segments whose share is below 0.5 % of `total` are hidden in the bar but
 *   still appear in the legend.
 * - Colors default to a `var(--chart-1)`…`var(--chart-5)` cycle; pass
 *   `segment.color` to override per-segment.
 * - No client-side hooks are used, so the component is compatible with React
 *   Server Components (given that `TooltipProvider` is already in the tree, or
 *   a parent has `"use client"`).
 *
 * @example
 * ```tsx
 * <ExecutionTraceBar
 *   formatValue={(n) => `${n}ms`}
 *   segments={[
 *     { label: "Queue", value: 12 },
 *     { label: "Execution", value: 340 },
 *     { label: "Serialization", value: 28 },
 *   ]}
 * />
 * ```
 */
function ExecutionTraceBar({
  segments,
  total: totalProp,
  showLegend = true,
  formatValue = (n) => String(n),
  className,
}: ExecutionTraceBarProps) {
  const sum = segments.reduce((acc, seg) => acc + seg.value, 0);
  const total = totalProp ?? sum;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <TooltipProvider>
        <div
          className="flex h-6 w-full overflow-hidden rounded-md"
          data-slot="execution-trace-bar"
        >
          {segments.map((segment, index) => {
            const pct = total > 0 ? (segment.value / total) * 100 : 0;
            const color = resolveColor(segment, index);

            if (pct < 0.5) {
              return null;
            }

            const tooltipLabel = `${segment.label}: ${formatValue(segment.value)} (${pct.toFixed(1)}%)`;

            return (
              <Tooltip key={segment.label}>
                <TooltipTrigger
                  render={
                    <div
                      data-slot="execution-trace-bar-segment"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: color,
                      }}
                    />
                  }
                />
                <TooltipContent>{tooltipLabel}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      {showLegend && (
        <div
          className="flex flex-wrap gap-x-4 gap-y-1"
          data-slot="execution-trace-bar-legend"
        >
          {segments.map((segment, index) => {
            const color = resolveColor(segment, index);
            return (
              <div className="flex items-center gap-1.5" key={segment.label}>
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs">{segment.label}</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {formatValue(segment.value)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { ExecutionTraceBar, type ExecutionTraceBarProps, type TraceSegment };
