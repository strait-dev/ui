import {
  Activity01Icon,
  ChartIncreaseIcon,
  MoneyBag01Icon,
  UserCircle02Icon,
} from "@hugeicons/core-free-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  MetricCard,
  MetricCardDelta,
  MetricCardHeader,
  MetricCardSparkline,
  MetricCardValue,
} from "./metric-card";

const meta: Meta<typeof MetricCard> = {
  title: "Data Display/Metric Card",
  component: MetricCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Self-contained metric summary card with a title, primary value, optional",
          "delta indicator, and sparkline chart.",
          "",
          "The all-in-one `MetricCard` composes `MetricCardHeader`, `MetricCardValue`,",
          "`MetricCardDelta`, and `MetricCardSparkline` — all sub-parts are also exported",
          "for manual composition when the default layout doesn't fit.",
          "",
          "Built on the design-system `Card`/`CardHeader`/`CardContent` components.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    title: { control: "text", description: "Card heading." },
    value: { control: "text", description: "Primary metric value." },
    color: {
      control: "text",
      description: "Sparkline bar fill color.",
      table: { defaultValue: { summary: "var(--chart-1)" } },
    },
    description: { control: "text", description: "Muted description line." },
  },
  args: {
    title: "Total Revenue",
    value: "$48,295",
    delta: { value: 12, label: "vs last month" },
    color: "var(--chart-1)",
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — tweak title, value, and delta. */
export const Playground: Story = {};

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

/** Minimal card — just a title and value. */
export const Minimal: Story = {
  args: {
    title: "Active Users",
    value: "1,284",
    delta: undefined,
    color: "var(--chart-1)",
  },
};

/** Positive delta — shown in success accent color. */
export const PositiveDelta: Story = {
  args: {
    title: "Monthly Sales",
    value: "$24,000",
    delta: { value: 8.5, label: "vs last month" },
    color: "var(--chart-2)",
  },
};

/** Negative delta — shown in destructive accent color. */
export const NegativeDelta: Story = {
  args: {
    title: "Churn Rate",
    value: "3.2%",
    delta: { value: -1.4, label: "vs last month", direction: "down" },
    color: "var(--chart-5)",
  },
};

/** Card with sparkline trend data. */
export const WithSparkline: Story = {
  args: {
    title: "Page Views",
    value: "84,921",
    delta: { value: 5.1, label: "vs last week" },
    data: [420, 380, 510, 470, 630, 590, 720, 849],
    color: "var(--chart-3)",
  },
};

/** Card with a trailing header icon. */
export const WithIcon: Story = {
  args: {
    title: "Revenue",
    value: "$48,295",
    delta: { value: 12, label: "vs last month" },
    icon: MoneyBag01Icon,
    data: [320, 450, 410, 530, 490, 600, 590, 720],
    color: "var(--chart-1)",
  },
};

/** Card with description text. */
export const WithDescription: Story = {
  args: {
    title: "Conversion Rate",
    value: "4.6%",
    delta: { value: 0.3, label: "vs last week" },
    description: "Based on the last 30 days of sessions.",
    color: "var(--chart-4)",
  },
};

/* ------------------------------------------------------------------ */
/* Compositions                                                        */
/* ------------------------------------------------------------------ */

/** Dashboard row — four metric cards side by side. */
export const DashboardRow: Story = {
  decorators: [
    (Story) => (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <MetricCard
        color="var(--chart-1)"
        data={[320, 450, 410, 530, 490, 600]}
        delta={{ value: 12, label: "vs last month" }}
        icon={MoneyBag01Icon}
        title="Revenue"
        value="$48,295"
      />
      <MetricCard
        color="var(--chart-2)"
        data={[800, 920, 860, 1020, 1100, 1284]}
        delta={{ value: 5.2, label: "vs last week" }}
        icon={UserCircle02Icon}
        title="Active Users"
        value="1,284"
      />
      <MetricCard
        color="var(--chart-3)"
        data={[42, 38, 51, 47, 63, 59]}
        delta={{ value: -2.1, label: "vs yesterday" }}
        icon={Activity01Icon}
        title="Error Rate"
        value="0.42%"
      />
      <MetricCard
        color="var(--chart-4)"
        data={[3.8, 4.1, 3.9, 4.4, 4.2, 4.6]}
        delta={{ value: 0.4, label: "vs last month" }}
        icon={ChartIncreaseIcon}
        title="Conversion"
        value="4.6%"
      />
    </>
  ),
};

/* ------------------------------------------------------------------ */
/* Manual composition                                                  */
/* ------------------------------------------------------------------ */

/** Using sub-parts for a fully custom layout. */
export const ManualComposition: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <MetricCardHeader icon={ChartIncreaseIcon} title="Custom Layout" />
      <div className="flex items-end justify-between">
        <MetricCardValue>$12,340</MetricCardValue>
        <MetricCardDelta label="vs last week" value={9} />
      </div>
      <MetricCardSparkline
        color="var(--chart-2)"
        data={[400, 350, 500, 450, 620, 580, 700]}
      />
    </div>
  ),
};
