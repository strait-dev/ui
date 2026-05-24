import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputWithAddons } from "./input-with-addons";
import { Label } from "./label";

const meta: Meta<typeof InputWithAddons> = {
  title: "Patterns/Input with Addons",
  component: InputWithAddons,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A text input with optional leading and trailing addon slots.",
          "",
          "Composes a native `<input>` with muted addon panels (text or icons) that share",
          "the same border and focus ring as the field. Use `leading` for prefixes like",
          "protocol labels (`https://`) or currency symbols, and `trailing` for suffixes",
          "like domain extensions (`.com`) or units.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    leading: {
      control: false,
      description: "Content rendered in the leading (left) addon.",
    },
    trailing: {
      control: false,
      description: "Content rendered in the trailing (right) addon.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder shown when the field is empty.",
    },
    disabled: {
      control: "boolean",
      description: "Disable the field and dim the addons.",
    },
  },
  args: {
    placeholder: "Type something…",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — toggle disabled or change the placeholder via controls. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="addon-playground">Website</Label>
      <InputWithAddons
        {...args}
        id="addon-playground"
        leading="https://"
        trailing=".com"
      />
    </div>
  ),
};

/** Leading addon only — ideal for protocol or currency prefixes. */
export const LeadingOnly: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="addon-leading">Amount</Label>
      <InputWithAddons
        {...args}
        id="addon-leading"
        leading="$"
        placeholder="0.00"
      />
    </div>
  ),
};

/** Trailing addon only — ideal for units or domain extensions. */
export const TrailingOnly: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="addon-trailing">Domain</Label>
      <InputWithAddons
        {...args}
        id="addon-trailing"
        placeholder="yoursite"
        trailing=".com"
      />
    </div>
  ),
};

/** Both leading and trailing addons together. */
export const BothAddons: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="addon-both">Website</Label>
      <InputWithAddons
        {...args}
        id="addon-both"
        leading="https://"
        placeholder="yoursite"
        trailing=".com"
      />
    </div>
  ),
};

/** Disabled state — field and addons are dimmed and non-interactive. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="addon-disabled">Domain (read-only)</Label>
      <InputWithAddons
        {...args}
        defaultValue="mycompany"
        disabled
        id="addon-disabled"
        leading="https://"
        trailing=".com"
      />
    </div>
  ),
};
