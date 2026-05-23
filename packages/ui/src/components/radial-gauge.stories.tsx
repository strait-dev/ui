import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadialGauge } from "./radial-gauge";

const meta: Meta<typeof RadialGauge> = {
  title: "Data Display/Radial Gauge",
  component: RadialGauge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Circular radial-bar gauge that fills proportionally to a `value / max` ratio.",
          "",
          "The fill color is resolved automatically from configurable `thresholds`",
          "(warning at 70 %, danger at 90 %) unless an explicit `color` override is",
          "supplied. A center overlay shows the numeric percentage and an optional",
          "descriptive `label` beneath it.",
          "",
          "Built on Recharts `RadialBarChart` — place the component inside any",
          "fixed-size container.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Current value.",
    },
    max: {
      control: { type: "number" },
      description: "Maximum value. Defaults to 100.",
      table: { defaultValue: { summary: "100" } },
    },
    label: {
      control: "text",
      description: "Descriptive label below the center percentage.",
    },
    centerLabel: {
      control: "text",
      description: "Override text rendered in the center (default: N%).",
    },
    color: {
      control: "text",
      description: "Explicit fill color; overrides threshold-based color.",
    },
  },
  args: {
    value: 65,
    max: 100,
    label: "Usage",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust value, label, and color. */
export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className="size-40">
        <Story />
      </div>
    ),
  ],
};

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

/** All three automatic color states: normal, warning, and danger. */
export const ColorStates: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="size-36">
          <RadialGauge label="Normal" value={45} />
        </div>
        <span className="text-muted-foreground text-xs">45 % — normal</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="size-36">
          <RadialGauge label="Warning" value={78} />
        </div>
        <span className="text-muted-foreground text-xs">78 % — warning</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="size-36">
          <RadialGauge label="Danger" value={95} />
        </div>
        <span className="text-muted-foreground text-xs">95 % — danger</span>
      </div>
    </div>
  ),
};

/** Gauge with an explicit color override — ignores thresholds. */
export const CustomColor: Story = {
  render: () => (
    <div className="size-40">
      <RadialGauge color="var(--chart-4)" label="Completion" value={82} />
    </div>
  ),
};

/** Gauge using a non-100 maximum value. */
export const CustomMax: Story = {
  render: () => (
    <div className="size-40">
      <RadialGauge label="Requests/s" max={200} value={140} />
    </div>
  ),
};

/** Gauge with a fully custom center label. */
export const CustomCenterLabel: Story = {
  render: () => (
    <div className="size-40">
      <RadialGauge
        centerLabel={<span className="font-bold text-base">8.4</span>}
        label="Score"
        value={84}
      />
    </div>
  ),
};

/** Multiple gauges in a row — dashboard-style. */
export const Dashboard: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      {(
        [
          { label: "CPU", value: 62 },
          { label: "Memory", value: 81 },
          { label: "Disk", value: 94 },
          { label: "Network", value: 38 },
        ] as { label: string; value: number }[]
      ).map(({ label, value }) => (
        <div className="flex flex-col items-center gap-1" key={label}>
          <div className="size-28">
            <RadialGauge label={label} value={value} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Gauge with tighter custom thresholds. */
export const CustomThresholds: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="size-36">
          <RadialGauge
            label="Low threshold"
            thresholds={{ warning: 30, danger: 50 }}
            value={45}
          />
        </div>
        <span className="text-muted-foreground text-xs">warning ≥ 30 %</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="size-36">
          <RadialGauge
            label="High threshold"
            thresholds={{ warning: 80, danger: 95 }}
            value={85}
          />
        </div>
        <span className="text-muted-foreground text-xs">warning ≥ 80 %</span>
      </div>
    </div>
  ),
};
