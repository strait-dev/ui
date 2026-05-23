import type { Meta, StoryObj } from "@storybook/react-vite";

import { RelativeTimeCard } from "./relative-time-card";

const meta: Meta<typeof RelativeTimeCard> = {
  title: "Data Display/Relative Time Card",
  component: RelativeTimeCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Shows a compact, formatted timestamp that — on hover — reveals a card with",
          "the live relative time and the same instant across one or more timezones",
          "(the viewer's local zone is always appended).",
          "",
          "The relative string in the card auto-refreshes on a configurable interval",
          '(default every second). `timezones` defaults to `["UTC"]`.',
          "",
          "Use `variant` (`default` / `muted` / `ghost`) to style the trigger, and pass",
          "`children` to override the trigger label.",
        ].join("\n"),
      },
    },
  },
  args: {
    date: new Date(Date.now() - 5 * 60_000),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default — the trigger shows the absolute timestamp. Hover to reveal the
 * relative time and the UTC + local timezone rows.
 */
export const Playground: Story = {
  args: {
    date: new Date(Date.now() - 5 * 60_000),
  },
};

/**
 * Trigger variants — `default`, `muted` (dimmer), and `ghost` (underline on
 * hover).
 */
export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <RelativeTimeCard {...args} variant="default" />
      <RelativeTimeCard {...args} variant="muted" />
      <RelativeTimeCard {...args} variant="ghost" />
    </div>
  ),
};

/**
 * Future date — the card's relative string reads "in X minutes".
 */
export const FutureDate: Story = {
  args: {
    date: new Date(Date.now() + 45 * 60_000),
  },
};

/**
 * Multiple timezones — extra rows render in the card, one per IANA zone, plus
 * the viewer's local row.
 */
export const MultiTimezone: Story = {
  args: {
    date: new Date(Date.now() - 3 * 60_000),
    timezones: [
      "America/New_York",
      "Europe/London",
      "Europe/Berlin",
      "Asia/Tokyo",
      "Australia/Sydney",
    ],
  },
};

/**
 * Custom label — the trigger text is overridden; the card content is unchanged.
 */
export const CustomLabel: Story = {
  args: {
    date: new Date(Date.now() - 60_000),
    children: "Edited just now",
  },
};

/**
 * String date input — the component normalises ISO strings and epoch numbers.
 */
export const StringDate: Story = {
  args: {
    date: new Date(Date.now() - 90 * 60_000).toISOString(),
    timezones: ["UTC", "America/Los_Angeles"],
  },
};
