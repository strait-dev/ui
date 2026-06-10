import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";
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
          "environment variables, API endpoints, tokens, generated commands, and",
          "sensitive values that users need to copy exactly.",
          "",
          "Do use `CopyField` when the value is not editable. Do not use it as a",
          "disabled input replacement; use `Input readOnly` or `Input disabled` when",
          "the control participates in a form. The value surface follows the same",
          "height/radius baseline as form controls and mirrors focus when inner",
          "actions receive keyboard focus.",
          "",
          "Sensitive values are masked by default but still copy the original value.",
          "Use `status` for semantic context such as verified, warning, or invalid",
          "without changing the copied payload.",
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
      description: "Optional visible label above or beside the value.",
    },
    description: {
      control: "text",
      description: "Optional helper text below the value.",
    },
    prefix: {
      control: "text",
      description: "Content rendered before the value inside the control.",
    },
    suffix: {
      control: "text",
      description: "Content rendered after the value and before actions.",
    },
    variant: {
      control: "select",
      options: ["default", "muted", "ghost", "terminal"],
      description: "Surface treatment for the value control.",
      table: { defaultValue: { summary: "default" } },
    },
    status: {
      control: "select",
      options: ["default", "success", "warning", "destructive", "info"],
      description: "Semantic state around the copied value.",
      table: { defaultValue: { summary: "default" } },
    },
    layout: {
      control: "select",
      options: ["stacked", "inline"],
      description: "Label/control arrangement.",
      table: { defaultValue: { summary: "stacked" } },
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg"],
      description: "Height preset matching form controls.",
      table: { defaultValue: { summary: "default" } },
    },
    monospace: {
      control: "boolean",
      description: "Use monospace styling for the value.",
      table: { defaultValue: { summary: "true" } },
    },
    truncate: {
      control: "boolean",
      description: "Truncate the value on one line instead of wrapping.",
      table: { defaultValue: { summary: "true" } },
    },
    sensitive: {
      control: "boolean",
      description: "Mask the value and show a reveal/hide action.",
      table: { defaultValue: { summary: "false" } },
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
    layout: "stacked",
    size: "default",
    status: "default",
    variant: "default",
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
    description: undefined,
    label: undefined,
    value: "https://api.strait.dev/v1/events",
  },
};

/** Sensitive values are masked until revealed but copy the real value. */
export const Sensitive: Story = {
  args: {
    description: "Copying still writes the original secret value.",
    label: "API key",
    sensitive: true,
    status: "warning",
    value: "sk_live_51J8f3a91c2e7Secret",
  },
};

/** Prefix and suffix slots add non-copying context around the value. */
export const WithAffixes: Story = {
  render: (args) => (
    <CopyField
      {...args}
      label="Webhook URL"
      prefix="POST"
      suffix={<Badge variant="success">Live</Badge>}
      value="https://api.strait.dev/v1/webhooks"
    />
  ),
};

/** Non-monospace values are available for prose-like content. */
export const PlainText: Story = {
  args: {
    description: "Set `monospace={false}` for non-technical values.",
    label: "Invite link label",
    monospace: false,
    value: "Team onboarding workspace",
  },
};

/** Inline layout aligns labels beside values in settings panels. */
export const InlineLayout: Story = {
  args: {
    description: undefined,
    label: "Project ID",
    layout: "inline",
    value: "proj_8f3a91c2e7",
  },
  render: (args) => (
    <div className="w-[34rem]">
      <CopyField {...args} />
    </div>
  ),
};

/** Compare all surface variants. */
export const Variants: Story = {
  render: (args) => (
    <div className="grid w-96 gap-4">
      {(["default", "muted", "ghost", "terminal"] as const).map((variant) => (
        <CopyField
          {...args}
          description={undefined}
          key={variant}
          label={`variant="${variant}"`}
          value="NEXT_PUBLIC_API_URL"
          variant={variant}
        />
      ))}
    </div>
  ),
};

/** Semantic statuses communicate value state without changing the payload. */
export const Statuses: Story = {
  render: (args) => (
    <div className="grid w-96 gap-4">
      {(["default", "success", "warning", "destructive", "info"] as const).map(
        (status) => (
          <CopyField
            {...args}
            description={undefined}
            key={status}
            label={`status="${status}"`}
            status={status}
            value="token_8f3a91c2e7"
          />
        )
      )}
    </div>
  ),
};

/** Compare the form-control height presets. */
export const Sizes: Story = {
  render: (args) => (
    <div className="grid w-96 gap-4">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
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
