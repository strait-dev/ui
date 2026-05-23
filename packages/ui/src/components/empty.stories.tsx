import {
  FolderIcon,
  FolderOpenIcon,
  InboxIcon,
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
          "`EmptyMedia` accepts a `variant` of `default` (transparent background)",
          "or `icon` (muted rounded background, ideal for small inline icons).",
        ].join("\n"),
      },
    },
  },
  argTypes: {},
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Full-featured empty state with icon, title, description, and CTA. */
export const Playground: Story = {
  render: () => (
    <Empty className="min-h-64 w-96 border">
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
  render: () => (
    <Empty className="min-h-64 w-96 border">
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
  render: () => (
    <Empty className="min-h-52 w-96 border">
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
  render: () => (
    <Empty className="min-h-40 w-96 border">
      <EmptyHeader>
        <EmptyTitle>Nothing here yet</EmptyTitle>
        <EmptyDescription>Add items to see them listed here.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

/** Multiple empty states in context to show density. */
export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Empty className="min-h-52 border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={InboxIcon} />
          </EmptyMedia>
          <EmptyTitle>Empty inbox</EmptyTitle>
          <EmptyDescription>You have no unread messages.</EmptyDescription>
        </EmptyHeader>
      </Empty>

      <Empty className="min-h-52 border">
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
