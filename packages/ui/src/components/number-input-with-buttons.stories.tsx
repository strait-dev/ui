import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Label } from "./label";
import { NumberInputWithButtons } from "./number-input-with-buttons";

const meta: Meta<typeof NumberInputWithButtons> = {
  title: "Patterns/Number Input with Buttons",
  component: NumberInputWithButtons,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A numeric stepper with − and + buttons flanking the input.",
          "",
          "Built on `react-aria-components` `NumberField` / `Group` / `Button` / `Input`",
          "primitives. Provides keyboard, mouse, and touch increment/decrement with",
          "configurable `min`, `max`, and `step`. Pass `name` (required), `value` +",
          "`onChange` for controlled use, or `defaultValue` for uncontrolled use.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    defaultValue: { control: "number" },
  },
  args: {
    name: "quantity",
    defaultValue: 1,
    min: 0,
    max: 100,
    step: 1,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust min, max, step, and disabled via controls. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="nb-playground">Quantity</Label>
      <NumberInputWithButtons {...args} name="quantity-pg" />
    </div>
  ),
};

/** Default uncontrolled usage. */
export const Default: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="nb-default">Items</Label>
      <NumberInputWithButtons {...args} defaultValue={3} name="items" />
    </div>
  ),
};

/** Controlled — value is managed externally. */
export const Controlled: Story = {
  render: (args) => {
    function ControlledWrapper() {
      const [val, setVal] = useState(5);
      return (
        <div className="flex w-64 flex-col gap-1.5">
          <Label htmlFor="nb-controlled">Seats (controlled)</Label>
          <NumberInputWithButtons
            {...args}
            max={20}
            min={1}
            name="seats"
            onChange={(v) => setVal(v)}
            value={val}
          />
          <p className="text-muted-foreground text-xs">Current value: {val}</p>
        </div>
      );
    }
    return <ControlledWrapper />;
  },
};

/** With explicit bounds — buttons disable at boundaries. */
export const WithBounds: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="nb-bounds">Rating (1–5)</Label>
      <NumberInputWithButtons
        {...args}
        defaultValue={1}
        max={5}
        min={1}
        name="rating"
      />
    </div>
  ),
};

/** Disabled — all controls are non-interactive. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="nb-disabled">Stock (read-only)</Label>
      <NumberInputWithButtons
        {...args}
        defaultValue={42}
        disabled
        name="stock"
      />
    </div>
  ),
};
