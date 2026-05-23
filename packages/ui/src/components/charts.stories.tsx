import type { Meta, StoryObj } from "@storybook/react-vite";

import { BarChart, LineChart, PieChart } from "./charts";

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
          "and `PieChart`. Each is a self-contained `ResponsiveContainer` — drop them",
          "inside any fixed-height container.",
          "",
          "Common props: `data` (array), `index` (x-axis key), `categories` /",
          "`category` (data keys for series), `colors`, `valueFormatter`.",
          "",
          "`BarChart` also accepts `layout: 'vertical' | 'horizontal'` (default `horizontal`).",
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
