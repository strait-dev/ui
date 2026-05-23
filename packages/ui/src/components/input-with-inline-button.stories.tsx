import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { InputWithInlineButton } from "./input-with-inline-button";
import { Label } from "./label";

const meta: Meta<typeof InputWithInlineButton> = {
  title: "Patterns/Input with Inline Button",
  component: InputWithInlineButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "An `Input` fused with a `Button` into a single pill-like control.",
          "",
          "Composes the `Input` and `Button` primitives with negative margin and",
          "rounded-corner overrides so they appear as one unit. Use for search bars,",
          "newsletter sign-ups, coupon fields, or any action that is tightly paired",
          "with the text entry.",
          "",
          "Pass `buttonText` for a simple label, `button` for a fully custom element,",
          "and `onButtonClick` to wire up the action.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder shown when the field is empty.",
    },
    buttonText: {
      control: "text",
      description:
        "Label for the inline button (when no custom `button` is supplied).",
    },
    disabled: {
      control: "boolean",
      description: "Disable both the input and the button.",
    },
    buttonType: {
      control: "select",
      options: ["button", "submit", "reset"],
      description:
        "Native button `type` — `submit` inside a form, `button` otherwise.",
    },
  },
  args: {
    placeholder: "Search…",
    buttonText: "Search",
    buttonType: "submit",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust placeholder and button text via controls. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inline-btn-playground">Search</Label>
      <InputWithInlineButton {...args} id="inline-btn-playground" />
    </div>
  ),
};

/** Default usage with a submit button. */
export const Default: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inline-btn-default">Email</Label>
      <InputWithInlineButton
        {...args}
        buttonText="Subscribe"
        id="inline-btn-default"
        placeholder="you@example.com"
        type="email"
      />
    </div>
  ),
};

/** Custom `button` slot — pass any React node for total control. */
export const CustomButtonSlot: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inline-btn-custom">Search</Label>
      <InputWithInlineButton
        {...args}
        button={
          <Button
            aria-label="Search"
            className="rounded-s-none"
            type="submit"
            variant="default"
          >
            <HugeiconsIcon icon={Search01Icon} />
          </Button>
        }
        id="inline-btn-custom"
        placeholder="Search…"
      />
    </div>
  ),
};

/** Coupon code field — a compact "Apply" action alongside short text input. */
export const CouponCode: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inline-btn-coupon">Coupon code</Label>
      <InputWithInlineButton
        {...args}
        buttonText="Apply"
        id="inline-btn-coupon"
        placeholder="SAVE20"
        type="text"
      />
    </div>
  ),
};

/** Disabled — both input and button are non-interactive. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="inline-btn-disabled">Search</Label>
      <InputWithInlineButton
        {...args}
        buttonText="Search"
        disabled
        id="inline-btn-disabled"
        placeholder="Unavailable"
      />
    </div>
  ),
};
