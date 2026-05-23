"use client";
import type * as React from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "../utils/index";

/** Corner radius applied to the top of every bar in {@link BarChart}. */
const BAR_RADIUS = 4;

/**
 * Shared props inherited by all simplified chart components in this file.
 *
 * These charts are intentionally opinionated wrappers over Recharts —
 * for full control use {@link ChartContainer} from `chart.tsx` instead.
 */
type BaseChartProps = {
  /** Array of data row objects. */
  data: Record<string, unknown>[];
  /** Key in each data row used as the X-axis (or Y-axis) category label. */
  index: string;
  /** Ordered list of CSS color strings for series. Cycles if fewer than
   *  the number of series. */
  colors?: string[];
  /** Formats numeric tick/value labels for display. */
  valueFormatter?: (value: number) => string;
  className?: string;
};

/** Props for {@link LineChart}. */
type LineChartProps = BaseChartProps & {
  /** Data keys to render as separate `<Line>` series. */
  categories: string[];
};

/** Props for {@link BarChart}. */
type BarChartProps = BaseChartProps & {
  /** Data keys to render as separate `<Bar>` series. */
  categories: string[];
  /** Axis orientation — `"horizontal"` (default) places categories on X. */
  layout?: "vertical" | "horizontal";
  /**
   * When `true`, all series share the same `stackId` so bars are stacked.
   * Corner radius is applied only to the topmost series.
   */
  stacked?: boolean;
};

/** Props for {@link PieChart}. */
type PieChartProps = BaseChartProps & {
  /** Data key whose value determines each slice's arc length. */
  category: string;
};

/**
 * Opinionated multi-series line chart with sensible defaults.
 *
 * Renders each string in `categories` as a smoothed `monotone` line.
 * Grid lines are horizontal-only; axes have no visible border. For
 * advanced configuration (tooltips, legends, custom colors) compose
 * Recharts primitives directly inside a {@link ChartContainer}.
 *
 * @example
 * ```tsx
 * <LineChart
 *   data={[{ month: "Jan", revenue: 400, cost: 200 }]}
 *   index="month"
 *   categories={["revenue", "cost"]}
 *   valueFormatter={(v) => `$${v}`}
 * />
 * ```
 */
export const LineChart = ({
  data,
  categories,
  index,
  colors = ["hsl(var(--primary))"],
  valueFormatter = (value) => value.toString(),
  className,
}: LineChartProps) => (
  <div data-slot="line-chart">
    <ResponsiveContainer className={cn(className)} height={300} width="100%">
      <RechartsLineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey={index}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis
          axisLine={false}
          tickFormatter={valueFormatter}
          tickLine={false}
          tickMargin={10}
        />
        {categories.map((category, i) => (
          <Line
            dataKey={category}
            dot={false}
            key={category}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            type="monotone"
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Opinionated multi-series bar chart with rounded bar tops.
 *
 * Supports `layout="horizontal"` (default, categories on X-axis) and
 * `layout="vertical"` (categories on Y-axis). Axis roles swap automatically
 * — `index` drives the category axis while numeric values go on the
 * perpendicular axis.
 *
 * @example
 * ```tsx
 * <BarChart
 *   data={[{ quarter: "Q1", sales: 3000 }]}
 *   index="quarter"
 *   categories={["sales"]}
 * />
 * ```
 */
export const BarChart = ({
  data,
  categories,
  index,
  colors = ["hsl(var(--primary))"],
  valueFormatter = (value) => value.toString(),
  layout = "horizontal",
  stacked = false,
  className,
}: BarChartProps) => {
  const lastIndex = categories.length - 1;
  return (
    <div data-slot="bar-chart">
      <ResponsiveContainer className={cn(className)} height={300} width="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            axisLine={false}
            dataKey={layout === "horizontal" ? index : undefined}
            tickLine={false}
            tickMargin={10}
            type={layout === "horizontal" ? "category" : "number"}
          />
          <YAxis
            axisLine={false}
            dataKey={layout === "vertical" ? index : undefined}
            tickFormatter={valueFormatter}
            tickLine={false}
            tickMargin={10}
            type={layout === "vertical" ? "category" : "number"}
          />
          {categories.map((category, i) => {
            const isLast = i === lastIndex;
            let stackRadius: [number, number, number, number] = [
              BAR_RADIUS,
              BAR_RADIUS,
              0,
              0,
            ];
            if (stacked && !isLast) {
              stackRadius = [0, 0, 0, 0];
            }
            return (
              <Bar
                dataKey={category}
                fill={colors[i % colors.length]}
                key={category}
                radius={stackRadius}
                stackId={stacked ? "a" : undefined}
              />
            );
          })}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Opinionated pie chart where each data row becomes one colored slice.
 *
 * Colors cycle through `colors` using the row's position in `data`. A
 * thin `background`-colored stroke separates adjacent slices. Labels and
 * label lines are hidden by default; add a Recharts `<Tooltip>` as needed.
 *
 * @example
 * ```tsx
 * <PieChart
 *   data={[{ name: "Chrome", value: 60 }, { name: "Firefox", value: 40 }]}
 *   index="name"
 *   category="value"
 *   colors={["hsl(var(--primary))", "hsl(var(--muted))"]}
 * />
 * ```
 */
export const PieChart = ({
  data,
  category,
  index,
  colors = ["hsl(var(--primary))"],
  className,
}: PieChartProps) => (
  <div className={cn("aspect-square w-full", className)} data-slot="pie-chart">
    <ResponsiveContainer height="100%" width="100%">
      <RechartsPieChart>
        <Pie
          cx="50%"
          cy="50%"
          data={data}
          dataKey={category}
          fill="#8884d8"
          labelLine={false}
          outerRadius={80}
        >
          {data.map((entry) => (
            <Cell
              fill={colors[data.indexOf(entry) % colors.length]}
              key={`${entry[index]}-${entry[category]}`}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  </div>
);

/* ------------------------------------------------------------------ */
/* AreaChart                                                           */
/* ------------------------------------------------------------------ */

/** Props for {@link AreaChart}. */
type AreaChartProps = BaseChartProps & {
  /** Data keys to render as separate `<Area>` series. */
  categories: string[];
  /** Stack all areas on top of each other. Defaults to `false`. */
  stacked?: boolean;
  /** Opacity of the area fill. Defaults to `0.2`. */
  fillOpacity?: number;
};

/**
 * Opinionated multi-series area chart with gradient fills.
 *
 * Each string in `categories` becomes an `Area` with `type="monotone"`.
 * When `stacked` is `true` all series share the same `stackId`. Grid lines
 * are horizontal-only. For advanced configuration use Recharts primitives
 * directly inside a {@link ChartContainer}.
 *
 * @example
 * ```tsx
 * <AreaChart
 *   data={[{ month: "Jan", revenue: 4200, cost: 2400 }]}
 *   index="month"
 *   categories={["revenue", "cost"]}
 *   colors={["var(--chart-1)", "var(--chart-2)"]}
 *   stacked
 * />
 * ```
 */
export const AreaChart = ({
  data,
  categories,
  index,
  colors = ["hsl(var(--primary))"],
  valueFormatter = (value) => value.toString(),
  stacked = false,
  fillOpacity = 0.2,
  className,
}: AreaChartProps) => (
  <div className={cn(className)} data-slot="area-chart">
    <ResponsiveContainer height={300} width="100%">
      <RechartsAreaChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey={index}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis
          axisLine={false}
          tickFormatter={valueFormatter}
          tickLine={false}
          tickMargin={10}
        />
        {categories.map((category, i) => {
          const color = colors[i % colors.length];
          return (
            <Area
              dataKey={category}
              fill={color}
              fillOpacity={fillOpacity}
              isAnimationActive={false}
              key={category}
              stackId={stacked ? "a" : undefined}
              stroke={color}
              strokeWidth={2}
              type="monotone"
            />
          );
        })}
      </RechartsAreaChart>
    </ResponsiveContainer>
  </div>
);

/* ------------------------------------------------------------------ */
/* DonutChart                                                          */
/* ------------------------------------------------------------------ */

/** Props for {@link DonutChart}. */
type DonutChartProps = PieChartProps & {
  /** Inner radius of the donut ring in px. Defaults to `60`. */
  innerRadius?: number;
  /** Outer radius of the donut ring in px. Defaults to `80`. */
  outerRadius?: number;
  /** Content rendered in the center hole of the donut. */
  centerLabel?: React.ReactNode;
};

/**
 * Donut chart — a {@link PieChart} variant with a hollow center.
 *
 * The `innerRadius` / `outerRadius` props control ring thickness. Pass
 * `centerLabel` to render arbitrary content (e.g. a total) in the center
 * hole via an absolutely-positioned overlay.
 *
 * @example
 * ```tsx
 * <div className="size-[280px]">
 *   <DonutChart
 *     data={[{ name: "A", value: 60 }, { name: "B", value: 40 }]}
 *     index="name"
 *     category="value"
 *     centerLabel={<span className="text-xl font-bold">100</span>}
 *   />
 * </div>
 * ```
 */
export const DonutChart = ({
  data,
  category,
  index,
  colors = ["hsl(var(--primary))"],
  innerRadius = 60,
  outerRadius = 80,
  centerLabel,
  className,
}: DonutChartProps) => (
  <div
    className={cn("relative aspect-square w-full", className)}
    data-slot="donut-chart"
  >
    <ResponsiveContainer height="100%" width="100%">
      <RechartsPieChart>
        <Pie
          cx="50%"
          cy="50%"
          data={data}
          dataKey={category}
          fill="#8884d8"
          innerRadius={innerRadius}
          labelLine={false}
          outerRadius={outerRadius}
        >
          {data.map((entry) => (
            <Cell
              fill={colors[data.indexOf(entry) % colors.length]}
              key={`${entry[index]}-${entry[category]}`}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
    {centerLabel ? (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {centerLabel}
      </div>
    ) : null}
  </div>
);

/* ------------------------------------------------------------------ */
/* ComboChart                                                          */
/* ------------------------------------------------------------------ */

/** Props for {@link ComboChart}. */
type ComboChartProps = BaseChartProps & {
  /** Data keys rendered as bars on the left Y-axis. */
  barCategories: string[];
  /** Data keys rendered as lines. */
  lineCategories: string[];
  /**
   * When `true` (default), line series use the right Y-axis; bars use the
   * left. Set to `false` to put all series on the left axis.
   */
  rightAxis?: boolean;
};

/**
 * Combination bar + line chart using two Y-axes.
 *
 * `barCategories` are rendered as rounded bars on the left Y-axis.
 * `lineCategories` are rendered as smooth lines on the right Y-axis
 * (or left when `rightAxis={false}`). Colors cycle through the `colors`
 * prop across all series combined.
 *
 * @example
 * ```tsx
 * <ComboChart
 *   data={monthlyData}
 *   index="month"
 *   barCategories={["revenue"]}
 *   lineCategories={["growthRate"]}
 *   colors={["var(--chart-1)", "var(--chart-2)"]}
 *   valueFormatter={(v) => `$${v}`}
 * />
 * ```
 */
export const ComboChart = ({
  data,
  index,
  barCategories,
  lineCategories,
  colors = ["hsl(var(--primary))"],
  valueFormatter = (value) => value.toString(),
  rightAxis = true,
  className,
}: ComboChartProps) => (
  <div className={cn(className)} data-slot="combo-chart">
    <ResponsiveContainer height={300} width="100%">
      <ComposedChart
        data={data}
        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey={index}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis
          axisLine={false}
          tickFormatter={valueFormatter}
          tickLine={false}
          tickMargin={10}
          yAxisId="left"
        />
        {rightAxis ? (
          <YAxis
            axisLine={false}
            orientation="right"
            tickFormatter={valueFormatter}
            tickLine={false}
            tickMargin={10}
            yAxisId="right"
          />
        ) : null}
        {barCategories.map((category, i) => (
          <Bar
            dataKey={category}
            fill={colors[i % colors.length]}
            key={category}
            radius={[BAR_RADIUS, BAR_RADIUS, 0, 0]}
            yAxisId="left"
          />
        ))}
        {lineCategories.map((category, i) => {
          const colorIndex = barCategories.length + i;
          return (
            <Line
              dataKey={category}
              dot={false}
              isAnimationActive={false}
              key={category}
              stroke={colors[colorIndex % colors.length]}
              strokeWidth={2}
              type="monotone"
              yAxisId={rightAxis ? "right" : "left"}
            />
          );
        })}
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

/**
 * Placeholder component for a future map chart.
 *
 * @remarks Not yet implemented — renders a centered informational message.
 */
export const MapChart = () => {
  // TODO: Implement map chart
  return (
    <div className="aspect-square w-full" data-slot="map-chart">
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Map chart component not implemented yet
      </div>
    </div>
  );
};
