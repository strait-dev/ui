import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";

const meta = {
  title: "Layout/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Drag-to-resize panel groups built on `react-resizable-panels`.",
          "",
          "Three components compose a layout:",
          "- **`ResizablePanelGroup`** — the container; sets `orientation` (`horizontal` | `vertical`).",
          "- **`ResizablePanel`** — a single pane; accepts `defaultSize` (0-100 percent) and optional `minSize`.",
          "- **`ResizableHandle`** — the draggable divider between panels; pass `withHandle` to show a visible grip.",
          "",
          "Wrap the group in a fixed-size element so the handles have a usable drag surface.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      description: "Axis along which panels are laid out.",
      table: { defaultValue: { summary: "horizontal" } },
    },
  },
  args: {
    orientation: "horizontal",
  },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const panelClass =
  "flex h-full items-center justify-center rounded-md bg-muted text-muted-foreground text-sm font-medium";

/** Interactive playground — drag the handle to resize. */
export const Playground: Story = {
  render: (args) => (
    <div className="h-48 w-full rounded-lg border">
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className={panelClass}>Panel A</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className={panelClass}>Panel B</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/** Two panels side by side with a visible grip handle. */
export const HorizontalTwoPanels: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <div className="h-48 w-full rounded-lg border">
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={30} minSize={15}>
          <div className={panelClass}>Sidebar</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={30}>
          <div className={panelClass}>Main Content</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/** Three panels with two handles — editor-style three-column layout. */
export const HorizontalThreePanels: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <div className="h-48 w-full rounded-lg border">
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={20} minSize={10}>
          <div className={panelClass}>Explorer</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55} minSize={25}>
          <div className={panelClass}>Editor</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={10}>
          <div className={panelClass}>Preview</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/** Vertical split — drag the handle up and down. */
export const VerticalTwoPanels: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="h-64 w-full rounded-lg border">
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={60} minSize={20}>
          <div className={panelClass}>Top Panel</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <div className={panelClass}>Bottom Panel</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * A nested layout: a horizontal split containing a vertically split right pane.
 * Mimics a code editor with an explorer, editor area, and integrated terminal.
 */
export const NestedLayout: Story = {
  render: () => (
    <div className="h-72 w-full rounded-lg border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={22} minSize={12}>
          <div className={panelClass}>Explorer</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={78} minSize={40}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={65} minSize={25}>
              <div className={panelClass}>Editor</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35} minSize={15}>
              <div className={panelClass}>Terminal</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/** Handle without the visible grip — a plain bare divider. */
export const WithoutGrip: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <div className="h-48 w-full rounded-lg border">
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className={panelClass}>Left</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <div className={panelClass}>Right</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
