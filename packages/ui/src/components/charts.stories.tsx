import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  AreaChart,
  BarChart,
  ComboChart,
  DonutChart,
  LineChart,
  PieChart,
} from "./charts";

/* ------------------------------------------------------------------ */
/* Mock datasets                                                       */
/* ------------------------------------------------------------------ */

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

type CategoryShare = {
  name: string;
  value: number;
};

const categoryShare: CategoryShare[] = [
  { name: "Product A", value: 400 },
  { name: "Product B", value: 300 },
  { name: "Product C", value: 200 },
  { name: "Product D", value: 100 },
];

const brandColors = [
  "var(--primary)",
  "var(--info)",
  "var(--success)",
  "var(--warning)",
];

const usdFormatter = (v: number) => `$${(v / 1000).toFixed(1)}k`;

/* ------------------------------------------------------------------ */
/* Meta (use LineChart as the primary component for autodocs)         */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Additional mock datasets                                           */
/* ------------------------------------------------------------------ */

type MonthlyWithRate = {
  month: string;
  revenue: number;
  expenses: number;
  growthRate: number;
};

const monthlySalesWithRate: MonthlyWithRate[] = [
  { month: "Jan", revenue: 4200, expenses: 2400, growthRate: 8 },
  { month: "Feb", revenue: 3800, expenses: 1980, growthRate: -10 },
  { month: "Mar", revenue: 5100, expenses: 2800, growthRate: 34 },
  { month: "Apr", revenue: 4700, expenses: 2200, growthRate: -8 },
  { month: "May", revenue: 6300, expenses: 3100, growthRate: 34 },
  { month: "Jun", revenue: 5900, expenses: 2900, growthRate: -6 },
];

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const meta: Meta<typeof LineChart> = {
  title: "Data Display/Charts",
  component: LineChart,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Thin wrappers around **Recharts** primitives: `LineChart`, `BarChart`,",
          "`PieChart`, `AreaChart`, `DonutChart`, and `ComboChart`. Each is a",
          "self-contained `ResponsiveContainer` — drop them inside any fixed-height",
          "container.",
          "",
          "Common props: `data` (array), `index` (x-axis key), `categories` /",
          "`category` (data keys for series), `colors`, `valueFormatter`.",
          "",
          "`BarChart` also accepts `layout: 'vertical' | 'horizontal'` (default",
          "`horizontal`) and `stacked: boolean`.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* LineChart                                                           */
/* ------------------------------------------------------------------ */

/** Single-series line chart — revenue over 6 months. */
export const LineChartSingle: Story = {
  render: () => (
    <div className="h-[300px] w-full">
      <LineChart
        categories={["revenue"]}
        colors={["var(--primary)"]}
        data={monthlySales}
        index="month"
        valueFormatter={usdFormatter}
      />
    </div>
  ),
};

/** Multi-series line chart — revenue vs expenses. */
export const LineChartMultiSeries: Story = {
  render: () => (
    <div className="h-[300px] w-full">
      <LineChart
        categories={["revenue", "expenses"]}
        colors={["var(--primary)", "var(--destructive)"]}
        data={monthlySales}
        index="month"
        valueFormatter={usdFormatter}
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* BarChart                                                            */
/* ------------------------------------------------------------------ */

/** Horizontal bar chart (default layout). */
export const BarChartHorizontal: Story = {
  render: () => (
    <div className="h-[300px] w-full">
      <BarChart
        categories={["revenue"]}
        colors={["var(--primary)"]}
        data={monthlySales}
        index="month"
        valueFormatter={usdFormatter}
      />
    </div>
  ),
};

/** Multi-category horizontal bar chart. */
export const BarChartMultiCategory: Story = {
  render: () => (
    <div className="h-[300px] w-full">
      <BarChart
        categories={["revenue", "expenses"]}
        colors={["var(--primary)", "var(--info)"]}
        data={monthlySales}
        index="month"
        valueFormatter={usdFormatter}
      />
    </div>
  ),
};

/** Vertical bar chart — good for category comparisons. */
export const BarChartVertical: Story = {
  render: () => (
    <div className="h-[300px] w-full">
      <BarChart
        categories={["revenue"]}
        colors={["var(--primary)"]}
        data={monthlySales}
        index="month"
        layout="vertical"
        valueFormatter={usdFormatter}
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* PieChart                                                            */
/* ------------------------------------------------------------------ */

/** Pie chart showing product category share. */
export const PieChartBasic: Story = {
  render: () => (
    <div className="mx-auto h-[280px] w-[280px]">
      <PieChart
        category="value"
        colors={brandColors}
        data={categoryShare}
        index="name"
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Composition in a card                                              */
/* ------------------------------------------------------------------ */

/** Charts inside cards — the most common real-world composition. */
export const InCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-4 font-medium text-sm">Monthly Revenue</p>
        <div className="h-[200px]">
          <LineChart
            categories={["revenue"]}
            colors={["var(--primary)"]}
            data={monthlySales}
            index="month"
            valueFormatter={usdFormatter}
          />
        </div>
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="mb-4 font-medium text-sm">Revenue vs Expenses</p>
        <div className="h-[200px]">
          <BarChart
            categories={["revenue", "expenses"]}
            colors={["var(--primary)", "var(--destructive)"]}
            data={monthlySales}
            index="month"
            valueFormatter={usdFormatter}
          />
        </div>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* AreaChart                                                           */
/* ------------------------------------------------------------------ */

/** Single-series area chart — revenue trend. */
export const AreaChartSingle: Story = {
  render: () => (
    <div className="h-[300px] w-full">
      <AreaChart
        categories={["revenue"]}
        colors={[chartColors[0]]}
        data={monthlySales}
        index="month"
        valueFormatter={usdFormatter}
      />
    </div>
  ),
};

/** Multi-series area chart — revenue vs expenses. */
export const AreaChartMultiSeries: Story = {
  render: () => (
    <div className="h-[300px] w-full">
      <AreaChart
        categories={["revenue", "expenses"]}
        colors={[chartColors[0], chartColors[1]]}
        data={monthlySales}
        index="month"
        valueFormatter={usdFormatter}
      />
    </div>
  ),
};

/** Stacked area chart — proportional revenue vs expenses. */
export const AreaChartStacked: Story = {
  render: () => (
    <div className="h-[300px] w-full">
      <AreaChart
        categories={["expenses", "revenue"]}
        colors={[chartColors[1], chartColors[0]]}
        data={monthlySales}
        fillOpacity={0.4}
        index="month"
        stacked
        valueFormatter={usdFormatter}
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* DonutChart                                                          */
/* ------------------------------------------------------------------ */

/** Basic donut chart — product category share. */
export const DonutChartBasic: Story = {
  render: () => (
    <div className="mx-auto h-[280px] w-[280px]">
      <DonutChart
        category="value"
        colors={chartColors}
        data={categoryShare}
        index="name"
      />
    </div>
  ),
};

/** Donut chart with a center label showing the total. */
export const DonutChartWithCenter: Story = {
  render: () => (
    <div className="mx-auto h-[280px] w-[280px]">
      <DonutChart
        category="value"
        centerLabel={
          <div className="flex flex-col items-center">
            <span className="font-bold text-xl">1,000</span>
            <span className="text-muted-foreground text-xs">Total</span>
          </div>
        }
        colors={chartColors}
        data={categoryShare}
        index="name"
        innerRadius={70}
        outerRadius={90}
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* ComboChart                                                          */
/* ------------------------------------------------------------------ */

/** Combo chart — bars for revenue, line for growth rate. */
export const ComboChartBasic: Story = {
  render: () => (
    <div className="h-[300px] w-full">
      <ComboChart
        barCategories={["revenue"]}
        colors={[chartColors[0], chartColors[2]]}
        data={monthlySalesWithRate}
        index="month"
        lineCategories={["growthRate"]}
        valueFormatter={usdFormatter}
      />
    </div>
  ),
};

/** Combo chart with both axes on the left. */
export const ComboChartSingleAxis: Story = {
  render: () => (
    <div className="h-[300px] w-full">
      <ComboChart
        barCategories={["expenses"]}
        colors={[chartColors[1], chartColors[0]]}
        data={monthlySales}
        index="month"
        lineCategories={["revenue"]}
        rightAxis={false}
        valueFormatter={usdFormatter}
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* BarChart stacked                                                    */
/* ------------------------------------------------------------------ */

/** Stacked bar chart — expenses and revenue per month. */
export const StackedBar: Story = {
  render: () => (
    <div className="h-[300px] w-full">
      <BarChart
        categories={["expenses", "revenue"]}
        colors={[chartColors[1], chartColors[0]]}
        data={monthlySales}
        index="month"
        stacked
        valueFormatter={usdFormatter}
      />
    </div>
  ),
};
