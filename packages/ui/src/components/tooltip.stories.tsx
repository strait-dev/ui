import {
  Copy01Icon,
  Delete02Icon,
  Edit02Icon,
  MoreHorizontalIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Kbd } from "./kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A brief text label that appears when hovering or focusing a trigger.",
          "Built on Base UI's Tooltip primitive. Always wrap usage in `TooltipProvider`",
          "to configure the shared delay.",
          "",
          "Compose with `TooltipTrigger` (pass the element via its `render` prop),",
          "`TooltipContent`, and optionally `Kbd` inside the content to show a",
          "keyboard shortcut.",
          "",
          "Placement is controlled by `side` and `align` on `TooltipContent`.",
        ].join("\n"),
      },
    },
  },
  decorators: [
    (Story) => (
      <TooltipProvider delay={200}>
        <Story />
      </TooltipProvider>
    ),
  ],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Hover or focus the button to see the tooltip. */
export const Playground: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipContent>This is a tooltip</TooltipContent>
    </Tooltip>
  ),
};

/** The most common pattern: a label for an icon-only button. */
export const IconButton: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button aria-label="Edit" size="icon" variant="ghost">
              <HugeiconsIcon icon={Edit02Icon} />
            </Button>
          }
        />
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button aria-label="Copy" size="icon" variant="ghost">
              <HugeiconsIcon icon={Copy01Icon} />
            </Button>
          }
        />
        <TooltipContent>Copy to clipboard</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button aria-label="Settings" size="icon" variant="ghost">
              <HugeiconsIcon icon={Settings01Icon} />
            </Button>
          }
        />
        <TooltipContent>Open settings</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button aria-label="Delete" size="icon" variant="destructive">
              <HugeiconsIcon icon={Delete02Icon} />
            </Button>
          }
        />
        <TooltipContent>Delete permanently</TooltipContent>
      </Tooltip>
    </div>
  ),
};

/** A `Kbd` inside `TooltipContent` surfaces the keyboard shortcut. */
export const WithShortcut: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Save</Button>} />
        <TooltipContent>
          Save document
          <Kbd>⌘S</Kbd>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost">Search</Button>} />
        <TooltipContent>
          Open search
          <Kbd>⌘K</Kbd>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button aria-label="More options" size="icon" variant="outline">
              <HugeiconsIcon icon={MoreHorizontalIcon} />
            </Button>
          }
        />
        <TooltipContent>
          More options
          <Kbd>⌥↵</Kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

/** Side placements — see the arrow reposition for each. */
export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger
            render={
              <Button className="w-full" size="sm" variant="outline">
                {side}
              </Button>
            }
          />
          <TooltipContent side={side}>Placed on {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

/** Align variations on the bottom side. */
export const Alignment: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {(["start", "center", "end"] as const).map((align) => (
        <Tooltip key={align}>
          <TooltipTrigger
            render={
              <Button size="sm" variant="outline">
                {align}
              </Button>
            }
          />
          <TooltipContent align={align} side="bottom">
            align="{align}"
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

/** Tooltip on a disabled button — wrap in a `span` so pointer events fire. */
export const OnDisabledButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="inline-flex">
            <Button disabled variant="outline">
              Publish
            </Button>
          </span>
        }
      />
      <TooltipContent>
        Complete all required fields before publishing.
      </TooltipContent>
    </Tooltip>
  ),
};

/** A toolbar of icon buttons — each has a descriptive tooltip. */
export const Toolbar: Story = {
  render: () => (
    <div className="flex items-center gap-1 rounded-lg border bg-background p-1 shadow-sm">
      {[
        { icon: Edit02Icon, label: "Edit", shortcut: "⌘E" },
        { icon: Copy01Icon, label: "Duplicate", shortcut: "⌘D" },
        { icon: Settings01Icon, label: "Settings", shortcut: "⌘," },
        { icon: Delete02Icon, label: "Delete", shortcut: "⌫" },
      ].map(({ icon, label, shortcut }) => (
        <Tooltip key={label}>
          <TooltipTrigger
            render={
              <Button aria-label={label} size="icon-sm" variant="ghost">
                <HugeiconsIcon icon={icon} />
              </Button>
            }
          />
          <TooltipContent>
            {label}
            <Kbd>{shortcut}</Kbd>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
