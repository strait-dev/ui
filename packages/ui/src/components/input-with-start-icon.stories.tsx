import { Mail01Icon, Search01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { InputWithStartIcon } from "./input-with-start-icon";

const meta: Meta<typeof InputWithStartIcon> = {
  title: "Patterns/Input with Start Icon",
  component: InputWithStartIcon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "An `Input` with an absolutely-positioned leading icon and an optional built-in",
          "label — all in a single self-contained component.",
          "",
          "Composes the `Input` primitive with a peer-powered icon slot and an inline",
          "`<label>` element. Pass any icon via the `icon` prop. The `label` prop renders",
          "a formatted label above the input, tied via `htmlFor` to the `id` prop.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    placeholder: { control: "text" },
    label: { control: "text" },
    disabled: { control: "boolean" },
    icon: { control: false },
  },
  args: {
    placeholder: "Search…",
    label: "Search",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust label and placeholder via controls. */
export const Playground: Story = {
  render: (args) => (
    <div className="w-72">
      <InputWithStartIcon
        {...args}
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="start-icon-playground"
      />
    </div>
  ),
};

/** Search field with a magnifying-glass icon. */
export const Search: Story = {
  render: (args) => (
    <div className="w-72">
      <InputWithStartIcon
        {...args}
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="start-icon-search"
        label="Search"
        placeholder="Search…"
      />
    </div>
  ),
};

/** Email field with a mail icon. */
export const Email: Story = {
  render: (args) => (
    <div className="w-72">
      <InputWithStartIcon
        {...args}
        icon={<HugeiconsIcon icon={Mail01Icon} size={16} />}
        id="start-icon-email"
        label="Email"
        placeholder="you@example.com"
        type="email"
      />
    </div>
  ),
};

/** Username field with a user icon. */
export const Username: Story = {
  render: (args) => (
    <div className="w-72">
      <InputWithStartIcon
        {...args}
        icon={<HugeiconsIcon icon={UserIcon} size={16} />}
        id="start-icon-username"
        label="Username"
        placeholder="johndoe"
      />
    </div>
  ),
};

/** Disabled state — icon dims with the input. */
export const Disabled: Story = {
  render: (args) => (
    <div className="w-72">
      <InputWithStartIcon
        {...args}
        defaultValue="readonly"
        disabled
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="start-icon-disabled"
        label="Search"
      />
    </div>
  ),
};

/** Without a label — supply `aria-label` directly for accessibility. */
export const WithoutLabel: Story = {
  render: (args) => (
    <div className="w-72">
      <InputWithStartIcon
        {...args}
        aria-label="Search"
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="start-icon-no-label"
        label={undefined}
        placeholder="Search…"
      />
    </div>
  ),
};
