import {
  Copy01Icon,
  Edit02Icon,
  PlusSignIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";

const meta = {
  title: "Overlays/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A non-modal floating panel anchored to a trigger element. Built on",
          "Base UI's Popover primitive with built-in portal and positioner.",
          "",
          "Position is controlled by `side` and `align` props on `PopoverContent`.",
          "Offsets can be tuned with `sideOffset` and `alignOffset`.",
          "",
          "Unlike `Dialog`, the popover closes when you click outside or press Escape.",
          "Use it for supplementary information, quick-edit forms, or filter panels.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Open state for uncontrolled usage.",
    },
    modal: {
      control: "boolean",
      description: "When true, traps focus inside the popover.",
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — click the button to open the popover. */
export const Playground: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger
        render={<Button variant="outline">Open popover</Button>}
      />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Popover title</PopoverTitle>
          <PopoverDescription>
            Supplementary information or a quick action.
          </PopoverDescription>
        </PopoverHeader>
        <p className="text-muted-foreground text-sm">
          Popover content can include any React nodes.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

/** Basic popover with a header and body text. */
export const Basic: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={<Button variant="outline">What is this?</Button>}
      />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Strait Spaces</PopoverTitle>
          <PopoverDescription>
            Spaces organise your team's work into focused areas. Each space has
            its own tasks, docs, and settings.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

/** Side and align variations. Open each to see the placement change. */
export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(
        [
          { side: "top", align: "center", label: "top / center" },
          { side: "bottom", align: "center", label: "bottom / center" },
          { side: "left", align: "center", label: "left / center" },
          { side: "right", align: "center", label: "right / center" },
          { side: "bottom", align: "start", label: "bottom / start" },
          { side: "bottom", align: "end", label: "bottom / end" },
        ] as const
      ).map(({ side, align, label }) => (
        <Popover key={label}>
          <PopoverTrigger
            render={
              <Button className="w-full" size="sm" variant="outline">
                {label}
              </Button>
            }
          />
          <PopoverContent align={align} side={side}>
            <PopoverHeader>
              <PopoverTitle>Placed {label}</PopoverTitle>
            </PopoverHeader>
            <p className="text-muted-foreground text-xs">
              side="{side}" align="{align}"
            </p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

/** A quick-edit form inside a popover. */
export const QuickEdit: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline">
            <HugeiconsIcon data-icon="inline-start" icon={Edit02Icon} />
            Quick edit
          </Button>
        }
      />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Rename project</PopoverTitle>
          <PopoverDescription>
            Enter a new name for this project.
          </PopoverDescription>
        </PopoverHeader>
        <div className="flex flex-col gap-2">
          <input
            aria-label="Project name"
            className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
            defaultValue="Acme Redesign"
            type="text"
          />
          <div className="flex gap-2">
            <Button className="flex-1" size="sm" variant="default">
              Save
            </Button>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/** Filter panel pattern — a popover with grouped checkbox controls. */
export const FilterPanel: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline">
            <HugeiconsIcon data-icon="inline-start" icon={Settings01Icon} />
            Filters
          </Button>
        }
      />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Filter tasks</PopoverTitle>
        </PopoverHeader>
        <div className="flex flex-col gap-1.5">
          {["My tasks", "High priority", "Due this week", "Unassigned"].map(
            (filter) => (
              <label
                className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 text-sm hover:bg-accent"
                key={filter}
              >
                <input className="size-3.5" type="checkbox" />
                {filter}
              </label>
            )
          )}
        </div>
        <div className="flex gap-2 pt-1">
          <Button className="flex-1" size="sm" variant="default">
            Apply
          </Button>
          <Button size="sm" variant="ghost">
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/** Invite-member popover — a richer form composition. */
export const InvitePopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="brand-solid">
            <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
            Invite
          </Button>
        }
      />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Invite to workspace</PopoverTitle>
          <PopoverDescription>
            Enter an email to send an invitation link.
          </PopoverDescription>
        </PopoverHeader>
        <div className="flex flex-col gap-2">
          <input
            aria-label="Email address"
            className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
            placeholder="teammate@example.com"
            type="email"
          />
          <select
            aria-label="Role"
            className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
          >
            <option>Viewer</option>
            <option>Editor</option>
            <option>Admin</option>
          </select>
          <Button size="sm" variant="brand-solid">
            Send invite
          </Button>
        </div>
        <div className="border-t pt-2">
          <p className="mb-1 text-muted-foreground text-xs">
            Or share an invite link
          </p>
          <Button className="w-full" size="sm" variant="outline">
            <HugeiconsIcon data-icon="inline-start" icon={Copy01Icon} />
            Copy link
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
