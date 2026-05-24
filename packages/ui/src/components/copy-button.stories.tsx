import type { Meta, StoryObj } from "@storybook/react-vite";

import { CopyButton } from "./copy-button";

const meta: Meta<typeof CopyButton> = {
  title: "Actions/Copy Button",
  component: CopyButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Icon button that writes a string to the clipboard and shows a",
          "transient checkmark. Built on the design-system **Button**, so it",
          "inherits the full `variant`/`size` matrix. Pass `children` to render",
          "a labelled button instead of the icon-only default.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    text: {
      control: "text",
      description: "The string copied to the clipboard on click.",
    },
    timeout: {
      control: "number",
      description: "How long (ms) the copied state persists.",
    },
    variant: {
      control: "select",
      description: "Button visual style (inherited from Button).",
    },
    size: {
      control: "select",
      description: "Button size (inherited from Button).",
    },
  },
  args: {
    text: "npm install @strait/ui",
  },
};

export default meta;

type Story = StoryObj<typeof CopyButton>;

/** Interactive playground — tweak props in the controls panel. */
export const Playground: Story = {};

/** The default icon-only, ghost button. */
export const IconOnly: Story = {
  args: { "aria-label": "Copy install command" },
};

/** Render a labelled button by passing children. */
export const WithLabel: Story = {
  args: { variant: "outline", size: "sm", children: "Copy ID" },
};

/** A selection of the inherited Button variants. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <CopyButton {...args} variant="ghost" />
      <CopyButton {...args} variant="outline" />
      <CopyButton {...args} variant="secondary" />
      <CopyButton {...args} variant="default" />
    </div>
  ),
};

/** Beside a value, the most common usage. */
export const BesideValue: Story = {
  render: (args) => (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 font-mono text-sm">
      <span>run_8f3a91c2e7</span>
      <CopyButton {...args} aria-label="Copy run ID" text="run_8f3a91c2e7" />
    </div>
  ),
};
