import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "User avatar built on **Base UI** `Avatar` primitives. Renders an image",
          "with automatic fallback text when the image fails to load.",
          "",
          "Three sizes: `sm` (24 px), `default` (32 px), `lg` (40 px).",
          "`AvatarBadge` overlays a status dot; `AvatarGroup` stacks multiple",
          "avatars with `AvatarGroupCount` for overflow.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Diameter of the avatar.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: {
    size: "default",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust size using the controls. */
export const Playground: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage alt="Jane Doe" src="https://i.pravatar.cc/80?img=47" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

/* ------------------------------------------------------------------ */
/* Image vs fallback                                                   */
/* ------------------------------------------------------------------ */

/** The image loads successfully. */
export const WithImage: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args}>
        <AvatarImage alt="Alice" src="https://i.pravatar.cc/80?img=47" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarImage alt="Bob" src="https://i.pravatar.cc/80?img=12" />
        <AvatarFallback>BO</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarImage alt="Carol" src="https://i.pravatar.cc/80?img=32" />
        <AvatarFallback>CA</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/**
 * When `src` is missing or broken the `AvatarFallback` renders initials.
 * Base UI hides the fallback while the image is still loading.
 */
export const Fallback: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args}>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar {...args}>
        <AvatarFallback>XY</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Sizes                                                               */
/* ------------------------------------------------------------------ */

/** Three available size presets. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage alt="Demo" src="https://i.pravatar.cc/80?img=47" />
          <AvatarFallback>DM</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Status badge                                                        */
/* ------------------------------------------------------------------ */

/** `AvatarBadge` overlays a coloured dot to indicate online status. */
export const WithStatusBadge: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args}>
        <AvatarImage alt="Online" src="https://i.pravatar.cc/80?img=47" />
        <AvatarFallback>ON</AvatarFallback>
        <AvatarBadge className="bg-success" />
      </Avatar>
      <Avatar {...args}>
        <AvatarImage alt="Away" src="https://i.pravatar.cc/80?img=12" />
        <AvatarFallback>AW</AvatarFallback>
        <AvatarBadge className="bg-warning" />
      </Avatar>
      <Avatar {...args}>
        <AvatarImage alt="Offline" src="https://i.pravatar.cc/80?img=32" />
        <AvatarFallback>OF</AvatarFallback>
        <AvatarBadge className="bg-muted-foreground" />
      </Avatar>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Stacked group                                                       */
/* ------------------------------------------------------------------ */

/** `AvatarGroup` stacks avatars with negative spacing. `AvatarGroupCount` shows overflow. */
export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <AvatarGroup key={size}>
          <Avatar size={size}>
            <AvatarImage alt="Alice" src="https://i.pravatar.cc/80?img=47" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <Avatar size={size}>
            <AvatarImage alt="Bob" src="https://i.pravatar.cc/80?img=12" />
            <AvatarFallback>BO</AvatarFallback>
          </Avatar>
          <Avatar size={size}>
            <AvatarImage alt="Carol" src="https://i.pravatar.cc/80?img=32" />
            <AvatarFallback>CA</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+5</AvatarGroupCount>
        </AvatarGroup>
      ))}
    </div>
  ),
};
