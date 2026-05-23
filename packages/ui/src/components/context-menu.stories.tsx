import {
  Copy01Icon,
  Delete02Icon,
  Edit02Icon,
  PlusSignIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./context-menu";

const meta = {
  title: "Overlays/Context Menu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A right-click (or long-press) context menu. Built on Base UI's ContextMenu",
          "primitive. It opens at the cursor position relative to the trigger area.",
          "",
          "Wrap the target area with `ContextMenuTrigger`. The trigger renders as a",
          "`div` by default and accepts any content.",
          "",
          "Supports items, separators, labels, checkboxes, radio groups, and",
          "nested sub-menus — the same API as `DropdownMenu`.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Right-click the dashed area to open the context menu. */
export const Playground: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex h-32 w-56 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
          Right-click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <HugeiconsIcon icon={Edit02Icon} />
          Edit
          <ContextMenuShortcut>⌘E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <HugeiconsIcon icon={Copy01Icon} />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <HugeiconsIcon icon={Delete02Icon} />
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/** File browser — right-click a file row to act on it. */
export const FileBrowser: Story = {
  render: () => (
    <div className="w-72 rounded-lg border">
      {[
        { name: "index.tsx", type: "file" },
        { name: "button.tsx", type: "file" },
        { name: "components/", type: "folder" },
      ].map((item) => (
        <ContextMenu key={item.name}>
          <ContextMenuTrigger>
            <div className="flex cursor-default items-center gap-2 px-3 py-2 text-sm hover:bg-accent">
              <span className="text-muted-foreground">
                {item.type === "folder" ? "📁" : "📄"}
              </span>
              {item.name}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <HugeiconsIcon icon={Edit02Icon} />
              Rename
              <ContextMenuShortcut>↵</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <HugeiconsIcon icon={Copy01Icon} />
              Duplicate
              <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <HugeiconsIcon icon={PlusSignIcon} />
                Move to
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>components/</ContextMenuItem>
                <ContextMenuItem>pages/</ContextMenuItem>
                <ContextMenuItem>lib/</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">
              <HugeiconsIcon icon={Delete02Icon} />
              Delete
              <ContextMenuShortcut>⌫</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  ),
};

/** Canvas / design surface — right-click to get object actions. */
export const DesignCanvas: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="relative flex h-48 w-80 items-center justify-center rounded-xl border bg-muted/30 text-muted-foreground text-sm">
          <div className="rounded-lg border bg-background px-6 py-4 shadow-sm text-foreground font-medium">
            Design element
          </div>
          <span className="absolute bottom-2 right-3 text-muted-foreground text-xs">
            Right-click to edit
          </span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>Object</ContextMenuLabel>
          <ContextMenuItem>
            <HugeiconsIcon icon={Edit02Icon} />
            Edit
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <HugeiconsIcon icon={Copy01Icon} />
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <HugeiconsIcon icon={Copy01Icon} />
            Paste in place
            <ContextMenuShortcut>⌘⇧V</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Arrange</ContextMenuLabel>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Layer order</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Bring to front</ContextMenuItem>
              <ContextMenuItem>Bring forward</ContextMenuItem>
              <ContextMenuItem>Send backward</ContextMenuItem>
              <ContextMenuItem>Send to back</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Align</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Left</ContextMenuItem>
              <ContextMenuItem>Center</ContextMenuItem>
              <ContextMenuItem>Right</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <HugeiconsIcon icon={Delete02Icon} />
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

/** With checkbox items — toggle view options on the context target. */
export const WithCheckboxes: Story = {
  render: () => {
    const [ruler, setRuler] = useState(true);
    const [grid, setGrid] = useState(false);
    const [snapping, setSnapping] = useState(true);

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex h-32 w-56 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
            Right-click for view options
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>View</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={ruler} onCheckedChange={setRuler}>
            Show ruler
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>
            Show grid
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={snapping}
            onCheckedChange={setSnapping}
          >
            Enable snapping
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <HugeiconsIcon icon={Settings01Icon} />
            View settings
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

/** With radio group — single-select among mutually exclusive options. */
export const WithRadioGroup: Story = {
  render: () => {
    const [zoom, setZoom] = useState("100");

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex h-32 w-56 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
            Right-click to set zoom
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Zoom level</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup onValueChange={setZoom} value={zoom}>
            <ContextMenuRadioItem value="50">50%</ContextMenuRadioItem>
            <ContextMenuRadioItem value="75">75%</ContextMenuRadioItem>
            <ContextMenuRadioItem value="100">100%</ContextMenuRadioItem>
            <ContextMenuRadioItem value="150">150%</ContextMenuRadioItem>
            <ContextMenuRadioItem value="200">200%</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};
