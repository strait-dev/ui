import {
  File01Icon,
  Folder01Icon,
  FolderOpenIcon,
  Image01Icon,
} from "@hugeicons/core-free-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { Tree, TreeItem } from "./tree";

const meta = {
  title: "Data Display/Tree",
  component: Tree,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A hierarchical tree view built on **React Aria Components** `Tree`.",
          "",
          "Key props on `Tree` (root):",
          "- **`aria-label`** _(required)_ — accessible name for the tree widget.",
          '- **`selectionMode`** — `"none"` (default), `"single"`, or `"multiple"`.',
          "- **`defaultExpandedKeys`** / **`expandedKeys`** + **`onExpandedChange`** — control which branches are open.",
          "- **`defaultSelectedKeys`** / **`selectedKeys`** + **`onSelectionChange`** — control selection.",
          "- **`disabledKeys`** — set of keys that cannot be focused or selected.",
          "",
          "Each `TreeItem` accepts:",
          "- **`title`** — the visible label (string or ReactNode).",
          "- **`icon`** — optional leading HugeiconsIcon.",
          "- **`textValue`** — typeahead string (auto-derived from `title` when it is a plain string).",
          "- **`id`** — unique key for this row.",
          "- Nest `<TreeItem>` children to create branches.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Tree>;

export default meta;

type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Playground — full file/folder tree with icons and nesting
// ---------------------------------------------------------------------------

/**
 * Interactive playground showing a multi-level file/folder tree.
 * Toggle `selectionMode` and other controls to explore the API.
 */
export const Playground: Story = {
  render: () => (
    <div className="max-w-sm">
      <Tree aria-label="Project files" defaultExpandedKeys={["src", "assets"]}>
        <TreeItem icon={FolderOpenIcon} id="src" title="src">
          <TreeItem icon={Folder01Icon} id="components" title="components">
            <TreeItem icon={File01Icon} id="button" title="button.tsx" />
            <TreeItem icon={File01Icon} id="input" title="input.tsx" />
          </TreeItem>
          <TreeItem icon={Folder01Icon} id="pages" title="pages">
            <TreeItem icon={File01Icon} id="home" title="home.tsx" />
            <TreeItem icon={File01Icon} id="about" title="about.tsx" />
          </TreeItem>
          <TreeItem icon={File01Icon} id="app" title="app.tsx" />
          <TreeItem icon={File01Icon} id="main" title="main.tsx" />
        </TreeItem>
        <TreeItem icon={FolderOpenIcon} id="assets" title="assets">
          <TreeItem icon={Image01Icon} id="logo" title="logo.svg" />
          <TreeItem icon={Image01Icon} id="bg" title="background.png" />
        </TreeItem>
        <TreeItem icon={File01Icon} id="readme" title="README.md" />
        <TreeItem icon={File01Icon} id="pkg" title="package.json" />
      </Tree>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Selectable — single and multiple selection
// ---------------------------------------------------------------------------

/**
 * Demonstrates single-selection mode. Click any item to select it;
 * click again to deselect.
 */
export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    return (
      <div className="flex max-w-sm flex-col gap-6">
        <div>
          <p className="mb-2 text-muted-foreground text-sm">
            Single selection — selected:{" "}
            {selected.size > 0 ? [...selected].join(", ") : "none"}
          </p>
          <Tree
            aria-label="Single-selection tree"
            onSelectionChange={(keys: Selection) => {
              if (keys === "all") {
                return;
              }
              setSelected(keys as Set<string>);
            }}
            selectionMode="single"
          >
            <TreeItem id="inbox" title="Inbox" />
            <TreeItem id="drafts" title="Drafts" />
            <TreeItem id="sent" title="Sent" />
            <TreeItem id="trash" title="Trash" />
          </Tree>
        </div>
      </div>
    );
  },
};

/**
 * Multiple-selection mode. Use keyboard (Space / click) to toggle items.
 */
export const MultipleSelection: Story = {
  render: () => (
    <div className="max-w-sm">
      <Tree
        aria-label="Multi-selection tree"
        defaultSelectedKeys={["drafts"]}
        selectionMode="multiple"
      >
        <TreeItem id="inbox" title="Inbox" />
        <TreeItem id="drafts" title="Drafts" />
        <TreeItem id="sent" title="Sent" />
        <TreeItem id="archive" title="Archive">
          <TreeItem id="archive-2024" title="2024" />
          <TreeItem id="archive-2023" title="2023" />
        </TreeItem>
        <TreeItem id="trash" title="Trash" />
      </Tree>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// WithIcons — icon on every item
// ---------------------------------------------------------------------------

/**
 * Each tree item has a leading icon. Branch items use folder icons; leaf
 * items use file or image icons.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="max-w-sm">
      <Tree aria-label="Files with icons" defaultExpandedKeys={["media"]}>
        <TreeItem icon={Folder01Icon} id="docs" title="Documents">
          <TreeItem icon={File01Icon} id="report" title="annual-report.pdf" />
          <TreeItem icon={File01Icon} id="notes" title="meeting-notes.txt" />
        </TreeItem>
        <TreeItem icon={FolderOpenIcon} id="media" title="Media">
          <TreeItem icon={Image01Icon} id="hero" title="hero.png" />
          <TreeItem icon={Image01Icon} id="avatar" title="avatar.jpg" />
        </TreeItem>
        <TreeItem icon={File01Icon} id="gitignore" title=".gitignore" />
      </Tree>
    </div>
  ),
};

// ---------------------------------------------------------------------------
// DefaultExpanded — specific branches open on mount
// ---------------------------------------------------------------------------

/**
 * Passes `defaultExpandedKeys` so certain branches are visible on first render
 * without any user interaction.
 */
export const DefaultExpanded: Story = {
  render: () => (
    <div className="max-w-sm">
      <Tree
        aria-label="Pre-expanded tree"
        defaultExpandedKeys={["backend", "frontend"]}
      >
        <TreeItem icon={Folder01Icon} id="backend" title="backend">
          <TreeItem icon={Folder01Icon} id="api" title="api">
            <TreeItem icon={File01Icon} id="routes" title="routes.ts" />
            <TreeItem icon={File01Icon} id="middleware" title="middleware.ts" />
          </TreeItem>
          <TreeItem icon={File01Icon} id="db" title="db.ts" />
        </TreeItem>
        <TreeItem icon={Folder01Icon} id="frontend" title="frontend">
          <TreeItem icon={Folder01Icon} id="components-fe" title="components">
            <TreeItem icon={File01Icon} id="nav" title="Nav.tsx" />
          </TreeItem>
          <TreeItem icon={File01Icon} id="styles" title="styles.css" />
        </TreeItem>
        <TreeItem icon={File01Icon} id="docker" title="Dockerfile" />
      </Tree>
    </div>
  ),
};
