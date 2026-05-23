import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "Forms/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A single-choice selection group built on Base UI `RadioGroup` and `Radio`.",
          "",
          "Use `defaultValue` for uncontrolled or `value` + `onValueChange` for",
          "controlled. Each `RadioGroupItem` needs a unique `value` prop and should",
          "be labelled via an associated `<Label>` element.",
          "",
          "`disabled` on the root disables all items; `disabled` on an item",
          "disables only that option.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables all items in the group.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "default", "lg"],
      description: "Scales the radio circle and inter-item spacing.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: {
    defaultValue: "email",
    disabled: false,
    size: "default",
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="pg-email" value="email" />
        <Label htmlFor="pg-email">Email</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="pg-sms" value="sms" />
        <Label htmlFor="pg-sms">SMS</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="pg-push" value="push" />
        <Label htmlFor="pg-push">Push notification</Label>
      </div>
    </RadioGroup>
  ),
};

/* ------------------------------------------------------------------ */
/* Sizes                                                               */
/* ------------------------------------------------------------------ */

/** `sm`, `default`, and `lg` sizes. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size}>
          <p className="mb-2 font-medium text-muted-foreground text-xs capitalize">
            {size}
          </p>
          <RadioGroup defaultValue="email" size={size}>
            <div className="flex items-center gap-2">
              <RadioGroupItem id={`sz-${size}-email`} value="email" />
              <Label htmlFor={`sz-${size}-email`}>Email</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id={`sz-${size}-sms`} value="sms" />
              <Label htmlFor={`sz-${size}-sms`}>SMS</Label>
            </div>
          </RadioGroup>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

/** All item states in one view. */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-2 font-medium text-muted-foreground text-xs">
          Default
        </p>
        <RadioGroup defaultValue="a">
          <div className="flex items-center gap-2">
            <RadioGroupItem id="state-a" value="a" />
            <Label htmlFor="state-a">Option A (checked)</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="state-b" value="b" />
            <Label htmlFor="state-b">Option B</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <p className="mb-2 font-medium text-muted-foreground text-xs">
          Disabled group
        </p>
        <RadioGroup defaultValue="x" disabled>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="dis-x" value="x" />
            <Label htmlFor="dis-x">Checked disabled</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="dis-y" value="y" />
            <Label htmlFor="dis-y">Unchecked disabled</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <p className="mb-2 font-medium text-muted-foreground text-xs">
          Single disabled item
        </p>
        <RadioGroup defaultValue="opt1">
          <div className="flex items-center gap-2">
            <RadioGroupItem id="opt1" value="opt1" />
            <Label htmlFor="opt1">Available</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem disabled id="opt2" value="opt2" />
            <Label htmlFor="opt2">Unavailable</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Controlled                                                          */
/* ------------------------------------------------------------------ */

function ControlledRadioGroup() {
  const [value, setValue] = useState("monthly");

  const plans = [
    { value: "monthly", label: "Monthly", price: "$12/mo" },
    { value: "yearly", label: "Yearly", price: "$99/yr" },
    { value: "lifetime", label: "Lifetime", price: "$299 once" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <RadioGroup onValueChange={setValue} value={value}>
        {plans.map((plan) => (
          <div className="flex items-center gap-2" key={plan.value}>
            <RadioGroupItem id={`plan-${plan.value}`} value={plan.value} />
            <Label htmlFor={`plan-${plan.value}`}>
              {plan.label}
              <span className="ml-1 text-muted-foreground text-xs">
                ({plan.price})
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
      <p className="text-muted-foreground text-sm">
        Selected: <code>{value}</code>
      </p>
    </div>
  );
}

/** Controlled radio group — pricing plan selector. */
export const Controlled: Story = {
  render: () => <ControlledRadioGroup />,
};

/* ------------------------------------------------------------------ */
/* Horizontal layout                                                   */
/* ------------------------------------------------------------------ */

/** Items arranged in a row. */
export const Horizontal: Story = {
  render: () => (
    <RadioGroup className="flex flex-row gap-4" defaultValue="yes">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="h-yes" value="yes" />
        <Label htmlFor="h-yes">Yes</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="h-no" value="no" />
        <Label htmlFor="h-no">No</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="h-maybe" value="maybe" />
        <Label htmlFor="h-maybe">Maybe</Label>
      </div>
    </RadioGroup>
  ),
};

/* ------------------------------------------------------------------ */
/* With descriptions                                                   */
/* ------------------------------------------------------------------ */

/** Each option has a short description below its label. */
export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup className="w-72" defaultValue="standard">
      {[
        {
          value: "standard",
          label: "Standard",
          desc: "Delivered in 5–7 business days.",
        },
        {
          value: "express",
          label: "Express",
          desc: "Delivered in 2–3 business days.",
        },
        {
          value: "overnight",
          label: "Overnight",
          desc: "Next business day delivery.",
        },
      ].map((opt) => (
        <div className="flex gap-2" key={opt.value}>
          <RadioGroupItem
            className="mt-0.5"
            id={`ship-${opt.value}`}
            value={opt.value}
          />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor={`ship-${opt.value}`}>{opt.label}</Label>
            <p className="text-muted-foreground text-sm">{opt.desc}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  ),
};
