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
    placeholder: {
      control: "text",
      description: "Placeholder shown when the field is empty.",
    },
    disabled: {
      control: "boolean",
      description: "Disable the country selector and number field.",
    },
    variant: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Height of the field and country button.",
      table: { defaultValue: { summary: "default" } },
    },
    value: {
      control: false,
      description: "Controlled E.164 phone value.",
    },
    onChange: {
      control: false,
      description: "Called with the next E.164 value (or empty string).",
    },
  },
  args: {
    placeholder: "Phone number",
    variant: "default",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function PhoneWrapper({
  placeholder,
  disabled,
  variant,
}: {
  placeholder?: string;
  disabled?: boolean;
  variant?: "sm" | "default" | "lg";
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
        variant={variant}
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
    <PhoneWrapper
      disabled={args.disabled}
      placeholder={args.placeholder}
      variant={args.variant}
    />
  ),
};

/**
 * All three height variants — `sm`, `default`, and `lg`. The country button
 * height tracks the input so the two stay flush.
 */
export const Sizes: Story = {
  render: () => {
    function SizesWrapper() {
      const [sm, setSm] = useState<Value>("" as Value);
      const [md, setMd] = useState<Value>("" as Value);
      const [lg, setLg] = useState<Value>("" as Value);
      return (
        <div className="flex w-72 flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone-sm">Small</Label>
            <PhoneInput
              id="phone-sm"
              onChange={(v) => setSm(v)}
              placeholder="Small"
              value={sm}
              variant="sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone-md">Default</Label>
            <PhoneInput
              id="phone-md"
              onChange={(v) => setMd(v)}
              placeholder="Default"
              value={md}
              variant="default"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone-lg">Large</Label>
            <PhoneInput
              id="phone-lg"
              onChange={(v) => setLg(v)}
              placeholder="Large"
              value={lg}
              variant="lg"
            />
          </div>
        </div>
      );
    }
    return <SizesWrapper />;
  },
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
