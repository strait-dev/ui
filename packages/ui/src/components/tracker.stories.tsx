import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tracker, type TrackerBlockProps } from "./tracker";

function dayStatus(index: number): { color: string; label: string } {
  if (index % 13 === 0) {
    return { color: "bg-destructive", label: "Outage" };
  }
  if (index % 7 === 0) {
    return { color: "bg-warning", label: "Degraded" };
  }
  return { color: "bg-success", label: "Operational" };
}

const uptime: TrackerBlockProps[] = Array.from({ length: 40 }, (_, i) => {
  const { color, label } = dayStatus(i);
  return { color, tooltip: `Day ${i + 1}: ${label}` };
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
          { color: "bg-success", tooltip: "Operational" },
          { color: "bg-success", tooltip: "Operational" },
          { color: "bg-warning", tooltip: "Degraded performance" },
          { color: "bg-success", tooltip: "Operational" },
          { color: "bg-destructive", tooltip: "Major outage" },
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
          color: "bg-success",
          tooltip: "Operational",
        }))}
      />
    </div>
  ),
};
