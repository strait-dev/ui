import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, within } from "storybook/test";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { type ChartConfig, ChartSeriesSelector } from "./chart";
import { AreaChart, BarChart, DonutChart, LineChart, PieChart } from "./charts";
import { MetricCard } from "./metric-card";

type MonthlySales = {
  month: string;
  revenue: number;
  expenses: number;
};

const monthlySales: MonthlySales[] = [
  { month: "Jan", revenue: 4200, expenses: 2400 },
  { month: "Feb", revenue: 3800, expenses: 1980 },
  { month: "Mar", revenue: 5100, expenses: 2800 },
  { month: "Apr", revenue: 4700, expenses: 2200 },
  { month: "May", revenue: 6300, expenses: 3100 },
  { month: "Jun", revenue: 5900, expenses: 2900 },
];

const salesConfig = {
  revenue: { label: "Revenue", color: "chart-1" },
  expenses: { label: "Expenses", color: "chart-2" },
} satisfies ChartConfig;

type CategoryShare = { name: string; value: number };

const categoryShare: CategoryShare[] = [
  { name: "Product A", value: 400 },
  { name: "Product B", value: 300 },
  { name: "Product C", value: 200 },
  { name: "Product D", value: 100 },
];

const shareConfig = {
  "Product A": { label: "Product A", color: "chart-1" },
  "Product B": { label: "Product B", color: "chart-2" },
  "Product C": { label: "Product C", color: "chart-3" },
  "Product D": { label: "Product D", color: "chart-4" },
} satisfies ChartConfig;

const usdFormatter = (v: number) => `$${(v / 1000).toFixed(1)}k`;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-2xl">{children}</div>
);

const meta: Meta<typeof AreaChart> = {
  title: "Data Display/Charts",
  component: AreaChart,
  tags: ["autodocs"],
  args: {
    config: salesConfig,
    data: monthlySales,
    dataKey: "month",
    valueFormatter: usdFormatter,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Config-driven charts inspired by Intent UI, rebuilt on our design",
          "system: `AreaChart`, `BarChart`, `LineChart`, `PieChart`, and the",
          "`DonutChart` convenience wrapper.",
          "",
          "Series come from the `config` keys; colors use the `chart-1…chart-5`",
          "tokens. Shared props: `data`, `dataKey` (category axis), `config`,",
          "`colors`, `type` (`default | stacked | percent`), `valueFormatter`,",
          "`tooltip`, `legend`. Clicking a legend entry (or a bar) isolates that",
          "series; click again to clear. Drive that same selection from outside",
          "the chart with `<ChartSeriesSelector>` (a header metric toggle) by",
          "sharing state via `selectedSeries` / `onSelectedSeriesChange` — see",
          "the **Interactive** stories.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// #region Area -------------------------------------------------------------

export const Playground: Story = {
  render: (args) => (
    <Frame>
      <AreaChart {...args} />
    </Frame>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvasElement.querySelector('[data-slot="chart"]')
    ).toBeInTheDocument();
    expect(canvas.getAllByText("Revenue").length).toBeGreaterThan(0);
  },
};

export const Area: Story = {
  render: (args) => (
    <Frame>
      <AreaChart {...args} />
    </Frame>
  ),
};

export const AreaStacked: Story = {
  render: (args) => (
    <Frame>
      <AreaChart {...args} type="stacked" />
    </Frame>
  ),
};

export const AreaPercent: Story = {
  render: (args) => (
    <Frame>
      <AreaChart {...args} type="percent" />
    </Frame>
  ),
};

export const AreaSolidFill: Story = {
  render: (args) => (
    <Frame>
      <AreaChart {...args} fillType="solid" />
    </Frame>
  ),
};

export const AreaNoFill: Story = {
  render: (args) => (
    <Frame>
      <AreaChart {...args} fillType="none" />
    </Frame>
  ),
};

// #region Bar --------------------------------------------------------------

export const Bar: Story = {
  render: (args) => (
    <Frame>
      <BarChart {...args} />
    </Frame>
  ),
};

export const BarStacked: Story = {
  render: (args) => (
    <Frame>
      <BarChart {...args} type="stacked" />
    </Frame>
  ),
};

export const BarPercent: Story = {
  render: (args) => (
    <Frame>
      <BarChart {...args} type="percent" />
    </Frame>
  ),
};

export const BarVertical: Story = {
  render: (args) => (
    <Frame>
      <BarChart {...args} layout="vertical" />
    </Frame>
  ),
};

// #region Line -------------------------------------------------------------

export const Line: Story = {
  render: (args) => (
    <Frame>
      <LineChart {...args} />
    </Frame>
  ),
};

export const LineSingleSeries: Story = {
  render: (args) => (
    <Frame>
      <LineChart
        {...args}
        config={{ revenue: { label: "Revenue", color: "chart-1" } }}
      />
    </Frame>
  ),
};

// #region Pie / Donut ------------------------------------------------------

export const Pie: Story = {
  render: () => (
    <div className="mx-auto size-[320px]">
      <PieChart
        config={shareConfig}
        containerHeight={320}
        data={categoryShare}
        dataKey="value"
        nameKey="name"
      />
    </div>
  ),
};

export const Donut: Story = {
  render: () => (
    <div className="mx-auto size-[320px]">
      <DonutChart
        config={shareConfig}
        containerHeight={320}
        data={categoryShare}
        dataKey="value"
        nameKey="name"
      />
    </div>
  ),
};

// #region Interactive selection -------------------------------------------

/**
 * Header metric selector wired to the chart: pick a series (e.g. Revenue or
 * Expenses) to isolate it. The header toggles and the in-chart interactive
 * legend share one piece of state (`selectedSeries` / `onSelectedSeriesChange`).
 */
export const Interactive: Story = {
  render: () => {
    const [series, setSeries] = useState<string | null>("revenue");
    return (
      <Frame>
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs expenses</CardTitle>
            <CardDescription>
              Pick a metric to focus it — click it again to clear.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartSeriesSelector
              config={salesConfig}
              data={monthlySales}
              onValueChange={setSeries}
              showTotal
              value={series}
              valueFormatter={usdFormatter}
            />
            <AreaChart
              config={salesConfig}
              containerHeight={260}
              data={monthlySales}
              dataKey="month"
              onSelectedSeriesChange={setSeries}
              selectedSeries={series}
              valueFormatter={usdFormatter}
            />
          </CardContent>
        </Card>
      </Frame>
    );
  },
};

/**
 * Same shared-state pattern with a compact (no-total) selector driving a bar
 * chart. Clicking a bar also updates the selection.
 */
export const BarInteractive: Story = {
  render: () => {
    const [series, setSeries] = useState<string | null>(null);
    return (
      <Frame>
        <Card>
          <CardHeader>
            <CardTitle>Quarterly performance</CardTitle>
            <CardDescription>
              Selected:{" "}
              {series
                ? (salesConfig[series as keyof typeof salesConfig]?.label ??
                  series)
                : "all series"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChartSeriesSelector
              config={salesConfig}
              onValueChange={setSeries}
              value={series}
            />
            <BarChart
              config={salesConfig}
              containerHeight={260}
              data={monthlySales}
              dataKey="month"
              onSelectedSeriesChange={setSeries}
              selectedSeries={series}
              valueFormatter={usdFormatter}
            />
          </CardContent>
        </Card>
      </Frame>
    );
  },
};

// #region Composition ------------------------------------------------------

/** Charts living inside design-system `Card`s. */
export const InCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Monthly revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart
            config={{ revenue: { label: "Revenue", color: "chart-1" } }}
            containerHeight={220}
            data={monthlySales}
            dataKey="month"
            valueFormatter={usdFormatter}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            config={salesConfig}
            containerHeight={220}
            data={monthlySales}
            dataKey="month"
            valueFormatter={usdFormatter}
          />
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * A dashboard slice: a responsive row of {@link MetricCard}s (each with its own
 * sparkline) above a full chart card.
 */
export const InMetricCards: Story = {
  render: () => {
    const revenue = monthlySales.reduce((sum, m) => sum + m.revenue, 0);
    const expenses = monthlySales.reduce((sum, m) => sum + m.expenses, 0);
    const net = revenue - expenses;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            color="var(--chart-1)"
            data={monthlySales.map((m) => m.revenue)}
            delta={{ value: 12, label: "vs last period" }}
            title="Revenue"
            value={usdFormatter(revenue)}
          />
          <MetricCard
            color="var(--chart-2)"
            data={monthlySales.map((m) => m.expenses)}
            delta={{ value: -4, label: "vs last period" }}
            title="Expenses"
            value={usdFormatter(expenses)}
          />
          <MetricCard
            color="var(--chart-3)"
            delta={{ value: 8, label: "vs last period" }}
            title="Net"
            value={usdFormatter(net)}
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              config={salesConfig}
              containerHeight={240}
              data={monthlySales}
              dataKey="month"
              valueFormatter={usdFormatter}
            />
          </CardContent>
        </Card>
      </div>
    );
  },
};

/**
 * Charts are fluid: each `ResponsiveContainer` fills its grid cell, so the same
 * chart reflows as the layout breaks from one to three columns.
 */
export const Responsive: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Area</CardTitle>
        </CardHeader>
        <CardContent>
          <AreaChart
            config={{ revenue: { label: "Revenue", color: "chart-1" } }}
            containerHeight={180}
            data={monthlySales}
            dataKey="month"
            legend={false}
            valueFormatter={usdFormatter}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Bars</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            config={{ expenses: { label: "Expenses", color: "chart-2" } }}
            containerHeight={180}
            data={monthlySales}
            dataKey="month"
            legend={false}
            valueFormatter={usdFormatter}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Share</CardTitle>
        </CardHeader>
        <CardContent>
          <DonutChart
            config={shareConfig}
            containerHeight={180}
            data={categoryShare}
            dataKey="value"
            nameKey="name"
          />
        </CardContent>
      </Card>
    </div>
  ),
};
