import type { Meta, StoryObj } from "@storybook/react-vite";

import { SecretInput } from "./secret-input";

const meta: Meta<typeof SecretInput> = {
  title: "Forms/Secret Input",
  component: SecretInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A controlled text input for secrets and API keys.",
          "",
          'Renders as `type="password"` by default. The optional **reveal toggle**',
          "lets the user flip to plain text, and the optional **copy button** copies",
          "the value to the clipboard without exposing it on-screen.",
          "",
          "Both trailing actions are ghost `icon-sm` buttons and carry accessible",
          "`aria-label` attributes.",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    value: {
      control: "text",
      description: "The controlled secret value.",
    },
    revealable: {
      control: "boolean",
      description: "Show the eye toggle to reveal/hide the value.",
      table: { defaultValue: { summary: "true" } },
    },
    copyable: {
      control: "boolean",
      description: "Show the copy button.",
      table: { defaultValue: { summary: "true" } },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when the input is empty.",
    },
  },
  args: {
    value: "sk_live_51H8x...",
    revealable: true,
    copyable: true,
    placeholder: "sk_live_…",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — toggle reveal and copy on and off. */
export const Playground: Story = {};

/** Reveal toggle disabled — the value is permanently masked. */
export const NotRevealable: Story = {
  args: {
    revealable: false,
  },
};

/** Copy button disabled — the user must type the secret manually. */
export const NotCopyable: Story = {
  args: {
    copyable: false,
  },
};
