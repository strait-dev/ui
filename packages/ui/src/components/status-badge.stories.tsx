import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusBadge } from "./status-badge";

const meta: Meta<typeof StatusBadge> = {
  title: "Data Display/Status Badge",
  component: StatusBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A **Badge** that maps an orchestration status keyword to a",
          "consistent colour, a leading status dot, and a humanised label.",
          "The status → colour mapping lives in the exported `STATUS_CONFIG`;",
          "live states animate the dot with a subtle pulse.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    status: {
      control: "text",
      description: "Status keyword, e.g. running, failed, timed_out.",
    },
    showDot: {
      control: "boolean",
      description: "Show the leading coloured dot.",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl"],
      description: "Badge size.",
    },
  },
  args: {
    status: "running",
    showDot: true,
  },
};

export default meta;

type Story = StoryObj<typeof StatusBadge>;

/** Interactive playground — type any status into the controls. */
export const Playground: Story = {};

const ALL_STATUSES = [
  "queued",
  "running",
  "completed",
  "failed",
  "timed_out",
  "delayed",
  "paused",
  "canceled",
  "dead_letter",
  "skipped",
];

/** Every status keyword the design system ships with out of the box. */
export const AllStatuses: Story = {
  render: () => (
    <div className="flex max-w-md flex-wrap gap-2">
      {ALL_STATUSES.map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  ),
};

/** Without the leading dot, for dense tables. */
export const WithoutDot: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {["running", "completed", "failed", "queued"].map((status) => (
        <StatusBadge key={status} showDot={false} status={status} />
      ))}
    </div>
  ),
};

/** The badge size axis cascades to the dot. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <StatusBadge size="xs" status="running" />
      <StatusBadge size="sm" status="running" />
      <StatusBadge size="default" status="running" />
      <StatusBadge size="lg" status="running" />
      <StatusBadge size="xl" status="running" />
    </div>
  ),
};

/** Unknown statuses degrade to a neutral grey pill rather than throwing. */
export const UnknownStatus: Story = {
  args: { status: "throttled" },
};
