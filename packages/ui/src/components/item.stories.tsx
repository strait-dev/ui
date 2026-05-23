import {
  Archive01Icon,
  Delete02Icon,
  Folder01Icon,
  Mail01Icon,
  Settings01Icon,
  StarIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";
import { Button } from "./button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "./item";

const meta: Meta<typeof Item> = {
  title: "Data Display/Item",
  component: Item,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Flexible list-item primitive built with **Base UI** `useRender` for",
          "polymorphism (accepts `render` prop, not `asChild`).",
          "",
          "Compose it from: `ItemMedia` (icon/image), `ItemContent`, `ItemTitle`,",
          "`ItemDescription`, `ItemActions`, `ItemHeader`, `ItemFooter`.",
          "Group items with `ItemGroup` and insert dividers with `ItemSeparator`.",
          "",
          "Variants: `default` · `outline` · `muted`. Sizes: `default` · `sm` · `xs`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "muted", "ghost"],
      description:
        "Border / surface style. `ghost` has a transparent background that only shows a hover tint.",
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: ["default", "sm", "xs", "xl"],
      description:
        "Padding/gap preset. `xl` adds generous padding and `text-base` for prominent rows.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: {
    variant: "default",
    size: "default",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust variant and size in the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <Item {...args} className="max-w-sm">
      <ItemMedia variant="icon">
        <HugeiconsIcon icon={Folder01Icon} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Design System</ItemTitle>
        <ItemDescription>
          Component library and design tokens for the Strait platform.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button aria-label="Settings" size="icon-xs" variant="ghost">
          <HugeiconsIcon icon={Settings01Icon} />
        </Button>
      </ItemActions>
    </Item>
  ),
};

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */

/** All four border variants side-by-side including the new `ghost` variant. */
export const Variants: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      {(["default", "outline", "muted", "ghost"] as const).map((variant) => (
        <Item key={variant} variant={variant}>
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Folder01Icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{variant}</ItemTitle>
            <ItemDescription>variant="{variant}"</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
};

/** All four size presets including the new `xl` size. */
export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      {(["default", "sm", "xs", "xl"] as const).map((size) => (
        <Item key={size} size={size} variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Folder01Icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Item — size "{size}"</ItemTitle>
            <ItemDescription>List row at size {size}.</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
};

/** `ghost` variant — transparent background with hover tint only. */
export const GhostVariant: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-1 rounded-lg bg-card p-2">
      {["Inbox", "Sent", "Drafts", "Archive"].map((label) => (
        <Item key={label} variant="ghost">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Mail01Icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{label}</ItemTitle>
          </ItemContent>
        </Item>
      ))}
    </div>
  ),
};

/** `xl` size — generous padding and `text-base` for prominent list entries. */
export const XlSize: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      {(["Archive", "Delete", "Star"] as const).map((label) => (
        <Item key={label} size="xl" variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive01Icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{label}</ItemTitle>
            <ItemDescription>Extra-large item row.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button aria-label="Action" size="icon-xs" variant="ghost">
              <HugeiconsIcon icon={StarIcon} />
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Media variants                                                      */
/* ------------------------------------------------------------------ */

/** Icon media vs image media. */
export const MediaVariants: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-3">
      <Item variant="outline">
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Mail01Icon} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Icon media</ItemTitle>
          <ItemDescription>ItemMedia variant="icon"</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="image">
          <img
            alt="Project thumbnail"
            src="https://picsum.photos/seed/item/40"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Image media</ItemTitle>
          <ItemDescription>ItemMedia variant="image"</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Grouped list                                                        */
/* ------------------------------------------------------------------ */

/**
 * `ItemGroup` wraps a set of `Item` components into a semantic list.
 * `ItemSeparator` renders a horizontal rule between logical sections.
 */
export const GroupedList: Story = {
  render: () => (
    <div className="max-w-sm">
      <ItemGroup>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={UserIcon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Profile</ItemTitle>
            <ItemDescription>Manage your personal details.</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Settings01Icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Settings</ItemTitle>
            <ItemDescription>Configure preferences.</ItemDescription>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Archive01Icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Archive</ItemTitle>
            <ItemDescription>Archived projects and files.</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Delete02Icon} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Trash</ItemTitle>
            <ItemDescription>
              Items deleted in the last 30 days.
            </ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* With actions and badges                                             */
/* ------------------------------------------------------------------ */

/** Items with trailing action buttons and status badges. */
export const WithActionsAndBadges: Story = {
  render: () => (
    <div className="max-w-sm">
      <ItemGroup>
        {[
          {
            title: "Design System",
            desc: "15 open tasks",
            badge: "Active" as const,
          },
          {
            title: "Marketing Site",
            desc: "All tasks complete",
            badge: "Completed" as const,
          },
          {
            title: "Mobile App",
            desc: "3 blocked tasks",
            badge: "Paused" as const,
          },
        ].map(({ title, desc, badge }) => (
          <Item key={title} variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={Folder01Icon} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
              <ItemDescription>{desc}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge
                variant={
                  badge === "Active"
                    ? "success-light"
                    : badge === "Completed"
                      ? "info-light"
                      : "warning-light"
                }
              >
                {badge}
              </Badge>
              <Button aria-label="Star" size="icon-xs" variant="ghost">
                <HugeiconsIcon icon={StarIcon} />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Rendered as a link                                                  */
/* ------------------------------------------------------------------ */

/** Use the `render` prop to make an `Item` a navigation anchor. */
export const AsLink: Story = {
  render: () => (
    <div className="max-w-sm">
      <ItemGroup>
        {["Documentation", "Changelog", "Blog"].map((label) => (
          <Item
            key={label}
            render={
              // biome-ignore lint/a11y/useAnchorContent: content comes from children
              <a href="https://example.com" />
            }
            variant="outline"
          >
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={Folder01Icon} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{label}</ItemTitle>
              <ItemDescription>Opens in the same tab.</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Header + footer                                                     */
/* ------------------------------------------------------------------ */

/** `ItemHeader` and `ItemFooter` span the full row width. */
export const WithHeaderAndFooter: Story = {
  render: () => (
    <div className="max-w-sm">
      <Item variant="outline">
        <ItemHeader>
          <span className="font-medium text-sm">Task #42</span>
          <Badge variant="warning-light">In progress</Badge>
        </ItemHeader>
        <ItemMedia variant="icon">
          <HugeiconsIcon icon={Folder01Icon} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Redesign onboarding flow</ItemTitle>
          <ItemDescription>
            Update the welcome screens to match the new brand guidelines.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-xs">Due 2025-06-01</span>
          <Button size="xs" variant="outline">
            View
          </Button>
        </ItemFooter>
      </Item>
    </div>
  ),
};
