import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Label } from "./label";
import { NumberInputPercentageWithChevrons } from "./number-input-percentage-with-chevrons";

const meta: Meta<typeof NumberInputPercentageWithChevrons> = {
  title: "Patterns/Number Input Percentage with Chevrons",
  component: NumberInputPercentageWithChevrons,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A chevron-stepper specialised for percentage values (0–100).",
          "",
          "Built on `react-aria-components` `NumberField` with `style: 'percent'`",
          "formatting. The component internally scales: externally the value is",
          "0–100 (e.g. 75 = 75%), but it maps to the 0–1 range required by the",
          "ARIA number field. Step size is 0.01 (= 1 percentage point).",
          "",
          "Pass `value` + `onChange` for controlled use, or `defaultValue` (0–100)",
          "for uncontrolled use.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disable the input and chevrons.",
    },
    defaultValue: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Initial percentage value (0–100).",
    },
  },
  args: {
    name: "percentage",
    defaultValue: 0,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — drag the range slider in controls. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="pct-playground">Completion</Label>
      <NumberInputPercentageWithChevrons {...args} name="completion-pg" />
    </div>
  ),
};

/** Default value at 50%. */
export const Default: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="pct-default">Progress</Label>
      <NumberInputPercentageWithChevrons
        {...args}
        defaultValue={50}
        name="progress"
      />
    </div>
  ),
};

/** Controlled — parent manages the 0–100 value. */
export const Controlled: Story = {
  render: (args) => {
    function ControlledWrapper() {
      const [pct, setPct] = useState(25);
      return (
        <div className="flex w-64 flex-col gap-1.5">
          <Label htmlFor="pct-controlled">Discount (controlled)</Label>
          <NumberInputPercentageWithChevrons
            {...args}
            name="discount"
            onChange={(v) => setPct(v)}
            value={pct}
          />
          <p className="text-muted-foreground text-xs">Raw value: {pct}</p>
        </div>
      );
    }
    return <ControlledWrapper />;
  },
};

/** At maximum (100%). */
export const AtMaximum: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="pct-max">Completion</Label>
      <NumberInputPercentageWithChevrons
        {...args}
        defaultValue={100}
        name="full"
      />
    </div>
  ),
};

/** Disabled state. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="pct-disabled">Tax rate (read-only)</Label>
      <NumberInputPercentageWithChevrons
        {...args}
        defaultValue={20}
        disabled
        name="tax"
      />
    </div>
  ),
};
