import type { Meta, StoryObj } from "@storybook/react-vite";

import { CopyField } from "./copy-field";

const meta: Meta<typeof CopyField> = {
  title: "Forms/Copy Field",
  component: CopyField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Read-only value field with built-in copy action. Use it for IDs,",
          "environment variables, API endpoints, tokens, and generated commands",
          "that users need to copy exactly.",
          "",
          "Do use `CopyField` when the value is not editable. Do not use it as a",
          "disabled input replacement; use `Input readOnly` or `Input disabled` when",
          "the control participates in a form. The value surface follows the same",
          "height/radius baseline as form controls and mirrors focus when the copy",
          "button receives keyboard focus.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description: "String displayed and copied by the button.",
    },
    label: {
      control: "text",
      description: "Optional visible label above the value.",
    },
    description: {
      control: "text",
      description: "Optional helper text below the value.",
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Height preset matching form controls.",
      table: { defaultValue: { summary: "default" } },
    },
    monospace: {
      control: "boolean",
      description: "Use monospace styling for the value.",
      table: { defaultValue: { summary: "true" } },
    },
    copyable: {
      control: "boolean",
      description: "Show the clipboard copy button.",
      table: { defaultValue: { summary: "true" } },
    },
  },
  args: {
    label: "Environment variable",
    value: "NEXT_PUBLIC_API_URL",
    description: "Copy this name into your deployment provider.",
    monospace: true,
    copyable: true,
    size: "default",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust label, helper text, and value. */
export const Playground: Story = {};

/** Copyable IDs are the most common use case. */
export const Identifier: Story = {
  args: {
    label: "Run ID",
    value: "run_8f3a91c2e7",
    description: "Use this when contacting support.",
  },
};

/** Hide the label when surrounding prose already names the value. */
export const InlineValue: Story = {
  args: {
    label: undefined,
    value: "https://api.strait.dev/v1/events",
    description: undefined,
  },
};

/** Non-monospace values are available for prose-like content. */
export const PlainText: Story = {
  args: {
    label: "Invite link label",
    value: "Team onboarding workspace",
    description: "Set `monospace={false}` for non-technical values.",
    monospace: false,
  },
};

/** Compare the form-control height presets. */
export const Sizes: Story = {
  render: (args) => (
    <div className="grid w-96 gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <CopyField
          {...args}
          description={undefined}
          key={size}
          label={`size="${size}"`}
          size={size}
        />
      ))}
    </div>
  ),
};
