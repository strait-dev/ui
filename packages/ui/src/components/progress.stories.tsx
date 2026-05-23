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
  },
  args: {
    value: 40,
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
