import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Kbd, KbdGroup } from "./kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const meta = {
  title: "Actions/Kbd",
  component: Kbd,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Renders a keyboard key or shortcut. Use a single `Kbd` for one key",
          "and `KbdGroup` to combine several into a chord. `Kbd` adapts its",
          "colors when placed inside a `Button` or a `Tooltip`.",
          "",
          "The `size` prop (`'sm' | 'default' | 'lg'`) scales the key cap height,",
          "padding, and text. `'default'` is unchanged from before.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
      description: "Key cap height, padding, and text size.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: { children: "⌘", size: "default" },
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

/** A single key. */
export const Playground: Story = {};

/** Common individual keys. */
export const Keys: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⌃</Kbd>
      <Kbd>↵</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Tab</Kbd>
    </div>
  ),
};

/** Combine keys into a chord with `KbdGroup`. */
export const Combinations: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⌃</Kbd>
        <Kbd>`</Kbd>
      </KbdGroup>
    </div>
  ),
};

/** Inside a button, `Kbd` recolors to sit on the button surface. */
export const InButton: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="outline">
        Search
        <Kbd>⌘K</Kbd>
      </Button>
      <Button variant="default">
        Save
        <Kbd>⌘S</Kbd>
      </Button>
    </div>
  ),
};

/** Inside a tooltip, `Kbd` recolors against the dark popup. */
export const InTooltip: Story = {
  render: () => (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
        <TooltipContent>
          Open command palette
          <Kbd>⌘K</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

/** All three `size` values side by side for visual comparison. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="w-16 text-muted-foreground text-xs">sm</span>
        <KbdGroup>
          <Kbd size="sm">⌘</Kbd>
          <Kbd size="sm">K</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-16 text-muted-foreground text-xs">default</span>
        <KbdGroup>
          <Kbd size="default">⌘</Kbd>
          <Kbd size="default">K</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-3">
        <span className="w-16 text-muted-foreground text-xs">lg</span>
        <KbdGroup>
          <Kbd size="lg">⌘</Kbd>
          <Kbd size="lg">K</Kbd>
        </KbdGroup>
      </div>
    </div>
  ),
};
