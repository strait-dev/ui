"use client";

import * as React from "react";
import type { LegendPayload, TooltipPayloadEntry } from "recharts";
import * as RechartsPrimitive from "recharts";

import { cn } from "../utils/index";

type TooltipPayloadItem = TooltipPayloadEntry;
type LegendPayloadItem = LegendPayload;

// Format: { THEME_NAME: CSS_SELECTOR }
// The empty string for "light" means the rule targets the root selector.
const THEMES = { light: "", dark: ".dark" } as const;

/**
 * Per-series configuration passed to {@link ChartContainer}.
 *
 * Each key is a data series identifier that maps to a display label, an
 * optional icon component, and a color source. Colors can be specified as
 * a single `color` string (applied in both themes) or as a `theme` map
 * keyed by light/dark theme names — the latter generates scoped CSS
 * custom properties via {@link ChartStyle}.
 */
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

/** Internal context value exposing the {@link ChartConfig} to descendants. */
type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

/**
 * Hook that reads the nearest {@link ChartContainer} context.
 *
 * Used internally by {@link ChartTooltipContent} and
 * {@link ChartLegendContent} to resolve series labels and colors from
 * {@link ChartConfig}.
 */
function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

/**
 * Root wrapper for all Recharts-based chart components in the design system.
 *
 * Provides the {@link ChartConfig} to descendants via React context and
 * injects scoped CSS custom properties (`--color-<key>`) for every series
 * that declares a `color` or `theme` entry via {@link ChartStyle}. All
 * Recharts opinionated colors and outlines are neutralised through a
 * comprehensive selector list on the container `div`.
 *
 * @remarks
 * - Pass the `config` once here; {@link ChartTooltipContent} and
 *   {@link ChartLegendContent} read it automatically.
 * - The `id` prop is used to scope the injected `<style>` to this specific
 *   chart instance; if omitted a stable random id is generated with
 *   `React.useId`.
 * - `children` must be a valid Recharts `ResponsiveContainer` child (i.e.
 *   a single Recharts chart element like `<BarChart>`).
 *
 * @example
 * ```tsx
 * const config: ChartConfig = {
 *   revenue: { label: "Revenue", color: "hsl(var(--primary))" },
 * };
 *
 * <ChartContainer config={config}>
 *   <BarChart data={data}>
 *     <Bar dataKey="revenue" fill="var(--color-revenue)" />
 *   </BarChart>
 * </ChartContainer>
 * ```
 */
function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  // Stable selector for the scoped <style> injected by ChartStyle.
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden",
          className
        )}
        data-chart={chartId}
        data-slot="chart"
        {...props}
      >
        <ChartStyle config={config} id={chartId} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/**
 * Renders a `<style>` tag that injects `--color-<key>` CSS custom
 * properties scoped to the `[data-chart=<id>]` element for both light and
 * dark themes. Entries without a `color` or `theme` are skipped. Called
 * internally by {@link ChartContainer}.
 */
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  // Only generate CSS for series that actually declare a color or theme map.
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static chart-theme CSS derived from build-time ChartConfig, no user input
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

/** Re-export of Recharts `Tooltip` for use with {@link ChartTooltipContent}. */
const ChartTooltip = RechartsPrimitive.Tooltip;

/**
 * Styled tooltip body rendered inside a Recharts `<Tooltip content={…} />`.
 *
 * Reads series metadata (labels and colors) from the enclosing
 * {@link ChartContainer}'s config via {@link useChart}. Supports three
 * indicator styles (`"dot"`, `"line"`, `"dashed"`), optional label
 * suppression, and a custom `formatter` override that replaces the default
 * label + value layout for any single item.
 *
 * @remarks
 * - When only one payload entry is present and `indicator !== "dot"` the
 *   label is inlined ("nested") next to the value rather than shown above.
 * - Pass `nameKey` to resolve the config entry by a field other than
 *   `item.name` (useful when recharts infers an unexpected key).
 * - Pass `labelKey` to use a different field for the top label row.
 */
function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
    payload?: TooltipPayloadItem[];
    label?: string;
  }) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    // Prefer an explicit labelKey; fall back to the item's own dataKey/name.
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    // When no labelKey is provided, check if `label` is itself a config key
    // (e.g. a category name) before falling back to the raw string.
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload as readonly TooltipPayloadItem[])}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>;
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!(active && payload?.length)) {
    return null;
  }

  // Nest the label inside the single row when a line/dashed indicator is
  // used — it reads more naturally as "label · value" in one line.
  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {nestLabel ? null : tooltipLabel}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
                key={item.dataKey as React.Key}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(
                    item.value,
                    item.name,
                    item as TooltipPayloadItem,
                    index,
                    item.payload
                  )
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-medium font-mono text-foreground tabular-nums">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

/** Re-export of Recharts `Legend` for use with {@link ChartLegendContent}. */
const ChartLegend = RechartsPrimitive.Legend;

/**
 * Styled legend body rendered inside a Recharts `<Legend content={…} />`.
 *
 * Reads series labels and icons from {@link ChartContainer}'s config via
 * {@link useChart}. Pass `nameKey` to resolve config entries by a field
 * other than the default `item.dataKey`.
 */
function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean;
  nameKey?: string;
  payload?: LegendPayloadItem[];
  verticalAlign?: "top" | "bottom" | "middle";
}) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
              key={item.value}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}

/**
 * Resolves the {@link ChartConfig} entry for a Recharts tooltip/legend
 * payload item.
 *
 * Recharts nests the original data record inside `payload.payload`, so the
 * lookup walks two levels: the top-level payload object first, then its
 * nested `payload` property, before falling back to the literal `key`.
 * This allows consumers to store the config key as a string value inside
 * their data (e.g. `{ type: "revenue" }`) and have it auto-resolved.
 */
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return;
  }

  // Recharts places the raw data row at payload.payload.
  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  // Check top-level payload first (e.g. tooltip item), then the nested row.
  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
