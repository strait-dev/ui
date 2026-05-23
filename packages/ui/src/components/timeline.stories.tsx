import {
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Loading03Icon,
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
          "Key props on `Timeline`: `defaultValue` (initial step), `value` (controlled),",
          "`onValueChange`, `orientation` (`vertical` | `horizontal`).",
          "`TimelineItem` requires a `step` number.",
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
    defaultValue: {
      control: "number",
      description: "Initially active step (uncontrolled).",
    },
  },
  args: {
    orientation: "vertical",
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

/** Interactive playground — adjust orientation and defaultValue via controls. */
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

/** Custom indicator icons to communicate step outcomes. */
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
