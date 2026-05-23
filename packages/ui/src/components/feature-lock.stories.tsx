import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { FeatureBadge, FeatureLock } from "./feature-lock";

const meta = {
  title: "Feedback/Feature Lock",
  component: FeatureLock,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Gating overlay that blurs locked content and surfaces a centred upsell CTA.",
          "",
          "When `locked={false}` the component is a transparent pass-through — zero",
          "DOM overhead. When `locked={true}` children are visually obscured with a",
          "blur and `pointer-events-none`, and an absolutely-positioned overlay shows",
          "an optional `FeatureBadge`, title, description, and action slot.",
          "",
          "`FeatureBadge` is also exported for standalone use in headers, empty states,",
          "or pricing tables.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    locked: {
      control: "boolean",
      description: "When true, the overlay is shown and content is obscured.",
      table: { defaultValue: { summary: "false" } },
    },
    blur: {
      control: "boolean",
      description: "Apply `blur-sm` to the gated content. Default: true.",
      table: { defaultValue: { summary: "true" } },
    },
    title: {
      control: "text",
      description: "Overlay heading.",
    },
    description: {
      control: "text",
      description: "Overlay body copy.",
    },
    planLabel: {
      control: "text",
      description: "Plan name shown as a FeatureBadge inside the overlay.",
    },
  },
  args: {
    locked: false,
    blur: true,
    children: (
      <div className="rounded-lg border bg-card p-6">
        <p className="font-medium text-sm">Monthly active users</p>
        <p className="mt-1 font-semibold text-3xl tabular-nums">24,812</p>
        <div className="mt-4 h-24 rounded bg-muted" />
      </div>
    ),
  },
} satisfies Meta<typeof FeatureLock>;

export default meta;

type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Playground                                                          */
/* ------------------------------------------------------------------ */

/** Interactive playground — toggle `locked`, adjust `title`, `description`, `planLabel`. */
export const Playground: Story = {
  args: {
    locked: true,
    title: "Upgrade to Pro",
    description:
      "Get access to advanced analytics, unlimited exports, and priority support.",
    planLabel: "Pro",
    action: (
      <Button size="sm" variant="default">
        Upgrade now
      </Button>
    ),
  },
  render: (args) => (
    <FeatureLock {...args}>
      <div className="rounded-lg border bg-card p-6">
        <p className="font-medium text-sm">Monthly active users</p>
        <p className="mt-1 font-semibold text-3xl tabular-nums">24,812</p>
        <div className="mt-4 h-24 rounded bg-muted" />
      </div>
    </FeatureLock>
  ),
};

/* ------------------------------------------------------------------ */
/* Unlocked                                                            */
/* ------------------------------------------------------------------ */

/**
 * Unlocked state — the component is a transparent pass-through with no wrapper
 * element or overlay DOM.
 */
export const Unlocked: Story = {
  args: {
    locked: false,
  },
  render: (args) => (
    <FeatureLock {...args}>
      <div className="rounded-lg border bg-card p-6">
        <p className="font-medium text-sm">Monthly active users</p>
        <p className="mt-1 font-semibold text-3xl tabular-nums">24,812</p>
        <div className="mt-4 flex items-end gap-1">
          {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
            <div
              className="flex-1 rounded-sm bg-primary/20"
              // biome-ignore lint/suspicious/noArrayIndexKey: demo bars have no stable id
              key={i}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>
    </FeatureLock>
  ),
};

/* ------------------------------------------------------------------ */
/* Locked                                                              */
/* ------------------------------------------------------------------ */

/**
 * Locked state with a `planLabel`, title, description, and upgrade button.
 * The card content is blurred and non-interactive; the overlay floats centred
 * above it.
 */
export const Locked: Story = {
  args: {
    locked: true,
    title: "Upgrade to Pro",
    description:
      "Unlock advanced analytics, custom dashboards, and unlimited data exports.",
    planLabel: "Pro",
    action: (
      <Button size="sm" variant="default">
        Upgrade now
      </Button>
    ),
  },
  render: (args) => (
    <FeatureLock {...args}>
      <div className="rounded-lg border bg-card p-6">
        <p className="font-medium text-sm">Monthly active users</p>
        <p className="mt-1 font-semibold text-3xl tabular-nums">24,812</p>
        <div className="mt-4 flex items-end gap-1">
          {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
            <div
              className="flex-1 rounded-sm bg-primary/20"
              // biome-ignore lint/suspicious/noArrayIndexKey: demo bars have no stable id
              key={i}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
      </div>
    </FeatureLock>
  ),
};

/* ------------------------------------------------------------------ */
/* Without blur                                                        */
/* ------------------------------------------------------------------ */

/**
 * Locked with `blur={false}` — content is hidden from interaction via
 * `pointer-events-none` / `aria-hidden` but is not blurred, useful when the
 * gated content is already a skeleton or placeholder.
 */
export const LockedNoBlur: Story = {
  args: {
    locked: true,
    blur: false,
    title: "Upgrade to Pro",
    description: "Enable this feature by upgrading your plan.",
    planLabel: "Pro",
    action: (
      <Button size="sm" variant="outline">
        View plans
      </Button>
    ),
  },
  render: (args) => (
    <FeatureLock {...args}>
      <div className="rounded-lg border bg-card p-6">
        <p className="font-medium text-sm">Cohort analysis</p>
        <div className="mt-4 h-32 rounded bg-muted" />
      </div>
    </FeatureLock>
  ),
};

/* ------------------------------------------------------------------ */
/* FeatureBadge standalone                                             */
/* ------------------------------------------------------------------ */

/**
 * `FeatureBadge` used standalone — show a few plan names in different sizes.
 * Useful in feature comparison tables, pricing pages, or empty-state cards.
 */
export const FeatureBadgeStory: Story = {
  name: "FeatureBadge — Plans",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <FeatureBadge plan="Pro" />
      <FeatureBadge plan="Business" />
      <FeatureBadge plan="Enterprise" />
      <FeatureBadge plan="Pro" size="sm" />
      <FeatureBadge plan="Business" size="lg" />
      <FeatureBadge plan="Enterprise" size="xl" />
    </div>
  ),
};
