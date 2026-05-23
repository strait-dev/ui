import {
  Copy01Icon,
  Delete02Icon,
  Edit02Icon,
  Logout01Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = {
  title: "Overlays/Dropdown Menu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A menu that opens from a trigger button. Built on Base UI's Menu primitive.",
          "",
          "Supports items, separators, labels, checkboxes, radio groups,",
          "and nested sub-menus via `DropdownMenuSub`. Use `DropdownMenuShortcut`",
          "to surface keyboard shortcuts next to item labels.",
          "",
          "The `variant` prop on `DropdownMenuItem` accepts `default` or `destructive`",
          "for danger actions.",
          "",
          "**Size axis** — pass `size` (`sm | default | lg`) on `DropdownMenuContent` to",
          "cascade padding and text size to all items in that panel via `data-size` on",
          "the popup and `group-data-[size=…]/dropdown-menu-content` selectors on items.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    modal: {
      control: "boolean",
      description: "Trap focus inside the menu while open.",
      table: { defaultValue: { summary: "true" } },
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Click the trigger to open the menu. */
export const Playground: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger
        render={<Button variant="outline">Open menu</Button>}
      />
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** A typical user/account menu with icons, labels, and a destructive action. */
export const AccountMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button aria-label="Account menu" size="icon" variant="ghost">
            <HugeiconsIcon icon={UserIcon} />
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HugeiconsIcon icon={UserIcon} />
            Profile
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={Settings01Icon} />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <HugeiconsIcon icon={Logout01Icon} />
          Sign out
          <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Overflow menu opened with a `MoreHorizontalIcon` trigger. */
export const OverflowMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button aria-label="More options" size="icon" variant="ghost">
            <HugeiconsIcon icon={MoreHorizontalIcon} />
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuItem>
          <HugeiconsIcon icon={Edit02Icon} />
          Edit
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HugeiconsIcon icon={Copy01Icon} />
          Duplicate
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <HugeiconsIcon icon={Delete02Icon} />
          Delete
          <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Checkbox items — toggle a set of independent options. */
export const WithCheckboxes: Story = {
  render: () => {
    const [showSidebar, setShowSidebar] = useState(true);
    const [showGrid, setShowGrid] = useState(false);
    const [showLabels, setShowLabels] = useState(true);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline">View options</Button>}
        />
        <DropdownMenuContent>
          <DropdownMenuLabel>Layout</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={showSidebar}
            onCheckedChange={setShowSidebar}
          >
            Show sidebar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showGrid}
            onCheckedChange={setShowGrid}
          >
            Grid view
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showLabels}
            onCheckedChange={setShowLabels}
          >
            Show labels
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

/** Radio group — mutually-exclusive selection inside a menu. */
export const WithRadioGroup: Story = {
  render: () => {
    const [theme, setTheme] = useState("system");

    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="outline">Appearance</Button>}
        />
        <DropdownMenuContent>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup onValueChange={setTheme} value={theme}>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              System default
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};

/** Nested sub-menu — hover the sub-trigger to reveal nested items. */
export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline">
            <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
            New
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuItem>
          <HugeiconsIcon icon={Edit02Icon} />
          New task
          <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <HugeiconsIcon icon={Copy01Icon} />
            New from template
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Bug report</DropdownMenuItem>
            <DropdownMenuItem>Feature request</DropdownMenuItem>
            <DropdownMenuItem>Design review</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon icon={PlusSignIcon} />
          New project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Grouped items — use `DropdownMenuLabel` and `DropdownMenuGroup` to organise long menus. */
export const Grouped: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline">Team menu</Button>}
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Workspace</DropdownMenuLabel>
          <DropdownMenuItem>
            <HugeiconsIcon icon={Settings01Icon} />
            Workspace settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={UserIcon} />
            Manage members
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Billing</DropdownMenuLabel>
          <DropdownMenuItem>View plan</DropdownMenuItem>
          <DropdownMenuItem>Payment methods</DropdownMenuItem>
          <DropdownMenuItem>Invoices</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <HugeiconsIcon icon={Delete02Icon} />
          Delete workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * All three content sizes side by side. Item padding and text cascade from the
 * `size` prop on `DropdownMenuContent` to every item via `group-data-[size=…]`
 * selectors — no per-item changes needed.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-start gap-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <DropdownMenu defaultOpen key={size}>
          <DropdownMenuTrigger
            render={
              <Button size="sm" variant="outline">
                {size}
              </Button>
            }
          />
          <DropdownMenuContent size={size}>
            <DropdownMenuLabel>Size: {size}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <HugeiconsIcon icon={Edit02Icon} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon icon={Copy01Icon} />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <HugeiconsIcon icon={Delete02Icon} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  ),
};
