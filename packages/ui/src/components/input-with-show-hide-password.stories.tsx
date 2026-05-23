import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputWithShowHidePassword } from "./input-with-show-hide-password";
import { Label } from "./label";

const meta: Meta<typeof InputWithShowHidePassword> = {
  title: "Patterns/Input with Show/Hide Password",
  component: InputWithShowHidePassword,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A password `Input` with a built-in visibility toggle button.",
          "",
          "Composes the `Input` primitive with an absolutely-positioned eye-icon button.",
          "The component manages its own `isVisible` state internally — no external",
          "state wiring is required. The toggle button is fully accessible with",
          "`aria-label` and `aria-pressed`.",
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
      description: "Disable the field and visibility toggle.",
    },
  },
  args: {
    placeholder: "Enter password…",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — click the eye icon to toggle visibility. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="show-hide-playground">Password</Label>
      <InputWithShowHidePassword {...args} id="show-hide-playground" />
    </div>
  ),
};

/** Default hidden state — dots are rendered. */
export const Hidden: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="show-hide-hidden">Password</Label>
      <InputWithShowHidePassword
        {...args}
        defaultValue="mySecretPass123"
        id="show-hide-hidden"
      />
    </div>
  ),
};

/** Invalid state — border turns destructive. */
export const Invalid: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="show-hide-invalid">Password</Label>
      <InputWithShowHidePassword
        {...args}
        aria-invalid
        defaultValue="short"
        id="show-hide-invalid"
      />
      <p className="text-destructive text-sm">
        Password must be at least 8 characters.
      </p>
    </div>
  ),
};

/** Disabled — field and toggle button are non-interactive. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="show-hide-disabled">Password</Label>
      <InputWithShowHidePassword
        {...args}
        defaultValue="readonlypassword"
        disabled
        id="show-hide-disabled"
      />
    </div>
  ),
};
