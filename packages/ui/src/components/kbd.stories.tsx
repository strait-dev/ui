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
        ].join("\n"),
      },
    },
  },
  args: { children: "⌘" },
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
