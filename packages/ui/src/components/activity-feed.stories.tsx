import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActivityFeed, type ActivityItem } from "./activity-feed";

const meta: Meta<typeof ActivityFeed> = {
  title: "Data Display/Activity Feed",
  component: ActivityFeed,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A presentational, scrollable list of timestamped activity entries with",
          "status dots and relative times.",
          "",
          "Status dot colours reuse the same `getStatusConfig` vocabulary as",
          '`StatusBadge` — `"running"`, `"completed"`, `"failed"`, etc. — so the',
          "two components stay visually consistent without forking the colour logic.",
          "",
          "Pass `renderItem` for full row customisation while keeping the",
          "`ScrollArea` viewport and empty-state behaviour.",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    height: {
      control: "text",
      description:
        "Scrollable viewport height (number = px, or any CSS string).",
      table: { defaultValue: { summary: "320" } },
    },
  },
  args: {
    height: 320,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const playgroundItems: ActivityItem[] = [
  {
    id: "1",
    status: "completed",
    title: "Deployment succeeded",
    timestamp: new Date(Date.now() - 1 * 60_000),
    description: "prod-us-east-1 · v2.4.1",
  },
  {
    id: "2",
    status: "running",
    title: "Build in progress",
    timestamp: new Date(Date.now() - 4 * 60_000),
    description: "Branch: feature/dark-mode",
  },
  {
    id: "3",
    status: "failed",
    title: "Database migration failed",
    timestamp: new Date(Date.now() - 12 * 60_000),
    description: "Error: relation does not exist",
  },
  {
    id: "4",
    status: "pending",
    title: "Webhook queued",
    timestamp: new Date(Date.now() - 35 * 60_000),
  },
  {
    id: "5",
    status: "delayed",
    title: "Scheduled job paused",
    timestamp: new Date(Date.now() - 90 * 60_000),
    description: "Retries exhausted — waiting for backoff",
  },
  {
    id: "6",
    title: "Configuration updated",
    timestamp: new Date(Date.now() - 180 * 60_000),
    description: "No status provided — neutral dot",
  },
];

/**
 * Interactive playground — mixed statuses with relative timestamps. Scroll to
 * see all entries when `height` is constrained.
 */
export const Playground: Story = {
  args: {
    items: playgroundItems,
  },
};

/** No items — the default "No activity yet" empty state. */
export const Empty: Story = {
  args: {
    items: [],
  },
};

/** Empty with a custom `emptyState` slot. */
export const CustomEmptyState: Story = {
  args: {
    items: [],
    emptyState: (
      <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
        <span className="rounded-lg bg-muted px-2 py-1 font-medium text-xs">
          No events
        </span>
        <p className="text-sm">Nothing has happened yet.</p>
      </div>
    ),
  },
};

/** `renderItem` escape hatch — fully custom row layout. */
export const CustomRenderItem: Story = {
  args: {
    items: playgroundItems.slice(0, 3),
    renderItem: (item) => (
      <div
        className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
        data-slot="activity-feed-item"
        key={item.id}
      >
        <span className="font-medium">{item.title}</span>
        {item.status === undefined ? null : (
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-muted-foreground text-xs">
            {item.status}
          </span>
        )}
      </div>
    ),
  },
};
