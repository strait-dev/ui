"use client";

import {
  type ComponentProps,
  Fragment,
  startTransition,
  useId,
  useMemo,
} from "react";
import {
  Area,
  AreaChart as AreaChartPrimitive,
  Bar,
  BarChart as BarChartPrimitive,
  Cell,
  Line,
  LineChart as LineChartPrimitive,
  type LineProps,
  Pie,
  PieChart as PieChartPrimitive,
} from "recharts";

import {
  type BaseChartProps,
  CartesianGrid,
  Chart,
  type ChartDatum,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  constructCategoryColors,
  DEFAULT_COLORS,
  getColorValue,
  valueToPercent,
  XAxis,
  YAxis,
} from "./chart";

const slugRegExp = /[^a-zA-Z0-9]/g;

const defaultValueFormatter = (value: number) => value.toString();

const cartesianMargin = { bottom: 0, left: 0, right: 0, top: 5 } as const;
const barMargin = { bottom: 0, left: 5, right: 0, top: 5 } as const;

// #region AreaChart --------------------------------------------------------

const areaFillNone = <stop stopColor="currentColor" stopOpacity={0} />;
const areaGradientEnd = (
  <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
);

function getAreaFillContent(
  fillType: AreaChartProps["fillType"],
  stopOpacity: number
): React.ReactNode {
  if (fillType === "none") {
    return areaFillNone;
  }
  if (fillType === "gradient") {
    return (
      <>
        <stop offset="5%" stopColor="currentColor" stopOpacity={stopOpacity} />
        {areaGradientEnd}
      </>
    );
  }
  return <stop stopColor="currentColor" stopOpacity={stopOpacity} />;
}

/** Props for {@link AreaChart}. */
export interface AreaChartProps extends BaseChartProps {
  /** Props forwarded to the underlying recharts `<Area>`. */
  areaProps?: Partial<ComponentProps<typeof Area>>;
  /** Props forwarded to the underlying recharts `<AreaChart>`. */
  chartProps?: Omit<
    ComponentProps<typeof AreaChartPrimitive>,
    "data" | "stackOffset"
  >;
  /** Join across null gaps instead of breaking the area. */
  connectNulls?: boolean;
  /** Fill treatment beneath each area. Defaults to `"gradient"`. */
  fillType?: "gradient" | "solid" | "none";
}

/**
 * Config-driven multi-series area chart.
 *
 * Series are derived from the `config` keys; each gets a gradient (or solid)
 * fill and an on-palette stroke. Supports `type="stacked"` / `"percent"`,
 * `connectNulls`, an interactive legend (clicking a series isolates it), and
 * a frosted tooltip — all via the shared {@link Chart} root.
 *
 * @example
 * ```tsx
 * <AreaChart
 *   data={data}
 *   dataKey="month"
 *   config={{
 *     revenue: { label: "Revenue", color: "chart-1" },
 *     cost: { label: "Cost", color: "chart-2" },
 *   }}
 *   type="stacked"
 * />
 * ```
 */
export function AreaChart({
  data = [],
  dataKey,
  colors = DEFAULT_COLORS,
  connectNulls = false,
  type = "default",
  fillType = "gradient",
  config,
  children,
  areaProps,
  tooltip = true,
  tooltipProps,
  cartesianGridProps,
  legend = true,
  legendProps,
  intervalType = "equidistantPreserveStart",
  valueFormatter = defaultValueFormatter,
  displayEdgeLabelsOnly = false,
  hideXAxis = false,
  xAxisProps,
  hideYAxis = false,
  yAxisProps,
  hideGridLines = false,
  chartProps,
  ...props
}: AreaChartProps) {
  const configKeys = useMemo(() => Object.keys(config), [config]);
  const categoryColors = useMemo(
    () => constructCategoryColors(configKeys, colors),
    [configKeys, colors]
  );
  const configEntries = useMemo(() => Object.entries(config), [config]);
  const stacked = type === "stacked" || type === "percent";
  const areaId = useId();

  return (
    <Chart config={config} data={data} dataKey={dataKey} {...props}>
      {({ onLegendSelect, selectedLegend }) => (
        <AreaChartPrimitive
          data={data}
          margin={cartesianMargin}
          onClick={() => onLegendSelect(null)}
          stackOffset={type === "percent" ? "expand" : undefined}
          {...chartProps}
        >
          {!hideGridLines && (
            <CartesianGrid strokeDasharray="3 3" {...cartesianGridProps} />
          )}
          <XAxis
            displayEdgeLabelsOnly={displayEdgeLabelsOnly}
            hide={hideXAxis}
            intervalType={intervalType}
            {...xAxisProps}
          />
          <YAxis
            hide={hideYAxis}
            tickFormatter={type === "percent" ? valueToPercent : valueFormatter}
            {...yAxisProps}
          />
          {legend && (
            <ChartLegend
              content={
                typeof legend === "boolean" ? <ChartLegendContent /> : legend
              }
              {...legendProps}
            />
          )}
          {tooltip && (
            <ChartTooltip
              content={
                typeof tooltip === "boolean" ? (
                  <ChartTooltipContent
                    hideIndicator={tooltipProps?.hideIndicator}
                    hideLabel={tooltipProps?.hideLabel}
                    indicator={tooltipProps?.indicator}
                    labelSeparator={tooltipProps?.labelSeparator}
                  />
                ) : (
                  tooltip
                )
              }
              {...tooltipProps}
            />
          )}
          {children
            ? children
            : configEntries.map(([category, values]) => {
                const categoryId = `${areaId}-${category.replace(slugRegExp, "")}`;
                const dimmed = selectedLegend && selectedLegend !== category;
                const strokeOpacity = dimmed ? 0.1 : 1;
                const stopOpacity = dimmed ? 0.1 : 0.5;
                const color = getColorValue(
                  values.color || categoryColors.get(category)
                );

                return (
                  <Fragment key={categoryId}>
                    <defs>
                      <linearGradient
                        id={categoryId}
                        style={{ color }}
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        {getAreaFillContent(fillType, stopOpacity)}
                      </linearGradient>
                    </defs>
                    <Area
                      connectNulls={connectNulls}
                      dataKey={category}
                      dot={false}
                      fill={`url(#${categoryId})`}
                      name={category}
                      stackId={stacked ? "stack" : undefined}
                      stroke={color}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ strokeWidth: 2, strokeOpacity }}
                      {...areaProps}
                    />
                  </Fragment>
                );
              })}
        </AreaChartPrimitive>
      )}
    </Chart>
  );
}

// #region BarChart ---------------------------------------------------------

/** Props for {@link BarChart}. */
export interface BarChartProps extends BaseChartProps {
  /** Gap between bar groups (categories) in pixels. */
  barCategoryGap?: number;
  /** Gap between individual bars within a group in pixels. */
  barGap?: number;
  /** Props forwarded to the underlying recharts `<Bar>`. */
  barProps?: Partial<ComponentProps<typeof Bar>>;
  /** Border-radius applied to the top corners of each bar. */
  barRadius?: number;
  /** Fixed width in pixels for each bar. */
  barSize?: number;
  /** Props forwarded to the underlying recharts `<BarChart>`. */
  chartProps?: Omit<
    ComponentProps<typeof BarChartPrimitive>,
    "data" | "stackOffset"
  >;
}

/**
 * Config-driven multi-series bar chart.
 *
 * Series come from `config` keys. Supports `layout="horizontal" | "vertical"`,
 * `type="stacked"` / `"percent"`, configurable bar radius/gap/size, an
 * interactive legend (clicking a bar or legend entry isolates that series),
 * and the frosted tooltip.
 *
 * @example
 * ```tsx
 * <BarChart
 *   data={data}
 *   dataKey="quarter"
 *   config={{ sales: { label: "Sales", color: "chart-1" } }}
 * />
 * ```
 */
export function BarChart({
  data = [],
  dataKey,
  colors = DEFAULT_COLORS,
  type = "default",
  config,
  children,
  layout = "horizontal",
  tooltip = true,
  tooltipProps,
  legend = true,
  legendProps,
  intervalType = "equidistantPreserveStart",
  barCategoryGap = 5,
  barGap,
  barSize,
  barRadius,
  barProps,
  valueFormatter = defaultValueFormatter,
  displayEdgeLabelsOnly = false,
  xAxisProps,
  hideXAxis = false,
  yAxisProps,
  hideYAxis = false,
  hideGridLines = false,
  cartesianGridProps,
  chartProps,
  ...props
}: BarChartProps) {
  const configKeys = useMemo(() => Object.keys(config), [config]);
  const categoryColors = useMemo(
    () => constructCategoryColors(configKeys, colors),
    [configKeys, colors]
  );
  const configEntries = useMemo(() => Object.entries(config), [config]);
  const stacked = type === "stacked" || type === "percent";
  const defaultBarRadius = stacked ? undefined : 4;

  const percentOffset = type === "percent" ? "expand" : undefined;
  const stackOffset = stacked && type !== "percent" ? "sign" : percentOffset;

  return (
    <Chart
      config={config}
      data={data}
      dataKey={dataKey}
      layout={layout}
      {...props}
    >
      {({ onLegendSelect, selectedLegend }) => (
        <BarChartPrimitive
          barCategoryGap={barCategoryGap}
          barGap={barGap}
          barSize={barSize}
          data={data}
          layout={layout === "radial" ? "horizontal" : layout}
          margin={barMargin}
          onClick={() => onLegendSelect(null)}
          stackOffset={stackOffset}
          {...chartProps}
        >
          {!hideGridLines && (
            <CartesianGrid strokeDasharray="4 4" {...cartesianGridProps} />
          )}
          <XAxis
            displayEdgeLabelsOnly={displayEdgeLabelsOnly}
            hide={hideXAxis}
            intervalType={intervalType}
            {...xAxisProps}
          />
          <YAxis
            hide={hideYAxis}
            tickFormatter={type === "percent" ? valueToPercent : valueFormatter}
            {...yAxisProps}
          />
          {legend && (
            <ChartLegend
              content={
                typeof legend === "boolean" ? <ChartLegendContent /> : legend
              }
              {...legendProps}
            />
          )}
          {tooltip && (
            <ChartTooltip
              content={
                typeof tooltip === "boolean" ? <ChartTooltipContent /> : tooltip
              }
              {...tooltipProps}
            />
          )}
          {children
            ? children
            : configEntries.map(([category, values]) => {
                const color = getColorValue(
                  values.color || categoryColors.get(category)
                );
                const dimmed = selectedLegend && selectedLegend !== category;
                const strokeOpacity = dimmed ? 0.2 : 0;
                const fillOpacity = dimmed ? 0.1 : 1;

                return (
                  <Bar
                    dataKey={category}
                    fill={color}
                    fillOpacity={fillOpacity}
                    key={category}
                    name={category}
                    onClick={(_item, _index, event) => {
                      event.stopPropagation();
                      startTransition(() => onLegendSelect(category));
                    }}
                    radius={barRadius ?? defaultBarRadius}
                    stackId={stacked ? "stack" : undefined}
                    stroke={color}
                    strokeOpacity={strokeOpacity}
                    strokeWidth={1}
                    {...barProps}
                  />
                );
              })}
        </BarChartPrimitive>
      )}
    </Chart>
  );
}

// #region LineChart --------------------------------------------------------

/** Props for {@link LineChart}. */
export interface LineChartProps extends BaseChartProps {
  /** Props forwarded to the underlying recharts `<LineChart>`. */
  chartProps?: Omit<
    ComponentProps<typeof LineChartPrimitive>,
    "data" | "stackOffset"
  >;
  /** Join across null gaps instead of breaking the line. */
  connectNulls?: boolean;
  /** Props forwarded to the underlying recharts `<Line>`. */
  lineProps?: Partial<LineProps>;
}

/**
 * Config-driven multi-series line chart.
 *
 * Series come from `config` keys; each line is on-palette with rounded caps.
 * Supports `connectNulls`, an interactive legend, `type="percent"`
 * normalisation, and the frosted tooltip.
 *
 * @example
 * ```tsx
 * <LineChart
 *   data={data}
 *   dataKey="month"
 *   config={{ revenue: { label: "Revenue", color: "chart-1" } }}
 * />
 * ```
 */
export function LineChart({
  data = [],
  dataKey,
  colors = DEFAULT_COLORS,
  connectNulls = false,
  type = "default",
  config,
  children,
  tooltip = true,
  tooltipProps,
  legend = true,
  legendProps,
  intervalType = "equidistantPreserveStart",
  valueFormatter = defaultValueFormatter,
  displayEdgeLabelsOnly = false,
  xAxisProps,
  hideXAxis = false,
  yAxisProps,
  hideYAxis = false,
  hideGridLines = false,
  cartesianGridProps,
  chartProps,
  lineProps,
  ...props
}: LineChartProps) {
  const configKeys = useMemo(() => Object.keys(config), [config]);
  const categoryColors = useMemo(
    () => constructCategoryColors(configKeys, colors),
    [configKeys, colors]
  );
  const configEntries = useMemo(() => Object.entries(config), [config]);

  return (
    <Chart config={config} data={data} dataKey={dataKey} {...props}>
      {({ onLegendSelect, selectedLegend }) => (
        <LineChartPrimitive
          data={data}
          margin={cartesianMargin}
          onClick={() => onLegendSelect(null)}
          stackOffset={type === "percent" ? "expand" : undefined}
          {...chartProps}
        >
          {!hideGridLines && (
            <CartesianGrid strokeDasharray="4 4" {...cartesianGridProps} />
          )}
          <XAxis
            displayEdgeLabelsOnly={displayEdgeLabelsOnly}
            hide={hideXAxis}
            intervalType={intervalType}
            {...xAxisProps}
          />
          <YAxis
            hide={hideYAxis}
            tickFormatter={type === "percent" ? valueToPercent : valueFormatter}
            {...yAxisProps}
          />
          {legend && (
            <ChartLegend
              content={
                typeof legend === "boolean" ? <ChartLegendContent /> : legend
              }
              {...legendProps}
            />
          )}
          {tooltip && (
            <ChartTooltip
              content={
                typeof tooltip === "boolean" ? <ChartTooltipContent /> : tooltip
              }
              {...tooltipProps}
            />
          )}
          {children
            ? children
            : configEntries.map(([category, values]) => {
                const dimmed = selectedLegend && selectedLegend !== category;
                const strokeOpacity = dimmed ? 0.1 : 1;
                const color = getColorValue(
                  values.color || categoryColors.get(category)
                );

                return (
                  <Line
                    connectNulls={connectNulls}
                    dataKey={category}
                    dot={false}
                    key={category}
                    name={category}
                    stroke={color}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={
                      {
                        strokeOpacity,
                        strokeWidth: 2,
                        "--line-color": color,
                      } as React.CSSProperties
                    }
                    type="linear"
                    {...lineProps}
                  />
                );
              })}
        </LineChartPrimitive>
      )}
    </Chart>
  );
}

// #region PieChart / DonutChart -------------------------------------------

function sumNumericValues(data: ChartDatum[], valueKey: string): number {
  return data.reduce((sum, row) => {
    const value = row[valueKey];
    return sum + (typeof value === "number" ? value : 0);
  }, 0);
}

function resolveConfigKey(datum: ChartDatum): string | undefined {
  if (typeof datum.code === "string") {
    return datum.code;
  }
  if (typeof datum.name === "string") {
    return datum.name;
  }
  return;
}

/** Props for {@link PieChart}. */
interface PieChartProps
  extends Omit<
    BaseChartProps,
    | "hideGridLines"
    | "hideXAxis"
    | "hideYAxis"
    | "xAxisProps"
    | "yAxisProps"
    | "displayEdgeLabelsOnly"
    | "legend"
    | "legendProps"
  > {
  /** Props forwarded to the underlying recharts `<PieChart>`. */
  chartProps?: Omit<
    ComponentProps<typeof PieChartPrimitive>,
    "data" | "stackOffset"
  >;
  /** Centre label text for the donut variant. Defaults to the value sum. */
  label?: string;
  /** Data key used as the slice name (maps rows to `config` entries). */
  nameKey?: string;
  /** Props forwarded to the underlying recharts `<Pie>`. */
  pieProps?: Omit<ComponentProps<typeof Pie>, "data" | "dataKey" | "name">;
  /** Show the centre label (donut variant only). */
  showLabel?: boolean;
  /** `"pie"` (solid) or `"donut"` (hollow centre). Defaults to `"pie"`. */
  variant?: "pie" | "donut";
}

/**
 * Config-driven pie / donut chart.
 *
 * Each data row becomes one slice, colored from `config[code|name].color` or
 * the cycling palette. Set `variant="donut"` for a hollow centre, and
 * `showLabel` to render a centred total (or custom `label`).
 *
 * @example
 * ```tsx
 * <PieChart
 *   data={[{ name: "Chrome", value: 60 }, { name: "Safari", value: 40 }]}
 *   dataKey="value"
 *   nameKey="name"
 *   variant="donut"
 *   showLabel
 *   config={{ Chrome: { label: "Chrome", color: "chart-1" } }}
 * />
 * ```
 */
const PieChart = ({
  data = [],
  dataKey,
  colors = DEFAULT_COLORS,
  config,
  children,
  label,
  showLabel,
  tooltip = true,
  tooltipProps,
  variant = "pie",
  nameKey,
  chartProps,
  valueFormatter = defaultValueFormatter,
  pieProps,
  ...props
}: PieChartProps) => {
  const centerLabel = label || valueFormatter(sumNumericValues(data, dataKey));

  return (
    <Chart
      config={config}
      data={data}
      dataKey={dataKey}
      layout="radial"
      {...props}
    >
      {({ onLegendSelect }) => (
        <PieChartPrimitive
          data={data}
          margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
          onClick={() => onLegendSelect(null)}
          {...chartProps}
        >
          {showLabel && variant === "donut" && (
            <text
              className="fill-foreground font-semibold"
              data-slot="label"
              dominantBaseline="middle"
              textAnchor="middle"
              x="50%"
              y="50%"
            >
              {centerLabel}
            </text>
          )}
          {children ? (
            children
          ) : (
            <Pie
              cx={pieProps?.cx ?? "50%"}
              cy={pieProps?.cy ?? "50%"}
              data={data}
              dataKey={dataKey}
              endAngle={pieProps?.endAngle ?? -270}
              innerRadius={variant === "donut" ? "50%" : "0%"}
              isAnimationActive
              name={nameKey}
              startAngle={pieProps?.startAngle ?? 90}
              strokeLinejoin="round"
              {...pieProps}
            >
              {data.map((datum, index) => {
                const configKey = resolveConfigKey(datum);
                return (
                  <Cell
                    fill={getColorValue(
                      config?.[configKey ?? ""]?.color ??
                        colors[index % colors.length]
                    )}
                    key={`cell-${configKey ?? index}`}
                  />
                );
              })}
            </Pie>
          )}
          {tooltip && (
            <ChartTooltip
              content={
                typeof tooltip === "boolean" ? (
                  <ChartTooltipContent hideLabel labelSeparator={false} />
                ) : (
                  tooltip
                )
              }
              {...tooltipProps}
            />
          )}
        </PieChartPrimitive>
      )}
    </Chart>
  );
};

/**
 * Donut chart — a thin convenience wrapper over {@link PieChart} with
 * `variant="donut"` and the centre label enabled by default.
 *
 * @example
 * ```tsx
 * <DonutChart
 *   data={data}
 *   dataKey="value"
 *   nameKey="name"
 *   config={config}
 * />
 * ```
 */
const DonutChart = ({
  showLabel = true,
  ...props
}: Omit<PieChartProps, "variant">) => (
  <PieChart showLabel={showLabel} variant="donut" {...props} />
);

export type { PieChartProps };
export { DonutChart, PieChart };
