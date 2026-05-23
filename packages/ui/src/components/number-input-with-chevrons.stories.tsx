import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Label } from "./label";
import { NumberInputWithChevrons } from "./number-input-with-chevrons";

const meta: Meta<typeof NumberInputWithChevrons> = {
  title: "Patterns/Number Input with Chevrons",
  component: NumberInputWithChevrons,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A numeric stepper with stacked ▲ / ▼ chevron buttons on the trailing edge.",
          "",
          "Built on `react-aria-components` `NumberField` / `Group` / `Button` / `Input`.",
          "The compact chevron layout is suited to table cells or dense form rows where",
          "space is limited. Supports `min`, `max`, `step`, and optional `formatOptions`",
          "for locale-aware formatting (e.g. currency, units).",
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
    name: "amount",
    defaultValue: 10,
    step: 1,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust min, max, and step via controls. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="chev-playground">Amount</Label>
      <NumberInputWithChevrons {...args} name="amount-pg" />
    </div>
  ),
};

/** Default uncontrolled usage. */
export const Default: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="chev-default">Quantity</Label>
      <NumberInputWithChevrons {...args} defaultValue={1} name="qty" />
    </div>
  ),
};

/** Controlled — parent manages the value. */
export const Controlled: Story = {
  render: (args) => {
    function ControlledWrapper() {
      const [val, setVal] = useState(0);
      return (
        <div className="flex w-64 flex-col gap-1.5">
          <Label htmlFor="chev-controlled">Temperature (controlled)</Label>
          <NumberInputWithChevrons
            {...args}
            max={100}
            min={-100}
            name="temperature"
            onChange={(v) => setVal(v)}
            step={0.5}
            value={val}
          />
          <p className="text-muted-foreground text-xs">Value: {val}</p>
        </div>
      );
    }
    return <ControlledWrapper />;
  },
};

/** With currency formatting via `formatOptions`. */
export const CurrencyFormatted: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="chev-currency">Price</Label>
      <NumberInputWithChevrons
        {...args}
        defaultValue={9.99}
        formatOptions={{ style: "currency", currency: "USD" }}
        min={0}
        name="price"
        step={0.01}
      />
    </div>
  ),
};

/** Disabled state. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="chev-disabled">Count (read-only)</Label>
      <NumberInputWithChevrons
        {...args}
        defaultValue={7}
        disabled
        name="count"
      />
    </div>
  ),
};
