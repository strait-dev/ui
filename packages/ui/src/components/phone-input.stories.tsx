"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { Value } from "react-phone-number-input";

import { Label } from "./label";
import { PhoneInput } from "./phone-input";

const meta: Meta<typeof PhoneInput> = {
  title: "Patterns/Phone Input",
  component: PhoneInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "An international phone number input with an interactive country selector.",
          "",
          "Composes `react-phone-number-input` (`RPNInput`) with a custom `CountrySelect`",
          "built from `Popover`, `Command`, and `Button` primitives, and a flag rendered",
          "via `react-circle-flags`. The `Input` primitive handles the number part.",
          "",
          "This is a **controlled** component — manage `value` + `onChange` in the parent.",
          "`onChange` receives an E.164-formatted string or an empty string.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    value: { control: false },
    onChange: { control: false },
  },
  args: {
    placeholder: "Phone number",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function PhoneWrapper({
  placeholder,
  disabled,
}: {
  placeholder?: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState<Value>("" as Value);
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="phone-playground">Phone number</Label>
      <PhoneInput
        disabled={disabled}
        id="phone-playground"
        onChange={(v) => setValue(v)}
        placeholder={placeholder ?? "Phone number"}
        value={value}
      />
      {value ? (
        <p className="text-muted-foreground text-xs">E.164: {value}</p>
      ) : null}
    </div>
  );
}

/** Interactive playground — select a country and type a number. */
export const Playground: Story = {
  render: (args) => (
    <PhoneWrapper disabled={args.disabled} placeholder={args.placeholder} />
  ),
};

/** Pre-filled with a US number. */
export const WithValue: Story = {
  render: () => {
    function FilledWrapper() {
      const [value, setValue] = useState<Value>("+14155552671" as Value);
      return (
        <div className="flex w-72 flex-col gap-1.5">
          <Label htmlFor="phone-filled">Phone number</Label>
          <PhoneInput
            id="phone-filled"
            onChange={(v) => setValue(v)}
            placeholder="Phone number"
            value={value}
          />
        </div>
      );
    }
    return <FilledWrapper />;
  },
};

/** Default country set to United Kingdom. */
export const DefaultCountry: Story = {
  render: () => {
    function UKWrapper() {
      const [value, setValue] = useState<Value>("" as Value);
      return (
        <div className="flex w-72 flex-col gap-1.5">
          <Label htmlFor="phone-uk">Phone number</Label>
          <PhoneInput
            defaultCountry="GB"
            id="phone-uk"
            onChange={(v) => setValue(v)}
            placeholder="+44 20 xxxx xxxx"
            value={value}
          />
        </div>
      );
    }
    return <UKWrapper />;
  },
};

/** Disabled — country selector and input are non-interactive. */
export const Disabled: Story = {
  render: () => {
    function DisabledWrapper() {
      const [value] = useState<Value>("+14155552671" as Value);
      return (
        <div className="flex w-72 flex-col gap-1.5">
          <Label htmlFor="phone-disabled">Phone (read-only)</Label>
          <PhoneInput
            disabled
            id="phone-disabled"
            onChange={() => {}}
            placeholder="Phone number"
            value={value}
          />
        </div>
      );
    }
    return <DisabledWrapper />;
  },
};
