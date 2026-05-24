"use client";

import type * as React from "react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import { cn } from "../utils/index";

/**
 * Threshold configuration for {@link RadialGauge} automatic color selection.
 *
 * When no explicit `color` is provided the gauge resolves its fill by
 * comparing `percent` against these two thresholds.
 */
type RadialGaugeThresholds = {
  /** Percent at which the fill switches to `var(--warning)`. Defaults to 70. */
  warning?: number;
  /** Percent at which the fill switches to `var(--destructive)`. Defaults to 90. */
  danger?: number;
};

/**
 * Props for {@link RadialGauge}.
 */
type RadialGaugeProps = {
  /** Current value to display. */
  value: number;
  /** Maximum possible value. Defaults to `100`. */
  max?: number;
  /** Optional label rendered beneath the center percentage. */
  label?: React.ReactNode;
  /** Replaces the default `"N%"` text rendered in the center of the gauge. */
  centerLabel?: React.ReactNode;
  /** Explicit fill color; overrides threshold-based color selection. */
  color?: string;
  /** Thresholds used to pick warning/danger colors automatically. */
  thresholds?: RadialGaugeThresholds;
  className?: string;
};

/** Clamps a number between `min` and `max` (inclusive). */
function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

/**
 * Resolves the fill color for a given percent, explicit color override, and
 * thresholds. Extracted to avoid nested ternaries.
 */
function resolveColor(
  percent: number,
  color: string | undefined,
  warning: number,
  danger: number
): string {
  if (color) {
    return color;
  }
  if (percent >= danger) {
    return "var(--destructive)";
  }
  if (percent >= warning) {
    return "var(--warning)";
  }
  return "var(--chart-1)";
}

/**
 * Circular radial-bar gauge that fills proportionally to a `value / max` ratio.
 *
 * The fill color is determined automatically from threshold levels unless an
 * explicit `color` override is supplied. A center overlay shows the numeric
 * percentage (or a custom `centerLabel`) and an optional descriptive `label`
 * line below.
 *
 * @remarks
 * - Built on Recharts `RadialBarChart` wrapped in a `ResponsiveContainer`;
 *   place the component inside any fixed-size container.
 * - `isAnimationActive={false}` keeps the gauge static — safe for SSR and
 *   testing environments.
 * - Threshold defaults: `warning = 70`, `danger = 90`.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <div className="size-40">
 *   <RadialGauge value={75} label="CPU Usage" />
 * </div>
 *
 * // Custom thresholds and explicit color
 * <div className="size-40">
 *   <RadialGauge
 *     value={42}
 *     max={200}
 *     color="var(--chart-3)"
 *     label="Requests/s"
 *     thresholds={{ warning: 60, danger: 80 }}
 *   />
 * </div>
 * ```
 */
function RadialGauge({
  value,
  max = 100,
  label,
  centerLabel,
  color,
  thresholds,
  className,
}: RadialGaugeProps) {
  const warningThreshold = thresholds?.warning ?? 70;
  const dangerThreshold = thresholds?.danger ?? 90;

  // Guard against a zero/negative max, which would make value / max produce
  // NaN (0 / 0) or Infinity and surface as "NaN%" in the center label.
  const safeMax = max > 0 ? max : 1;
  const percent = clamp((value / safeMax) * 100, 0, 100);
  const fill = resolveColor(percent, color, warningThreshold, dangerThreshold);

  const chartData = [{ value: percent }];

  return (
    <div
      className={cn("relative size-full", className)}
      data-slot="radial-gauge"
    >
      <ResponsiveContainer height="100%" width="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          data={chartData}
          endAngle={-270}
          innerRadius="70%"
          outerRadius="90%"
          startAngle={90}
        >
          <PolarAngleAxis
            angleAxisId={0}
            domain={[0, 100]}
            tick={false}
            type="number"
          />
          <RadialBar
            angleAxisId={0}
            background={{ fill: "var(--muted)" }}
            cornerRadius={999}
            dataKey="value"
            fill={fill}
            isAnimationActive={false}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-medium text-sm tabular-nums">
          {centerLabel ?? `${Math.round(percent)}%`}
        </span>
        {label ? (
          <span className="mt-0.5 text-center text-muted-foreground text-xs">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export { RadialGauge, type RadialGaugeProps, type RadialGaugeThresholds };
