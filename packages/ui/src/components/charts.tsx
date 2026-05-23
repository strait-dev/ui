"use client";
import {
  Bar,
  CartesianGrid,
  Cell,
  Line,
  Pie,
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
  className,
}: BarChartProps) => (
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
        {categories.map((category, i) => (
          <Bar
            dataKey={category}
            fill={colors[i % colors.length]}
            key={category}
            radius={[BAR_RADIUS, BAR_RADIUS, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  </div>
);

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
