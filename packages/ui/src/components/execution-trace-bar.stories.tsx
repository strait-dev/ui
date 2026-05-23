import type { Meta, StoryObj } from "@storybook/react-vite";

import { ExecutionTraceBar } from "./execution-trace-bar";

const meta: Meta<typeof ExecutionTraceBar> = {
  title: "Data Display/Execution Trace Bar",
  component: ExecutionTraceBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A horizontal stacked proportional bar that visualises time or value",
          "breakdown across labelled segments.",
          "",
          "Each segment shows a tooltip on hover with its label, formatted value,",
          "and share percentage. An optional legend maps swatches to labels below",
          "the bar. Colors default to the `var(--chart-1)`…`var(--chart-5)` token",
          "cycle and can be overridden per-segment.",
          "",
          "Segments whose share is below **0.5 %** of the total are omitted from",
          "the bar but still appear in the legend.",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    showLegend: {
      control: "boolean",
      description: "Toggle the segment legend below the bar.",
      table: { defaultValue: { summary: "true" } },
    },
  },
  args: {
    segments: [
      { label: "Alpha", value: 40 },
      { label: "Beta", value: 35 },
      { label: "Gamma", value: 25 },
    ],
    showLegend: true,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust segments and toggle the legend. */
export const Playground: Story = {};

/** Realistic execution phase breakdown with millisecond formatting. */
export const ExecutionPhases: Story = {
  args: {
    formatValue: (n) => `${n}ms`,
    segments: [
      { label: "Queue wait", value: 18 },
      { label: "Execution", value: 412 },
      { label: "Serialization", value: 34 },
      { label: "Network", value: 56 },
    ],
  },
};

/** Each segment uses an explicit `color` override instead of the chart token cycle. */
export const CustomColors: Story = {
  args: {
    segments: [
      { label: "Cold start", value: 60, color: "#6366f1" },
      { label: "DB query", value: 200, color: "#f59e0b" },
      { label: "Render", value: 90, color: "#10b981" },
      { label: "Transfer", value: 50, color: "#ef4444" },
    ],
    formatValue: (n) => `${n}ms`,
  },
};

/** Legend hidden — bar only. */
export const WithoutLegend: Story = {
  args: {
    showLegend: false,
    segments: [
      { label: "Queue wait", value: 18 },
      { label: "Execution", value: 412 },
      { label: "Serialization", value: 34 },
      { label: "Network", value: 56 },
    ],
    formatValue: (n) => `${n}ms`,
  },
};
