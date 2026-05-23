import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";
import { Switch } from "./switch";

const meta = {
  title: "Forms/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A styled `<label>` element. Renders inline with `gap-2` so icons or",
          "badge elements can sit alongside the text.",
          "",
          "When placed next to a disabled `peer` element, it automatically dims",
          "via the `peer-disabled` class. Use `htmlFor` to associate it with an",
          "input by matching `id`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    children: {
      control: "text",
      description: "Label text / content.",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "default", "lg"],
      description: "Text size of the label.",
      table: { defaultValue: { summary: "default" } },
    },
    required: {
      control: "boolean",
      description:
        "When true, appends an aria-hidden red asterisk after the label text.",
      table: { defaultValue: { summary: "false" } },
    },
  },
  args: {
    children: "Email address",
    size: "default",
    required: false,
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground. */
export const Playground: Story = {};

/* ------------------------------------------------------------------ */
/* Sizes                                                               */
/* ------------------------------------------------------------------ */

/** `sm`, `default`, and `lg` text sizes. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Label size="sm">Small label (text-xs)</Label>
      <Label size="default">Default label (text-sm)</Label>
      <Label size="lg">Large label (text-base)</Label>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Compositions                                                        */
/* ------------------------------------------------------------------ */

/** Label paired with a text input via `htmlFor`. */
export const WithInput: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label {...args} htmlFor="label-input">
        Email address
      </Label>
      <Input id="label-input" placeholder="you@example.com" type="email" />
    </div>
  ),
};

/** Label with the `required` prop — appends an aria-hidden asterisk. */
export const Required: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label {...args} htmlFor="required-input" required>
        Full name
      </Label>
      <Input id="required-input" placeholder="Jane Doe" required type="text" />
    </div>
  ),
};

/** Label clicks focus the associated disabled peer, but is dimmed. */
export const DisabledPeer: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-1.5">
      <Label {...args} htmlFor="disabled-input">
        Username
      </Label>
      <Input disabled id="disabled-input" value="locked-user" />
    </div>
  ),
};

/** Label positioned inline (row direction) with a checkbox. */
export const WithCheckbox: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms-checkbox" />
      <Label {...args} htmlFor="terms-checkbox">
        I agree to the terms and conditions
      </Label>
    </div>
  ),
};

/** Label inline with a switch. */
export const WithSwitch: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Switch id="notifications-switch" />
      <Label {...args} htmlFor="notifications-switch">
        Enable notifications
      </Label>
    </div>
  ),
};

/** Multiple labels in a form layout. */
export const FormLayout: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label {...args} htmlFor="form-name">
          Full name
        </Label>
        <Input id="form-name" placeholder="Jane Doe" type="text" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label {...args} htmlFor="form-email">
          Email
        </Label>
        <Input id="form-email" placeholder="you@example.com" type="email" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label
          {...args}
          className="text-destructive"
          htmlFor="form-email-error"
        >
          Email (invalid)
        </Label>
        <Input
          aria-invalid
          id="form-email-error"
          placeholder="bad-email"
          type="email"
        />
      </div>
    </div>
  ),
};
