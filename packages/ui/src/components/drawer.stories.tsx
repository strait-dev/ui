import {
  ArrowRightIcon,
  PlusSignIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A bottom sheet / side drawer built on the [Vaul](https://vaul.emilkowal.ski/)",
          "library. It slides in from any edge and snaps to defined size ratios.",
          "",
          "The default direction is `bottom`. Pass `direction` to the `Drawer` root",
          "to slide in from `top`, `left`, or `right`. A drag-handle is shown",
          "automatically for `bottom`-direction drawers.",
          "",
          "Compose with `DrawerTrigger`, `DrawerContent`, `DrawerHeader`,",
          "`DrawerTitle`, `DrawerDescription`, `DrawerFooter`, and `DrawerClose`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["bottom", "top", "left", "right"],
      description: "Edge the drawer slides in from.",
      table: { defaultValue: { summary: "bottom" } },
    },
    modal: {
      control: "boolean",
      description: "Whether to block interaction with the rest of the page.",
      table: { defaultValue: { summary: "true" } },
    },
  },
  args: {
    direction: "bottom",
  },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — use the controls to change direction. */
export const Playground: Story = {
  render: (args) => (
    <Drawer {...args}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>
            This is a description that provides context for the drawer.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2">
          <p className="text-muted-foreground text-sm">
            Drawer content goes here.
          </p>
        </div>
        <DrawerFooter>
          <Button variant="default">Confirm</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/** Default bottom-sheet drawer — great for mobile-style interactions. */
export const Bottom: Story = {
  render: () => (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button variant="outline">
          Open bottom drawer
          <HugeiconsIcon data-icon="inline-end" icon={ArrowRightIcon} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Quick actions</DrawerTitle>
          <DrawerDescription>
            Choose an action to perform on the selected items.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-1 px-4">
          {["Rename", "Duplicate", "Move to folder", "Archive"].map((label) => (
            <button
              className="rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
              key={label}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/** Right-side drawer, useful for detail panels and secondary flows. */
export const Right: Story = {
  render: () => (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <HugeiconsIcon data-icon="inline-start" icon={Settings01Icon} />
          Settings panel
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Workspace settings</DrawerTitle>
          <DrawerDescription>
            Adjust your workspace preferences below.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 p-4">
          {[
            { label: "Show sidebar labels", defaultChecked: true },
            { label: "Enable keyboard shortcuts", defaultChecked: true },
            { label: "Compact mode", defaultChecked: false },
          ].map((item) => (
            <label
              className="flex cursor-pointer items-center justify-between gap-4"
              key={item.label}
            >
              <span className="text-sm">{item.label}</span>
              <input
                className="size-4"
                defaultChecked={item.defaultChecked}
                type="checkbox"
              />
            </label>
          ))}
        </div>
        <DrawerFooter>
          <Button variant="default">Save changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Discard</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/** Left-side drawer — useful for navigation panels. */
export const Left: Story = {
  render: () => (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">Open navigation</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col gap-1 p-4">
          {["Dashboard", "Projects", "Tasks", "Reports", "Team"].map((item) => (
            <button
              className="rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-accent"
              key={item}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button className="w-full" variant="outline">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/** Drawer with a form — a richer content composition. */
export const WithForm: Story = {
  render: () => (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button variant="brand-solid">
          <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
          New task
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create task</DrawerTitle>
          <DrawerDescription>
            Add a new task to the current project.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-3 px-4 py-2">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="drawer-task-name">
              Task name
            </label>
            <input
              className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
              id="drawer-task-name"
              placeholder="e.g. Design the onboarding screens"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              className="font-medium text-sm"
              htmlFor="drawer-task-priority"
            >
              Priority
            </label>
            <select
              className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
              id="drawer-task-priority"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
        </div>
        <DrawerFooter>
          <Button variant="brand-solid">Create task</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
