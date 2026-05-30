import type { Meta, StoryObj } from "@storybook/react-vite";

import { Progress, ProgressLabel, ProgressValue } from "./progress";

const meta = {
  title: "Feedback/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A horizontal progress bar built on the Base UI `Progress` primitive.",
          "Pass a numeric `value` between `0` and `100` (or `null` for indeterminate).",
          "Use `size` to control the track height (`xs | sm | default | lg`).",
          "Use `variant` to tint the indicator with a semantic color",
          "(`default | success | warning | info | destructive`).",
          "Compose with `ProgressLabel` and `ProgressValue` for labelled bars.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Current progress value (0–100). `null` = indeterminate.",
      table: { defaultValue: { summary: "0" } },
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "default", "lg"],
      description: "Height of the track rail.",
      table: { defaultValue: { summary: "default" } },
    },
    variant: {
      control: { type: "select" },
      options: ["default", "success", "warning", "info", "destructive"],
      description: "Semantic color of the filled indicator bar.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: {
    value: 40,
    size: "default",
    variant: "default",
  },
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — drag the range control to see the bar move. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-full max-w-sm">
      <Progress aria-label="Download progress" {...args} />
    </div>
  ),
};

/** Fixed values at 0 %, 25 %, 50 %, 75 %, and 100 %. */
export const Values: Story = {
  render: (args) => (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {([0, 25, 50, 75, 100] as const).map((v) => (
        <div className="flex flex-col gap-1.5" key={v}>
          <span className="text-muted-foreground text-xs">{v} %</span>
          <Progress aria-label={`Progress ${v} percent`} {...args} value={v} />
        </div>
      ))}
    </div>
  ),
};

/** With a `ProgressLabel` and `ProgressValue` for a fully-labelled bar. */
export const WithLabel: Story = {
  render: (args) => (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Progress {...args} value={60}>
        <ProgressLabel>Uploading files</ProgressLabel>
        <ProgressValue>{(formatted) => formatted}</ProgressValue>
      </Progress>

      <Progress {...args} value={33}>
        <ProgressLabel>Processing</ProgressLabel>
        <ProgressValue>{(formatted) => formatted}</ProgressValue>
      </Progress>

      <Progress {...args} value={100}>
        <ProgressLabel>Complete</ProgressLabel>
        <ProgressValue>{() => "Done"}</ProgressValue>
      </Progress>
    </div>
  ),
};

/** Indeterminate state — pass `value={null}` when progress is unknown. */
export const Indeterminate: Story = {
  render: (args) => (
    <div className="w-full max-w-sm">
      <Progress {...args} value={null}>
        <ProgressLabel>Loading…</ProgressLabel>
      </Progress>
    </div>
  ),
};

/** All four track heights stacked for visual comparison. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {(["xs", "sm", "default", "lg"] as const).map((s) => (
        <div className="flex flex-col gap-1.5" key={s}>
          <span className="text-muted-foreground text-xs">size="{s}"</span>
          <Progress
            aria-label={`Size ${s} progress`}
            {...args}
            size={s}
            value={60}
          />
        </div>
      ))}
    </div>
  ),
};

/** All five variant colors stacked for visual comparison. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {(["default", "success", "warning", "info", "destructive"] as const).map(
        (i) => (
          <div className="flex flex-col gap-1.5" key={i}>
            <span className="text-muted-foreground text-xs">variant="{i}"</span>
            <Progress
              aria-label={`Variant ${i} progress`}
              {...args}
              value={60}
              variant={i}
            />
          </div>
        )
      )}
    </div>
  ),
};
