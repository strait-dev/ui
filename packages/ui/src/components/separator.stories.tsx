import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "./separator";

const meta = {
  title: "Layout/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          'A thin visual divider accessible to screen readers via `role="separator"`.',
          "",
          "Use it to group related content sections or to divide items in a list,",
          "toolbar, or navigation menu. Two orientations are available:",
          "- **horizontal** (default): full-width 1 px line.",
          "- **vertical**: 1 px tall line that stretches to fill its flex container.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Direction of the separator line.",
      table: { defaultValue: { summary: "horizontal" } },
    },
  },
  args: {
    orientation: "horizontal",
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — switch orientation with the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-sm">Section A</p>
      <Separator {...args} />
      <p className="text-sm">Section B</p>
    </div>
  ),
};

/** Default horizontal separator divides stacked content. */
export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <div className="flex w-80 flex-col gap-3">
      <div>
        <p className="font-medium text-sm">Profile</p>
        <p className="text-muted-foreground text-xs">Manage your account</p>
      </div>
      <Separator {...args} />
      <div>
        <p className="font-medium text-sm">Billing</p>
        <p className="text-muted-foreground text-xs">View invoices and plans</p>
      </div>
      <Separator {...args} />
      <div>
        <p className="font-medium text-sm">Security</p>
        <p className="text-muted-foreground text-xs">
          Two-factor authentication
        </p>
      </div>
    </div>
  ),
};

/** Vertical separator divides side-by-side content in a flex row. */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-8 items-center gap-3">
      <span className="text-sm">Home</span>
      <Separator {...args} />
      <span className="text-sm">Projects</span>
      <Separator {...args} />
      <span className="text-sm">Settings</span>
    </div>
  ),
};

/**
 * Separators composing a settings list — the most common real-world usage.
 */
export const InList: Story = {
  render: () => {
    const items = [
      { label: "General", description: "Language, timezone, and display" },
      { label: "Notifications", description: "Email and push preferences" },
      { label: "Integrations", description: "Connect third-party services" },
      { label: "Advanced", description: "Experimental features" },
    ];
    return (
      <div className="w-96 rounded-lg border p-4">
        {items.map((item, i) => (
          <div key={item.label}>
            <div className="flex items-center justify-between py-2">
              <span className="font-medium text-sm">{item.label}</span>
              <span className="text-muted-foreground text-xs">
                {item.description}
              </span>
            </div>
            {i < items.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    );
  },
};
