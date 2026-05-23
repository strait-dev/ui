import type { Meta, StoryObj } from "@storybook/react-vite";

import { PasswordInput } from "./password-input";

const meta: Meta<typeof PasswordInput> = {
  title: "Patterns/Password Input",
  component: PasswordInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A self-contained password input with an optional built-in label and a",
          "visibility-toggle button.",
          "",
          "Composes the `Input` primitive with an inline `<label>` element and an",
          "eye-icon toggle button. Customise the toggle labels via `showPasswordLabel`",
          "and `hidePasswordLabel` for localisation. Manages its own `isVisible` state.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    showPasswordLabel: { control: "text" },
    hidePasswordLabel: { control: "text" },
  },
  args: {
    label: "Password",
    placeholder: "Enter your password",
    showPasswordLabel: "Show password",
    hidePasswordLabel: "Hide password",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — click the eye to reveal the password. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-72">
      <PasswordInput {...args} id="pw-playground" />
    </div>
  ),
};

/** Default state with pre-filled value. */
export const WithValue: Story = {
  render: (args) => (
    <div className="w-72">
      <PasswordInput
        {...args}
        defaultValue="mySecret123!"
        id="pw-value"
        label="Password"
      />
    </div>
  ),
};

/** Without the built-in label — pass `aria-label` for accessibility. */
export const WithoutLabel: Story = {
  render: (args) => (
    <div className="w-72">
      <PasswordInput
        {...args}
        aria-label="Password"
        id="pw-no-label"
        label={undefined}
        placeholder="Password"
      />
    </div>
  ),
};

/** Invalid state — destructive border styling. */
export const Invalid: Story = {
  render: (args) => (
    <div className="w-72 flex flex-col gap-1.5">
      <PasswordInput {...args} aria-invalid id="pw-invalid" label="Password" />
      <p className="text-destructive text-sm">
        Incorrect password. Please try again.
      </p>
    </div>
  ),
};

/** Disabled — field and toggle are non-interactive. */
export const Disabled: Story = {
  render: (args) => (
    <div className="w-72">
      <PasswordInput
        {...args}
        defaultValue="readonlypassword"
        disabled
        id="pw-disabled"
        label="Password"
      />
    </div>
  ),
};
