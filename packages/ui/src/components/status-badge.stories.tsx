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
          "",
          "New props: `pulse` (animate-ping ring for live states), `dotOnly`",
          "(icon-only with `aria-label` for dense UIs). The dot size now scales",
          "automatically with the badge `size` prop.",
          "",
          "New status keywords: `retrying`, `scheduled`, `blocked`, `draft`,",
          "`archived`, `disabled`, `unknown`, `partial`, `partial_success`.",
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
    pulse: {
      control: "boolean",
      description: "Render an animate-ping ring behind the dot.",
    },
    dotOnly: {
      control: "boolean",
      description:
        "Show only the dot (no text label). Adds aria-label for a11y.",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl"],
      description: "Badge size — the dot scales accordingly.",
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

const EXTENDED_STATUSES = [
  "retrying",
  "scheduled",
  "blocked",
  "draft",
  "archived",
  "disabled",
  "unknown",
  "partial",
  "partial_success",
];

/** Newly added status keywords. */
export const ExtendedStatuses: Story = {
  render: () => (
    <div className="flex max-w-md flex-wrap gap-2">
      {EXTENDED_STATUSES.map((status) => (
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

/* ------------------------------------------------------------------ */
/* Pulse                                                               */
/* ------------------------------------------------------------------ */

/**
 * `pulse=true` adds an `animate-ping` ring behind the dot for a "live"
 * affordance — use it for truly real-time statuses like `running` or `active`.
 */
export const WithPulse: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge pulse status="running" />
      <StatusBadge pulse status="executing" />
      <StatusBadge pulse status="active" />
      <StatusBadge pulse status="retrying" />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Dot only                                                            */
/* ------------------------------------------------------------------ */

/**
 * `dotOnly=true` renders only the coloured dot — the text label is hidden and
 * `aria-label` is auto-set from the humanised status so screen readers still
 * announce the state.  Ideal for very dense table cells or icon columns.
 */
export const DotOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {["running", "completed", "failed", "queued", "delayed", "retrying"].map(
        (status) => (
          <StatusBadge dotOnly key={status} size="lg" status={status} />
        )
      )}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Dot only + Pulse                                                    */
/* ------------------------------------------------------------------ */

/** Combination of `dotOnly` and `pulse` — the live indicator in its most minimal form. */
export const DotOnlyWithPulse: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <StatusBadge dotOnly pulse size="default" status="running" />
      <StatusBadge dotOnly pulse size="lg" status="executing" />
      <StatusBadge dotOnly pulse size="xl" status="active" />
    </div>
  ),
};
