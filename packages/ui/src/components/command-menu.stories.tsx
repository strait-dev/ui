import {
  Delete01Icon,
  GlobeIcon,
  Home01Icon,
  Search01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./button";
import { CommandMenu, type CommandMenuProps } from "./command-menu";

const meta = {
  title: "Navigation/Command Menu",
  component: CommandMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A ⌘K command palette built on top of the `CommandDialog` / `cmdk` primitives.",
          "",
          "Compose it via `groups` (each group has a `heading` and a list of `CommandMenuItem`s).",
          "Items support a leading `icon`, a right-aligned `shortcut` badge, and extra `keywords`",
          "for fuzzy search beyond the visible label.",
          "",
          "The palette registers a global hotkey (`mod+k` by default) so it can be opened from",
          "anywhere on the page. Pass a `trigger` element (e.g. a `Button`) to also open it via",
          "a click target. Both controlled (`open` + `onOpenChange`) and uncontrolled modes are",
          "supported.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text in the search input.",
      table: { defaultValue: { summary: "Type a command or search..." } },
    },
    hotkey: {
      control: "text",
      description:
        "react-hotkeys-hook notation for the global toggle key (e.g. `mod+k`).",
      table: { defaultValue: { summary: "mod+k" } },
    },
    emptyMessage: {
      control: "text",
      description: "Message shown when no items match the query.",
      table: { defaultValue: { summary: "No results found." } },
    },
  },
  args: {
    groups: [],
  },
} satisfies Meta<typeof CommandMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Shared sample groups
// ---------------------------------------------------------------------------

const sampleGroups: CommandMenuProps["groups"] = [
  {
    heading: "Navigation",
    items: [
      {
        label: "Home",
        icon: Home01Icon,
        shortcut: "⌘H",
        keywords: ["dashboard", "start"],
        onSelect: () => alert("Navigate → Home"),
      },
      {
        label: "Profile",
        icon: UserIcon,
        shortcut: "⌘P",
        onSelect: () => alert("Navigate → Profile"),
      },
      {
        label: "Settings",
        icon: Settings01Icon,
        shortcut: "⌘,",
        keywords: ["preferences", "config"],
        onSelect: () => alert("Navigate → Settings"),
      },
      {
        label: "Browse",
        icon: GlobeIcon,
        onSelect: () => alert("Navigate → Browse"),
      },
    ],
  },
  {
    heading: "Actions",
    items: [
      {
        label: "Search everything",
        icon: Search01Icon,
        shortcut: "⌘F",
        keywords: ["find", "lookup"],
        onSelect: () => alert("Action → Search"),
      },
      {
        label: "Delete selected",
        icon: Delete01Icon,
        keywords: ["remove", "trash"],
        onSelect: () => alert("Action → Delete"),
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

/**
 * Interactive playground — click the button or press **⌘K** to open the
 * palette. Try typing to filter items by label or keyword.
 */
export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <CommandMenu
        {...args}
        groups={sampleGroups}
        onOpenChange={setOpen}
        open={open}
        trigger={
          <Button size="sm" variant="outline">
            Open command menu
            <kbd className="ml-2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-muted-foreground text-xs">
              ⌘K
            </kbd>
          </Button>
        }
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Hotkey Demo
// ---------------------------------------------------------------------------

/**
 * Hotkey demo — the command palette registers a **global** `mod+k` hotkey.
 * Press **⌘K** (macOS) or **Ctrl+K** (Windows / Linux) anywhere on this page
 * to open the palette without clicking a trigger.
 */
export const HotkeyDemo: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm">
          Press{" "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-foreground text-xs">
            ⌘K
          </kbd>{" "}
          anywhere to open the command palette.
        </p>
        <CommandMenu
          {...args}
          groups={sampleGroups}
          onOpenChange={setOpen}
          open={open}
        />
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// With Keywords
// ---------------------------------------------------------------------------

/**
 * Demonstrates `keywords` — the "Open file" item also matches the query
 * "document" even though that word is not in its label. Try typing "document"
 * after opening the palette.
 */
export const WithKeywords: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    const keywordGroups: CommandMenuProps["groups"] = [
      {
        heading: "File",
        items: [
          {
            label: "Open file",
            keywords: ["document", "load", "import"],
            onSelect: () => setOpen(false),
          },
          {
            label: "Save file",
            keywords: ["export", "write", "persist"],
            onSelect: () => setOpen(false),
          },
        ],
      },
    ];

    return (
      <CommandMenu
        {...args}
        groups={keywordGroups}
        onOpenChange={setOpen}
        open={open}
        trigger={
          <Button size="sm" variant="outline">
            Open (type "document")
          </Button>
        }
      />
    );
  },
};

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

/**
 * Shows the empty-state message when no items match. Open the palette and
 * type a random string to see "No results found."
 */
export const EmptyState: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <CommandMenu
        {...args}
        emptyMessage="No results found."
        groups={sampleGroups}
        onOpenChange={setOpen}
        open={open}
        trigger={
          <Button size="sm" variant="outline">
            Open — then type garbage
          </Button>
        }
      />
    );
  },
};
