import {
  Copy01Icon,
  Delete02Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./menubar";

const meta: Meta<typeof Menubar> = {
  title: "Navigation/Menubar",
  component: Menubar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A desktop-style menu bar composed of labelled menus.",
          "",
          "Built on **Base UI** `@base-ui/react/menubar` + `@base-ui/react/menu`.",
          "",
          "Composition pattern:",
          "```tsx",
          "<Menubar>",
          "  <MenubarMenu>",
          "    <MenubarTrigger>File</MenubarTrigger>",
          "    <MenubarContent>",
          "      <MenubarItem>New</MenubarItem>",
          "    </MenubarContent>",
          "  </MenubarMenu>",
          "</Menubar>",
          "```",
          "",
          "`MenubarMenu` delegates to `DropdownMenu` internally. `MenubarCheckboxItem`",
          "and `MenubarRadioItem` use `MenuPrimitive.CheckboxItem` / `RadioItem` directly.",
        ].join("\n"),
      },
    },
  },
  argTypes: {},
  args: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — click a menu label to open it. */
export const Playground: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab
            <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Open…
            <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Close
            <MenubarShortcut>⌘W</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo
            <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo
            <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <HugeiconsIcon icon={Copy01Icon} />
            Copy
            <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Paste
            <MenubarShortcut>⌘V</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Zoom In</MenubarItem>
          <MenubarItem>Zoom Out</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Full Screen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/** Menu with labelled groups. */
export const WithGroups: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Text</MenubarLabel>
          <MenubarGroup>
            <MenubarItem>Bold</MenubarItem>
            <MenubarItem>Italic</MenubarItem>
            <MenubarItem>Underline</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarLabel>Alignment</MenubarLabel>
          <MenubarGroup>
            <MenubarItem>Left</MenubarItem>
            <MenubarItem>Center</MenubarItem>
            <MenubarItem>Right</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/** Checkbox items for toggling features. */
export const WithCheckboxItems: Story = {
  render: () => {
    const [showRuler, setShowRuler] = useState(true);
    const [showGrid, setShowGrid] = useState(false);
    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Show</MenubarLabel>
            <MenubarCheckboxItem
              checked={showRuler}
              onCheckedChange={(v) => setShowRuler(!!v)}
            >
              Ruler
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showGrid}
              onCheckedChange={(v) => setShowGrid(!!v)}
            >
              Grid
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
};

/** Radio items for mutually exclusive choices. */
export const WithRadioItems: Story = {
  render: () => {
    const [zoom, setZoom] = useState("100");
    return (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Zoom</MenubarTrigger>
          <MenubarContent>
            <MenubarLabel>Level</MenubarLabel>
            <MenubarRadioGroup
              onValueChange={(v) => setZoom(v ?? zoom)}
              value={zoom}
            >
              {["50", "75", "100", "150", "200"].map((level) => (
                <MenubarRadioItem key={level} value={level}>
                  {level}%
                </MenubarRadioItem>
              ))}
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  },
};

/** Nested sub-menu. */
export const WithSubMenu: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Paste Special</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Paste Values</MenubarItem>
              <MenubarItem>Paste Formatting</MenubarItem>
              <MenubarItem>Paste as Plain Text</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <HugeiconsIcon icon={Delete02Icon} />
            Delete
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

/** Full application-style menubar. */
export const AppMenubar: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New<MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Open<MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Save<MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Save As…</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo<MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo<MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Find &amp; Replace</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <HugeiconsIcon icon={Settings01Icon} />
            Preferences
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>About</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
