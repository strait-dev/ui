import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  GitCommitIcon,
  Loading03Icon,
  Message01Icon,
  RocketIcon,
  Shield01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "./timeline";

const meta: Meta<typeof Timeline> = {
  title: "Data Display/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Stepped progress indicator with vertical and horizontal orientations.",
          "Uses a React context (`Timeline` → `TimelineItem`) to track",
          "the current `activeStep` and mark items as completed.",
          "",
          "Key props on `Timeline`:",
          "- `defaultValue` — initial step (uncontrolled)",
          "- `value` — controlled active step",
          "- `onValueChange` — change callback",
          "- `orientation` — `vertical` (default) | `horizontal`",
          "- `line` — `solid` (default) | `dotted` — connector line style",
          "- `variant` — `primary` (default) | `success` | `info` | `warning` | `destructive`",
          "- `size` — `default` | `sm`",
          "",
          "`TimelineIndicator` accepts an optional `icon` prop (`IconSvgElement`)",
          "to render a Hugeicon centered inside the indicator bubble.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "Layout axis.",
      table: { defaultValue: { summary: "vertical" } },
    },
    line: {
      control: "select",
      options: ["solid", "dotted"],
      description: "Connector line style.",
      table: { defaultValue: { summary: "solid" } },
    },
    variant: {
      control: "select",
      options: ["primary", "success", "info", "warning", "destructive"],
      description: "Colour variant for completed steps.",
      table: { defaultValue: { summary: "primary" } },
    },
    size: {
      control: "select",
      options: ["default", "sm"],
      description: "Size preset.",
      table: { defaultValue: { summary: "default" } },
    },
    defaultValue: {
      control: "number",
      description: "Initially active step (uncontrolled).",
    },
  },
  args: {
    orientation: "vertical",
    line: "solid",
    variant: "primary",
    size: "default",
    defaultValue: 2,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const deploySteps = [
  {
    step: 1,
    title: "Build queued",
    date: "2025-05-20 09:00",
    content: "Build job placed in the CI queue.",
  },
  {
    step: 2,
    title: "Build started",
    date: "2025-05-20 09:01",
    content: "Runner picked up the job and started installing dependencies.",
  },
  {
    step: 3,
    title: "Tests passed",
    date: "2025-05-20 09:04",
    content: "All 148 tests passed (4 skipped).",
  },
  {
    step: 4,
    title: "Deploying",
    date: "2025-05-20 09:05",
    content: "Pushing image to production environment.",
  },
];

/** Interactive playground — adjust all props via controls. */
export const Playground: Story = {
  render: (args) => (
    <Timeline {...args}>
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/* ------------------------------------------------------------------ */
/* Orientation                                                         */
/* ------------------------------------------------------------------ */

/** Vertical layout (default). Steps flow top-to-bottom. */
export const Vertical: Story = {
  render: () => (
    <Timeline defaultValue={3} orientation="vertical">
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/** Horizontal layout. Steps flow left-to-right. */
export const Horizontal: Story = {
  render: () => (
    <Timeline defaultValue={2} orientation="horizontal">
      {deploySteps.map(({ step, title, date }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/* ------------------------------------------------------------------ */
/* Variant axis — solid vs dotted connector                           */
/* ------------------------------------------------------------------ */

/** Solid connector line (default). */
export const SolidConnector: Story = {
  name: "Variant / Solid",
  render: () => (
    <Timeline defaultValue={2} line="solid">
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/**
 * Dotted connector line. Sets `data-line="dotted"` on the root; the
 * separator switches to a `border-dashed` style instead of a filled bar.
 */
export const DottedConnector: Story = {
  name: "Variant / Dotted",
  render: () => (
    <Timeline defaultValue={2} line="dotted">
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/** Dotted connector, horizontal layout. */
export const DottedHorizontal: Story = {
  name: "Variant / Dotted Horizontal",
  render: () => (
    <Timeline defaultValue={2} line="dotted" orientation="horizontal">
      {deploySteps.map(({ step, title, date }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/* ------------------------------------------------------------------ */
/* Intent axis                                                         */
/* ------------------------------------------------------------------ */

/** Primary variant (default). Completed steps use the `primary` token. */
export const IntentPrimary: Story = {
  name: "Intent / Primary",
  render: () => (
    <Timeline defaultValue={3} variant="primary">
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/** Success variant. Completed steps use the `success` semantic token. */
export const IntentSuccess: Story = {
  name: "Intent / Success",
  render: () => (
    <Timeline defaultValue={3} variant="success">
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/** Info variant. Completed steps use the `info` semantic token. */
export const IntentInfo: Story = {
  name: "Intent / Info",
  render: () => (
    <Timeline defaultValue={2} variant="info">
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/** Warning variant. Completed steps use the `warning` semantic token. */
export const IntentWarning: Story = {
  name: "Intent / Warning",
  render: () => (
    <Timeline defaultValue={2} variant="warning">
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/** Destructive variant. Completed steps use the `destructive` semantic token. */
export const IntentDestructive: Story = {
  name: "Intent / Destructive",
  render: () => (
    <Timeline defaultValue={2} variant="destructive">
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/* ------------------------------------------------------------------ */
/* Size axis                                                           */
/* ------------------------------------------------------------------ */

/** Default size (existing proportions). */
export const SizeDefault: Story = {
  name: "Size / Default",
  render: () => (
    <Timeline defaultValue={2} size="default">
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/**
 * Small size. Uses a `size-4` indicator, tighter item gaps, and reduced
 * text via `group-data-[size=sm]/timeline:` selectors.
 */
export const SizeSm: Story = {
  name: "Size / Small",
  render: () => (
    <Timeline defaultValue={2} size="sm">
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/* ------------------------------------------------------------------ */
/* Icon in indicator                                                   */
/* ------------------------------------------------------------------ */

/**
 * Icon rendered inside the indicator bubble via the `icon` prop on
 * `TimelineIndicator`. Indicator automatically becomes a flex-center
 * container. Children (custom content) may also be composed alongside.
 */
export const IconIndicator: Story = {
  name: "Icon / In Indicator",
  render: () => (
    <Timeline defaultValue={3} orientation="vertical">
      <TimelineItem step={1}>
        <TimelineSeparator />
        <TimelineIndicator icon={CheckmarkCircle01Icon} />
        <TimelineHeader>
          <TimelineDate>09:00</TimelineDate>
          <TimelineTitle>Build queued</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Job added to queue.</TimelineContent>
      </TimelineItem>
      <TimelineItem step={2}>
        <TimelineSeparator />
        <TimelineIndicator icon={CheckmarkCircle01Icon} />
        <TimelineHeader>
          <TimelineDate>09:01</TimelineDate>
          <TimelineTitle>Build started</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Runner assigned.</TimelineContent>
      </TimelineItem>
      <TimelineItem step={3}>
        <TimelineSeparator />
        <TimelineIndicator icon={Loading03Icon} />
        <TimelineHeader>
          <TimelineDate>09:04</TimelineDate>
          <TimelineTitle>Running tests…</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Tests are currently running.</TimelineContent>
      </TimelineItem>
      <TimelineItem step={4}>
        <TimelineSeparator />
        <TimelineIndicator />
        <TimelineHeader>
          <TimelineDate>—</TimelineDate>
          <TimelineTitle>Deploy</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Waiting for tests.</TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};

/**
 * Icon + variant composition — success variant with per-step icons communicating
 * step outcomes.
 */
export const IconWithIntent: Story = {
  name: "Icon / With Intent",
  render: () => (
    <Timeline defaultValue={3} orientation="vertical" variant="success">
      <TimelineItem step={1}>
        <TimelineSeparator />
        <TimelineIndicator icon={CheckmarkCircle01Icon} />
        <TimelineHeader>
          <TimelineDate>09:00</TimelineDate>
          <TimelineTitle>Build queued</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Job added to queue.</TimelineContent>
      </TimelineItem>
      <TimelineItem step={2}>
        <TimelineSeparator />
        <TimelineIndicator icon={CheckmarkCircle01Icon} />
        <TimelineHeader>
          <TimelineDate>09:01</TimelineDate>
          <TimelineTitle>Build started</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Runner assigned.</TimelineContent>
      </TimelineItem>
      <TimelineItem step={3}>
        <TimelineSeparator />
        <TimelineIndicator icon={Shield01Icon} />
        <TimelineHeader>
          <TimelineDate>09:04</TimelineDate>
          <TimelineTitle>Tests passed</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>All tests passed.</TimelineContent>
      </TimelineItem>
      <TimelineItem step={4}>
        <TimelineSeparator />
        <TimelineIndicator />
        <TimelineHeader>
          <TimelineDate>—</TimelineDate>
          <TimelineTitle>Deploy</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Awaiting deployment slot.</TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};

/* ------------------------------------------------------------------ */
/* Step states                                                         */
/* ------------------------------------------------------------------ */

/**
 * Completed steps have `data-completed` set by `TimelineItem` automatically
 * (any step whose `step` number ≤ `activeStep`). This story makes all four
 * steps complete.
 */
export const AllCompleted: Story = {
  render: () => (
    <Timeline defaultValue={4} orientation="vertical">
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/** Only the first step completed — rest are pending. */
export const FirstStepOnly: Story = {
  render: () => (
    <Timeline defaultValue={1} orientation="vertical">
      {deploySteps.map(({ step, title, date, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

/* ------------------------------------------------------------------ */
/* Rich content with icons                                             */
/* ------------------------------------------------------------------ */

/** Custom indicator children to communicate step outcomes. */
export const WithIcons: Story = {
  render: () => (
    <Timeline defaultValue={3} orientation="vertical">
      <TimelineItem step={1}>
        <TimelineSeparator />
        <TimelineIndicator>
          <HugeiconsIcon
            className="size-3 text-success"
            icon={CheckmarkCircle01Icon}
          />
        </TimelineIndicator>
        <TimelineHeader>
          <TimelineDate>09:00</TimelineDate>
          <TimelineTitle>Build queued</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Job added to queue.</TimelineContent>
      </TimelineItem>
      <TimelineItem step={2}>
        <TimelineSeparator />
        <TimelineIndicator>
          <HugeiconsIcon
            className="size-3 text-success"
            icon={CheckmarkCircle01Icon}
          />
        </TimelineIndicator>
        <TimelineHeader>
          <TimelineDate>09:01</TimelineDate>
          <TimelineTitle>Build started</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Runner assigned.</TimelineContent>
      </TimelineItem>
      <TimelineItem step={3}>
        <TimelineSeparator />
        <TimelineIndicator>
          <HugeiconsIcon
            className="size-3 animate-spin text-info"
            icon={Loading03Icon}
          />
        </TimelineIndicator>
        <TimelineHeader>
          <TimelineDate>09:04</TimelineDate>
          <TimelineTitle>Running tests…</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Tests are currently running.</TimelineContent>
      </TimelineItem>
      <TimelineItem step={4}>
        <TimelineSeparator />
        <TimelineIndicator />
        <TimelineHeader>
          <TimelineDate>—</TimelineDate>
          <TimelineTitle>Deploy</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Waiting for tests.</TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};

/** An error step using a destructive icon. */
export const WithError: Story = {
  render: () => (
    <Timeline defaultValue={2} orientation="vertical">
      <TimelineItem step={1}>
        <TimelineSeparator />
        <TimelineIndicator>
          <HugeiconsIcon
            className="size-3 text-success"
            icon={CheckmarkCircle01Icon}
          />
        </TimelineIndicator>
        <TimelineHeader>
          <TimelineDate>09:00</TimelineDate>
          <TimelineTitle>Build queued</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Queued successfully.</TimelineContent>
      </TimelineItem>
      <TimelineItem step={2}>
        <TimelineSeparator />
        <TimelineIndicator>
          <HugeiconsIcon
            className="size-3 text-destructive"
            icon={Cancel01Icon}
          />
        </TimelineIndicator>
        <TimelineHeader>
          <TimelineDate>09:02</TimelineDate>
          <TimelineTitle>Build failed</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>
          TypeScript compilation error in src/index.ts line 42.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem step={3}>
        <TimelineSeparator />
        <TimelineIndicator />
        <TimelineHeader>
          <TimelineDate>—</TimelineDate>
          <TimelineTitle>Tests (skipped)</TimelineTitle>
        </TimelineHeader>
        <TimelineContent>Build must pass first.</TimelineContent>
      </TimelineItem>
    </Timeline>
  ),
};

/* ------------------------------------------------------------------ */
/* Showcase compositions                                               */
/* ------------------------------------------------------------------ */

const activitySteps = [
  {
    step: 1,
    icon: GitCommitIcon,
    date: "2 hours ago",
    title: "Pushed 3 commits to main",
    content: "feat: add date selector, fix: lint, docs: changelog.",
  },
  {
    step: 2,
    icon: Message01Icon,
    date: "1 hour ago",
    title: "Commented on PR #482",
    content: "Left review feedback on the new filter API.",
  },
  {
    step: 3,
    icon: UserAdd01Icon,
    date: "40 minutes ago",
    title: "Added Dana to the team",
    content: "Invited a new reviewer to the design-system repo.",
  },
  {
    step: 4,
    icon: RocketIcon,
    date: "Just now",
    title: "Deployed v0.2.0",
    content: "Release rolled out to production.",
  },
];

/**
 * Activity feed — a real-world vertical composition that pairs per-step icons
 * with timestamps and descriptive content, the most common Timeline use.
 */
export const ActivityFeed: Story = {
  render: () => (
    <Timeline defaultValue={4} size="sm" variant="success">
      {activitySteps.map(({ step, icon, date, title, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator icon={icon} />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};

const roadmapSteps = [
  {
    step: 1,
    date: "Q1",
    title: "Foundations",
    content: "Tokens & primitives.",
  },
  { step: 2, date: "Q2", title: "Components", content: "Full library parity." },
  { step: 3, date: "Q3", title: "Theming", content: "Multi-brand support." },
  { step: 4, date: "Q4", title: "1.0", content: "Stable public release." },
];

/**
 * Roadmap — a horizontal, dotted milestone track. Demonstrates combining
 * `orientation="horizontal"` with `line="dotted"` for a planning view.
 */
export const Roadmap: Story = {
  render: () => (
    <Timeline defaultValue={2} line="dotted" orientation="horizontal">
      {roadmapSteps.map(({ step, date, title, content }) => (
        <TimelineItem key={step} step={step}>
          <TimelineSeparator />
          <TimelineIndicator />
          <TimelineHeader>
            <TimelineDate>{date}</TimelineDate>
            <TimelineTitle>{title}</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>{content}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
};
