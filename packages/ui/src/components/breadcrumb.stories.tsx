import {
  ArrowDown01Icon,
  ArrowRight02Icon,
  CodeIcon,
  File02Icon,
  FolderIcon,
  Home01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const meta: Meta<typeof Breadcrumb> = {
  title: "Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Breadcrumbs display the current page's location within a navigational hierarchy.",
          "",
          "The component is composed of `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`,",
          "`BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, and `BreadcrumbEllipsis`.",
          "",
          "`BreadcrumbLink` uses Base UI's `useRender` and accepts a `render` prop for",
          "custom elements such as router links.",
          "",
          "`BreadcrumbSeparator` renders an arrow icon by default; pass custom content",
          "as `children` to override it.",
          "",
          "**Size axis** — pass `size` (`sm | default | lg`) on `Breadcrumb` to scale",
          "text size and gap uniformly across all descendant parts via `data-size` and",
          "`in-data-[size=…]` selectors.",
          "",
          "**Default separator** — pass `separator` as a React node on `Breadcrumb` to",
          "use the same separator for every position without repeating `<BreadcrumbSeparator>`.",
          "Per-item separators (explicit `<BreadcrumbSeparator>`) always take precedence.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Controls text size and gap across all breadcrumb parts.",
      table: { defaultValue: { summary: "default" } },
    },
    separator: {
      control: false,
      description:
        "Default separator node used between items. Per-item children override this.",
    },
  },
  args: {
    size: "default",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — a basic three-level breadcrumb. */
export const Playground: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/** A single-level breadcrumb pointing back to the root. */
export const SingleLevel: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/** Deep navigation hierarchy collapsed with an ellipsis in the middle. */
export const WithEllipsis: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/** Home icon as the root link, demonstrating icon composition. */
export const WithIcon: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink aria-label="Home" href="#">
            <HugeiconsIcon className="size-4" icon={Home01Icon} />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Custom separator — pass any element as `children` to `BreadcrumbSeparator`
 * to override the default arrow icon.
 */
export const CustomSeparator: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <span>/</span>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <span>/</span>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Introduction</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Use the `render` prop on `BreadcrumbLink` to swap in a custom element
 * (e.g. a Next.js `<Link>` or a React Router `<Link>`).
 */
export const CustomLinkElement: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {/* biome-ignore lint/a11y/useAnchorContent: content is provided by BreadcrumbLink children */}
          {/* biome-ignore lint/a11y/useValidAnchor: placeholder href for story demo */}
          <BreadcrumbLink render={<a href="#" />}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {/* biome-ignore lint/a11y/useAnchorContent: content is provided by BreadcrumbLink children */}
          {/* biome-ignore lint/a11y/useValidAnchor: placeholder href for story demo */}
          <BreadcrumbLink render={<a href="#" />}>Library</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Data</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/** A long path that wraps on narrow screens thanks to `flex-wrap`. */
export const LongPath: Story = {
  render: () => (
    <div className="w-64">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Organisation</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Design System</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Components</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
};

/**
 * All three sizes side by side. Notice how text size and gap scale uniformly
 * across items and separators without any per-item changes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div className="flex flex-col gap-1" key={size}>
          <p className="text-muted-foreground text-xs capitalize">{size}</p>
          <Breadcrumb size={size}>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      ))}
    </div>
  ),
};

/**
 * The `separator` prop on `Breadcrumb` sets a default separator for all
 * items — no need to repeat `<BreadcrumbSeparator>` between each pair.
 * Per-item children (last separator) still override the root default.
 */
export const DefaultSeparatorProp: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-xs">
        Root separator prop — slash for all, except the last one uses per-item
        children
      </p>
      <Breadcrumb separator={<span className="text-muted-foreground">/</span>}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Docs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Components</BreadcrumbLink>
          </BreadcrumbItem>
          {/* Per-item override takes precedence */}
          <BreadcrumbSeparator>
            <span className="text-brand">›</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
};

/**
 * Drop a `DropdownMenu` into a `BreadcrumbItem` to expose sibling pages from
 * the trail — a common pattern for navigating between projects, branches, or
 * tabs without leaving the current view.
 */
export const WithDropdown: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
              Projects
              <HugeiconsIcon
                className="size-3.5"
                icon={ArrowDown01Icon}
                strokeWidth={2}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Strait UI</DropdownMenuItem>
              <DropdownMenuItem>Strait Mobile</DropdownMenuItem>
              <DropdownMenuItem>Marketing site</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Strait UI</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Use the ellipsis as the trigger for a dropdown that reveals every
 * collapsed crumb at once — handy in deeply nested IA.
 */
export const EllipsisDropdown: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Show all crumbs"
              className="rounded-md p-0.5 transition-colors hover:bg-muted hover:text-foreground"
            >
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Organisation</DropdownMenuItem>
              <DropdownMenuItem>Workspace</DropdownMenuItem>
              <DropdownMenuItem>Projects</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Design System</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Icons on every crumb — pair a small icon with each label to communicate
 * the type of node (folder, file, code…).
 */
export const IconsPerItem: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="inline-flex items-center gap-1.5" href="#">
            <HugeiconsIcon
              className="size-4"
              icon={Home01Icon}
              strokeWidth={2}
            />
            Workspace
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink className="inline-flex items-center gap-1.5" href="#">
            <HugeiconsIcon
              className="size-4"
              icon={FolderIcon}
              strokeWidth={2}
            />
            Components
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="inline-flex items-center gap-1.5">
            <HugeiconsIcon className="size-4" icon={CodeIcon} strokeWidth={2} />
            breadcrumb.tsx
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Double-chevron separator — pass an icon as `separator` on the root for a
 * compact ASCII-friendly trail.
 */
export const DoubleChevronSeparator: Story = {
  render: () => (
    <Breadcrumb
      separator={
        <HugeiconsIcon
          className="size-3.5"
          icon={ArrowRight02Icon}
          strokeWidth={2}
        />
      }
    >
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Members</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Pill-style — wrap the trail in a muted surface for a soft, app-shell look
 * suitable for top bars.
 */
export const PillStyle: Story = {
  render: () => (
    <div className="inline-flex rounded-full bg-muted px-3 py-1.5">
      <Breadcrumb size="sm">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Docs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
};

/**
 * Pair an `Avatar` with the workspace crumb to communicate ownership
 * (organisation, team, or user) at a glance.
 */
export const WithAvatar: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="inline-flex items-center gap-2" href="#">
            <Avatar size="xs">
              <AvatarFallback>SR</AvatarFallback>
            </Avatar>
            Strait
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Design System</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Annotate a crumb with a `Badge` to surface secondary status, counts, or
 * environment tags inline with the trail.
 */
export const WithBadge: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink className="inline-flex items-center gap-2" href="#">
            Projects
            <Badge size="xs" variant="secondary">
              12
            </Badge>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="inline-flex items-center gap-2">
            Strait UI
            <Badge size="xs" variant="info-light">
              Production
            </Badge>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Use {@link BreadcrumbLink} with `Home01Icon` as the dedicated root link, an
 * icon-only entry that always carries the user back to the workspace root.
 */
export const HomeIcon: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink aria-label="Home" href="#">
            <HugeiconsIcon
              className="size-4"
              icon={Home01Icon}
              strokeWidth={2}
            />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink className="inline-flex items-center gap-1.5" href="#">
            <HugeiconsIcon
              className="size-4"
              icon={Settings02Icon}
              strokeWidth={2}
            />
            Settings
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Members</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Invitations</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

/**
 * Document context — show the parent folder and the current document with a
 * file icon, common in editor toolbars.
 */
export const DocumentContext: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">My Drive</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink className="inline-flex items-center gap-1.5" href="#">
            <HugeiconsIcon
              className="size-4 text-muted-foreground"
              icon={FolderIcon}
              strokeWidth={2}
            />
            Specs
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="inline-flex items-center gap-1.5">
            <HugeiconsIcon
              className="size-4 text-muted-foreground"
              icon={File02Icon}
              strokeWidth={2}
            />
            Q3 launch plan
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
