"use client";

import {
  ArrowDownRight01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type * as React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
} from "recharts";

import { cn } from "../utils/index";
import { Card, CardContent, CardHeader } from "./card";

/* ------------------------------------------------------------------ */
/* Sub-parts                                                           */
/* ------------------------------------------------------------------ */

/**
 * Header row of a {@link MetricCard}: title on the left, optional icon on the right.
 *
 * @remarks
 * Rendered with a muted, small-text title. Pass an icon via the `icon` prop
 * to add a 16 × 16 accent icon on the trailing edge.
 *
 * @example
 * ```tsx
 * <MetricCardHeader title="Total Revenue" icon={ChartIcon} />
 * ```
 */
function MetricCardHeader({
  title,
  icon,
  className,
}: {
  title: React.ReactNode;
  icon?: IconSvgElement;
  className?: string;
}) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      data-slot="metric-card-header"
    >
      <span className="text-muted-foreground text-sm">{title}</span>
      {icon ? (
        <HugeiconsIcon
          className="text-muted-foreground"
          icon={icon}
          size={16}
        />
      ) : null}
    </div>
  );
}

/**
 * Large primary value display inside a {@link MetricCard}.
 *
 * @example
 * ```tsx
 * <MetricCardValue>$12,345</MetricCardValue>
 * ```
 */
function MetricCardValue({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("font-medium text-2xl tabular-nums", className)}
      data-slot="metric-card-value"
    >
      {children}
    </div>
  );
}

/**
 * Delta indicator inside a {@link MetricCard}.
 *
 * Shows a colored arrow icon alongside a formatted percentage change. The
 * `direction` defaults to `"up"` for non-negative values and `"down"` for
 * negative values.
 *
 * @remarks
 * - Up direction: `text-success-accent` with an {@link ArrowUpRight01Icon}.
 * - Down direction: `text-destructive-accent` with an {@link ArrowDownRight01Icon}.
 * - An optional `label` string is appended in muted text after the percentage.
 *
 * @example
 * ```tsx
 * <MetricCardDelta value={12.5} label="vs last month" />
 * <MetricCardDelta value={-3} direction="down" label="vs yesterday" />
 * ```
 */
function MetricCardDelta({
  value,
  label,
  direction,
  className,
}: {
  value: number;
  label?: string;
  direction?: "up" | "down";
  className?: string;
}) {
  const resolvedDirection = direction ?? (value >= 0 ? "up" : "down");
  const isUp = resolvedDirection === "up";
  const colorClass = isUp ? "text-success-accent" : "text-destructive-accent";
  const DeltaIcon = isUp ? ArrowUpRight01Icon : ArrowDownRight01Icon;
  const prefix = value > 0 ? "+" : "";
  const formatted = `${prefix}${value}%`;

  return (
    <div
      className={cn("flex items-center gap-1 text-xs", colorClass, className)}
      data-slot="metric-card-delta"
    >
      <HugeiconsIcon icon={DeltaIcon} size={14} />
      <span>{formatted}</span>
      {label ? <span className="text-muted-foreground">{label}</span> : null}
    </div>
  );
}

/**
 * Mini sparkline bar chart inside a {@link MetricCard}.
 *
 * Renders a 32 px tall bar chart from a numeric array. The chart has no
 * visible axes, grid, or cursor decorations — it conveys trend at a glance.
 *
 * @example
 * ```tsx
 * <MetricCardSparkline data={[4, 7, 3, 9, 5, 11]} color="var(--chart-2)" />
 * ```
 */
function MetricCardSparkline({
  data,
  color = "var(--chart-1)",
  className,
}: {
  data: number[];
  color?: string;
  className?: string;
}) {
  const chartData = data.map((v) => ({ v }));

  return (
    <div className={cn("w-full", className)} data-slot="metric-card-sparkline">
      <ResponsiveContainer height={32} width="100%">
        <RechartsBarChart barSize={6} data={chartData}>
          <Bar
            dataKey="v"
            fill={color}
            isAnimationActive={false}
            radius={[2, 2, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MetricCard all-in-one                                               */
/* ------------------------------------------------------------------ */

/**
 * Props for {@link MetricCard}.
 */
type MetricCardProps = {
  /** Card heading text. */
  title: React.ReactNode;
  /** The primary numeric or text value to highlight. */
  value: React.ReactNode;
  /**
   * Optional delta / change indicator. `direction` defaults to `"up"` when
   * `value >= 0` and `"down"` otherwise.
   */
  delta?: {
    value: number;
    label?: string;
    direction?: "up" | "down";
  };
  /** Trailing icon rendered in the header beside `title`. */
  icon?: IconSvgElement;
  /** Muted description line below the delta. */
  description?: React.ReactNode;
  /** Numeric series rendered as a mini sparkline at the bottom of the card. */
  data?: number[];
  /** Sparkline bar fill color. Defaults to `var(--chart-1)`. */
  color?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Self-contained metric summary card with an optional delta indicator and
 * sparkline.
 *
 * Composed from design-system {@link Card}/{@link CardHeader}/{@link CardContent}
 * and the sub-parts {@link MetricCardHeader}, {@link MetricCardValue},
 * {@link MetricCardDelta}, and {@link MetricCardSparkline}. Consumers who need
 * a custom layout can compose the sub-parts directly instead.
 *
 * @remarks
 * - `delta.direction` defaults to `"up"` for non-negative `delta.value` and
 *   `"down"` for negative — no need to pass it explicitly.
 * - Pass `data` to enable the sparkline; omit it to show a text-only card.
 * - Additional content can be injected via `children`, rendered after the
 *   description line.
 *
 * @example
 * ```tsx
 * // Minimal
 * <MetricCard title="Revenue" value="$48,200" />
 *
 * // With delta and sparkline
 * <MetricCard
 *   title="Active Users"
 *   value="1,284"
 *   delta={{ value: 12, label: "vs last week" }}
 *   data={[800, 900, 850, 1000, 1100, 1200, 1284]}
 *   color="var(--chart-2)"
 * />
 * ```
 */
function MetricCard({
  title,
  value,
  delta,
  icon,
  description,
  data,
  color = "var(--chart-1)",
  className,
  children,
}: MetricCardProps) {
  return (
    <Card className={cn(className)} data-slot="metric-card">
      <CardHeader className="pb-0">
        <MetricCardHeader icon={icon} title={title} />
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <MetricCardValue>{value}</MetricCardValue>
        {delta ? (
          <MetricCardDelta
            direction={delta.direction}
            label={delta.label}
            value={delta.value}
          />
        ) : null}
        {description ? (
          <p className="text-muted-foreground text-xs">{description}</p>
        ) : null}
        {children}
        {data ? <MetricCardSparkline color={color} data={data} /> : null}
      </CardContent>
    </Card>
  );
}

export {
  MetricCard,
  MetricCardDelta,
  MetricCardHeader,
  type MetricCardProps,
  MetricCardSparkline,
  MetricCardValue,
};
