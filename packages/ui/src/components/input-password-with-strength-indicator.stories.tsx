import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputPasswordWithStrengthIndicator } from "./input-password-with-strength-indicator";

const meta: Meta<typeof InputPasswordWithStrengthIndicator> = {
  title: "Patterns/Input Password with Strength Indicator",
  component: InputPasswordWithStrengthIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A password input with a real-time strength progress bar and requirement checklist.",
          "",
          "Composes the `Input` and `Label` primitives with internal strength-scoring logic.",
          "The indicator appears once the user first focuses the field and starts typing.",
          "Strength is scored 0–4 based on length, digits, lowercase, and uppercase rules.",
          "",
          "Pass `showStrengthIndicator={false}` to render just the password field without",
          "the strength UI. The `error` prop forces a destructive border.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    showStrengthIndicator: { control: "boolean" },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Password",
    placeholder: "Create a password",
    showStrengthIndicator: true,
    error: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — type a password to see the strength indicator animate. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-72">
      <InputPasswordWithStrengthIndicator {...args} id="strength-playground" />
    </div>
  ),
};

/** Default — strength indicator hidden until the user starts typing. */
export const Default: Story = {
  render: (args) => (
    <div className="w-72">
      <InputPasswordWithStrengthIndicator
        {...args}
        id="strength-default"
        label="Choose a password"
        placeholder="At least 8 characters"
      />
    </div>
  ),
};

/** Without the strength indicator — just a labelled password toggle. */
export const WithoutIndicator: Story = {
  render: (args) => (
    <div className="w-72">
      <InputPasswordWithStrengthIndicator
        {...args}
        id="strength-no-indicator"
        label="Password"
        placeholder="Enter your password"
        showStrengthIndicator={false}
      />
    </div>
  ),
};

/** Error state — forced destructive border (e.g. on form submit failure). */
export const WithError: Story = {
  render: (args) => (
    <div className="w-72 flex flex-col gap-1.5">
      <InputPasswordWithStrengthIndicator
        {...args}
        error
        id="strength-error"
        label="Password"
        placeholder="Enter your password"
        showStrengthIndicator={false}
      />
      <p className="text-destructive text-sm">Password is required.</p>
    </div>
  ),
};

/** Disabled state. */
export const Disabled: Story = {
  render: (args) => (
    <div className="w-72">
      <InputPasswordWithStrengthIndicator
        {...args}
        disabled
        id="strength-disabled"
        label="Password"
        placeholder="Disabled"
        showStrengthIndicator={false}
      />
    </div>
  ),
};
