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
          "Five sizes: `xs` (20 px), `sm` (24 px), `default` (32 px), `lg` (40 px), `xl` (48 px).",
          "`AvatarBadge` overlays a status dot with optional `status` prop (`online`,",
          "`busy`, `away`, `offline`); `AvatarGroup` stacks multiple avatars with",
          "`AvatarGroupCount` for overflow.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl"],
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

/** All five available size presets: xs (20 px) → xl (48 px). */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["xs", "sm", "default", "lg", "xl"] as const).map((size) => (
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

/**
 * Four presence states via the `status` prop on `AvatarBadge`.
 * Each maps to a semantic colour token — no raw palette classes needed.
 */
export const Presence: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Avatar {...args}>
          <AvatarImage
            alt="Online user"
            src="https://i.pravatar.cc/80?img=47"
          />
          <AvatarFallback>ON</AvatarFallback>
          <AvatarBadge status="online" />
        </Avatar>
        <span className="text-muted-foreground text-xs">online</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar {...args}>
          <AvatarImage alt="Busy user" src="https://i.pravatar.cc/80?img=12" />
          <AvatarFallback>BS</AvatarFallback>
          <AvatarBadge status="busy" />
        </Avatar>
        <span className="text-muted-foreground text-xs">busy</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar {...args}>
          <AvatarImage alt="Away user" src="https://i.pravatar.cc/80?img=32" />
          <AvatarFallback>AW</AvatarFallback>
          <AvatarBadge status="away" />
        </Avatar>
        <span className="text-muted-foreground text-xs">away</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar {...args}>
          <AvatarImage
            alt="Offline user"
            src="https://i.pravatar.cc/80?img=22"
          />
          <AvatarFallback>OF</AvatarFallback>
          <AvatarBadge status="offline" />
        </Avatar>
        <span className="text-muted-foreground text-xs">offline</span>
      </div>
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
      {(["xs", "sm", "default", "lg", "xl"] as const).map((size) => (
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
