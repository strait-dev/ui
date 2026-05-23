import {
  Alert02Icon,
  FolderIcon,
  FolderOpenIcon,
  InboxIcon,
  InformationCircleIcon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";

const meta = {
  title: "Feedback/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "An empty-state container that fills available space and guides users",
          "when there is no data to display. Compose `EmptyMedia`, `EmptyHeader`,",
          "`EmptyTitle`, `EmptyDescription`, and `EmptyContent` to build rich",
          "empty states with icons, copy, and call-to-action buttons.",
          "",
          "`EmptyMedia` accepts:",
          "- `variant`: `default` (transparent background) or `icon` (rounded chip).",
          "- `size`: `sm` | `default` | `lg` — scales the icon chip and its SVG child.",
          "- `intent`: `muted` | `info` | `success` | `warning` | `destructive` —",
          '  applies semantic tint colours; only meaningful when `variant="icon"`.',
          "",
          "`Empty` accepts a `border` prop (default `true`) that toggles a",
          "`border border-dashed` outline around the container.",
        ].join("\n"),
      },
    },
  },
  args: {
    border: true,
  },
  argTypes: {
    border: {
      control: "boolean",
      description: "Render a dashed border around the empty state container.",
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Full-featured empty state with icon, title, description, and CTA. */
export const Playground: Story = {
  render: (args) => (
    <Empty className="min-h-64 w-96" {...args}>
      <EmptyHeader>
        <EmptyMedia>
          <HugeiconsIcon
            className="size-10 text-muted-foreground"
            icon={InboxIcon}
          />
        </EmptyMedia>
        <EmptyTitle>No messages yet</EmptyTitle>
        <EmptyDescription>
          When you receive messages they will appear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
          Compose message
        </Button>
      </EmptyContent>
    </Empty>
  ),
};

/** `EmptyMedia` with the `icon` variant — muted rounded chip. */
export const WithIconVariant: Story = {
  render: (args) => (
    <Empty className="min-h-64 w-96" {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={FolderIcon} />
        </EmptyMedia>
        <EmptyTitle>No projects found</EmptyTitle>
        <EmptyDescription>
          Create your first project to get started.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="brand-solid">
          <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
          New project
        </Button>
      </EmptyContent>
    </Empty>
  ),
};

/** Empty search result — no icon variant, contextual CTA. */
export const NoResults: Story = {
  render: (args) => (
    <Empty className="min-h-52 w-96" {...args}>
      <EmptyHeader>
        <EmptyMedia>
          <HugeiconsIcon
            className="size-10 text-muted-foreground"
            icon={Search01Icon}
          />
        </EmptyMedia>
        <EmptyTitle>No results for "dashboard"</EmptyTitle>
        <EmptyDescription>
          Try a different search term or browse all items.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" variant="outline">
          Clear search
        </Button>
      </EmptyContent>
    </Empty>
  ),
};

/** Minimal empty state — title and description only, no icon or CTA. */
export const Minimal: Story = {
  render: (args) => (
    <Empty className="min-h-40 w-96" {...args}>
      <EmptyHeader>
        <EmptyTitle>Nothing here yet</EmptyTitle>
        <EmptyDescription>Add items to see them listed here.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

/** `border={false}` — removes the dashed outline, useful inside a bordered card. */
export const Borderless: Story = {
  render: () => (
    <div className="w-96 rounded-xl border p-4">
      <Empty border={false} className="min-h-40">
        <EmptyHeader>
          <EmptyTitle>No activity</EmptyTitle>
          <EmptyDescription>
            Activity will appear here once data is available.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
};

/**
 * Three sizes of the icon chip — `sm`, `default`, and `lg` — side by side.
 * Size only applies when `variant="icon"`.
 */
export const IconSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Empty border className="min-h-40 w-36" key={size}>
          <EmptyHeader>
            <EmptyMedia size={size} variant="icon">
              <HugeiconsIcon icon={FolderIcon} />
            </EmptyMedia>
            <EmptyTitle>{size}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ))}
    </div>
  ),
};

/**
 * All five intent tints on the icon chip.
 * Intent colours are only applied when `variant="icon"`.
 */
export const IconIntents: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(
        [
          { intent: "muted", label: "Muted", icon: InboxIcon },
          { intent: "info", label: "Info", icon: InformationCircleIcon },
          { intent: "success", label: "Success", icon: FolderOpenIcon },
          { intent: "warning", label: "Warning", icon: Alert02Icon },
          { intent: "destructive", label: "Destructive", icon: FolderIcon },
        ] as const
      ).map(({ intent, label, icon }) => (
        <Empty border className="min-h-44 w-40" key={intent}>
          <EmptyHeader>
            <EmptyMedia intent={intent} variant="icon">
              <HugeiconsIcon icon={icon} />
            </EmptyMedia>
            <EmptyTitle>{label}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ))}
    </div>
  ),
};

/** Multiple empty states in context to show density. */
export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Empty border className="min-h-52">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={InboxIcon} />
          </EmptyMedia>
          <EmptyTitle>Empty inbox</EmptyTitle>
          <EmptyDescription>You have no unread messages.</EmptyDescription>
        </EmptyHeader>
      </Empty>

      <Empty border className="min-h-52">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={FolderOpenIcon} />
          </EmptyMedia>
          <EmptyTitle>No files</EmptyTitle>
          <EmptyDescription>Upload files to see them here.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" variant="outline">
            Upload
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  ),
};
