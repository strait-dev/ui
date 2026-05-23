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
          "An inline trigger that shows a live relative timestamp ('3 minutes ago') and,",
          "on hover, reveals a floating card with the full absolute time plus optional",
          "per-timezone rows.",
          "",
          "The relative string auto-refreshes on a configurable interval (default 60 s).",
          "Supply `timezones` with IANA timezone identifiers to add secondary rows;",
          "invalid identifiers are silently skipped.",
          "",
          "Pass `children` to customise the trigger label while keeping the card content.",
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
 * Interactive playground — a past date with the default 60-second refresh.
 * Hover over the underlined text to see the absolute time card.
 */
export const Playground: Story = {
  args: {
    date: new Date(Date.now() - 5 * 60_000),
  },
};

/**
 * Future date — the trigger shows an "in X minutes" prefix instead of "ago".
 */
export const FutureDate: Story = {
  args: {
    date: new Date(Date.now() + 45 * 60_000),
  },
};

/**
 * Multi-timezone — additional rows in the hover card show the time in several
 * IANA time zones. Hover to see them.
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
 * Custom children — the trigger label is overridden; the hover card still shows
 * the absolute time.
 */
export const CustomLabel: Story = {
  args: {
    date: new Date(Date.now() - 60_000),
    children: "just now",
  },
};

/**
 * String date input — demonstrates that the component accepts ISO string dates.
 */
export const StringDate: Story = {
  args: {
    date: new Date(Date.now() - 90 * 60_000).toISOString(),
    timezones: ["UTC", "America/Los_Angeles"],
  },
};
