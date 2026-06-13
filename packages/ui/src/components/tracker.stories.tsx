import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Tracker, type TrackerBlockProps } from "./tracker";

function dayStatus(index: number): {
  status: TrackerBlockProps["status"];
  label: string;
} {
  if (index % 13 === 0) {
    return { status: "destructive", label: "Outage" };
  }
  if (index % 7 === 0) {
    return { status: "warning", label: "Degraded" };
  }
  return { status: "success", label: "Operational" };
}

const uptime: TrackerBlockProps[] = Array.from({ length: 40 }, (_, i) => {
  const { status, label } = dayStatus(i);
  return { status, tooltip: `Day ${i + 1}: ${label}` };
});

const meta: Meta<typeof Tracker> = {
  title: "Data Display/Tracker",
  component: Tracker,
  tags: ["autodocs"],
  args: { data: uptime },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A compact status strip — a row of small colored blocks, each with an",
          "optional hover tooltip. Ideal for uptime history, build status, or any",
          "per-period status bar. Colors are Tailwind background classes so the",
          "strip stays on-palette in light and dark.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <Tracker {...args} />
    </div>
  ),
  play: ({ canvasElement }) => {
    expect(
      canvasElement.querySelectorAll('[data-slot="tracker-block"]').length
    ).toBe(40);
  },
};

export const Uptime: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <Tracker {...args} />
    </div>
  ),
};

export const WithoutTooltips: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <Tracker {...args} disabledTooltip />
    </div>
  ),
};

export const FewBlocks: Story = {
  render: () => (
    <div className="max-w-md">
      <Tracker
        data={[
          { status: "success", tooltip: "Operational" },
          { status: "success", tooltip: "Operational" },
          { status: "warning", tooltip: "Degraded performance" },
          { status: "success", tooltip: "Operational" },
          { status: "destructive", tooltip: "Major outage" },
        ]}
      />
    </div>
  ),
};

export const AllOperational: Story = {
  render: () => (
    <div className="max-w-2xl">
      <Tracker
        data={Array.from({ length: 30 }, () => ({
          status: "success",
          tooltip: "Operational",
        }))}
      />
    </div>
  ),
};
