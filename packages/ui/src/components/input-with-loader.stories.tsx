import { Mail01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputWithLoader } from "./input-with-loader";
import { Label } from "./label";

const meta: Meta<typeof InputWithLoader> = {
  title: "Patterns/Input with Loader",
  component: InputWithLoader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "An `Input` that can display a leading icon, a loading spinner, or a clickable",
          "trailing icon.",
          "",
          "Composes the `Input` primitive with absolutely-positioned icon slots.",
          "When `loading` is `true` the leading slot shows a spinning `Loading01Icon`",
          "regardless of the `icon` prop — useful for async search or validation feedback.",
          "The optional `endIcon` slot renders a pressable button (supply `onEndIconClick`",
          "and `endIconAriaLabel`).",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    loading: {
      control: "boolean",
      description: "Replace the leading icon with a spinner.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder shown when the field is empty.",
    },
    disabled: {
      control: "boolean",
      description: "Disable the field.",
    },
    icon: {
      control: false,
      description: "Element rendered in the leading slot.",
    },
    endIcon: {
      control: false,
      description: "Pressable element rendered in the trailing slot.",
    },
  },
  args: {
    placeholder: "Search…",
    loading: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — toggle `loading` to see the spinner replace the icon. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="loader-playground">Search</Label>
      <InputWithLoader
        {...args}
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="loader-playground"
      />
    </div>
  ),
};

/** Idle state with a search icon in the start slot. */
export const WithStartIcon: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="loader-start-icon">Search</Label>
      <InputWithLoader
        {...args}
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="loader-start-icon"
        placeholder="Search…"
      />
    </div>
  ),
};

/** Loading spinner replaces the leading icon during async operations. */
export const Loading: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="loader-loading">Search</Label>
      <InputWithLoader
        {...args}
        defaultValue="strait"
        id="loader-loading"
        loading
        placeholder="Search…"
      />
    </div>
  ),
};

/** End icon slot — useful for clear buttons or action triggers. */
export const WithEndIcon: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="loader-end-icon">Email</Label>
      <InputWithLoader
        {...args}
        endIcon={<HugeiconsIcon icon={Mail01Icon} size={16} />}
        endIconAriaLabel="Open mail client"
        id="loader-end-icon"
        placeholder="you@example.com"
        type="email"
      />
    </div>
  ),
};

/** Both start icon and end icon at the same time. */
export const BothIcons: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="loader-both">Email</Label>
      <InputWithLoader
        {...args}
        endIcon={<HugeiconsIcon icon={Mail01Icon} size={16} />}
        endIconAriaLabel="Open mail client"
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="loader-both"
        placeholder="Search inbox…"
      />
    </div>
  ),
};

/** Disabled — dimmed appearance. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="loader-disabled">Search</Label>
      <InputWithLoader
        {...args}
        disabled
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="loader-disabled"
        placeholder="Unavailable"
      />
    </div>
  ),
};
