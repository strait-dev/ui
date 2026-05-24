import {
  Edit02Icon,
  PlusSignIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

const meta = {
  title: "Overlays/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A panel that slides in from a screen edge — similar to a `Dialog` but",
          "anchored to a side. Built on Base UI's Dialog primitive with `data-side`",
          "positioning.",
          "",
          "Pass `side` to `SheetContent` to control which edge it appears from.",
          "Available values: `right` (default), `left`, `top`, `bottom`.",
          "",
          "Compose with `SheetTrigger`, `SheetContent`, `SheetHeader`,",
          "`SheetTitle`, `SheetDescription`, `SheetFooter`, and `SheetClose`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    modal: {
      control: "boolean",
      description: "Block interaction with the rest of the page while open.",
      table: { defaultValue: { summary: "true" } },
    },
    defaultOpen: {
      control: "boolean",
      description: "Open state for uncontrolled usage.",
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — adjust controls and open the sheet. */
export const Playground: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline">Open sheet</Button>} />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Sheet title</SheetTitle>
          <SheetDescription>
            This is a description that provides context for the sheet.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 p-4">
          <p className="text-muted-foreground text-sm">Sheet content here.</p>
        </div>
        <SheetFooter>
          <Button variant="default">Save</Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/** Default right-side sheet — ideal for detail and edit panels. */
export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline">
            <HugeiconsIcon data-icon="inline-start" icon={Edit02Icon} />
            Edit details
          </Button>
        }
      />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit project</SheetTitle>
          <SheetDescription>
            Update the project name, description, and status.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 p-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="sheet-proj-name">
              Project name
            </label>
            <input
              className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
              defaultValue="Acme Redesign"
              id="sheet-proj-name"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              className="font-medium text-sm"
              htmlFor="sheet-proj-description"
            >
              Description
            </label>
            <textarea
              className="resize-none rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
              defaultValue="Redesigning the Acme dashboard for Q3."
              id="sheet-proj-description"
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="sheet-proj-status">
              Status
            </label>
            <select
              className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
              id="sheet-proj-status"
            >
              <option>Active</option>
              <option>On hold</option>
              <option>Completed</option>
            </select>
          </div>
        </div>
        <SheetFooter>
          <Button variant="brand-solid">Save changes</Button>
          <SheetClose render={<Button variant="outline" />}>Discard</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/** Left-side sheet — useful for secondary navigation panels. */
export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline">Open left panel</Button>}
      />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow down your search results.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 p-4">
          {["Status", "Assignee", "Priority", "Due date", "Label"].map(
            (filter) => (
              <div className="flex items-center justify-between" key={filter}>
                <span className="text-sm">{filter}</span>
                <input
                  aria-label={filter}
                  className="size-4 cursor-pointer"
                  type="checkbox"
                />
              </div>
            )
          )}
        </div>
        <SheetFooter>
          <Button variant="brand-solid">Apply filters</Button>
          <SheetClose render={<Button variant="outline" />}>
            Clear all
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/** Top sheet — appears from the top edge of the viewport. */
export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={<Button variant="outline">Open top panel</Button>}
      />
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Your latest updates and alerts.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 p-4">
          {[
            "Jane commented on Task #42",
            "Build succeeded — v1.4.2",
            "3 tasks due today",
          ].map((note) => (
            <p className="rounded-md bg-muted/50 px-3 py-2 text-sm" key={note}>
              {note}
            </p>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  ),
};

/** Settings panel — a realistic composition with grouped controls. */
export const SettingsPanel: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={
          <Button aria-label="Open settings" size="icon" variant="ghost">
            <HugeiconsIcon icon={Settings01Icon} />
          </Button>
        }
      />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Configure your account and workspace preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-5 p-4">
          <section className="flex flex-col gap-2">
            <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Appearance
            </h3>
            {[
              { label: "Use system theme", checked: true },
              { label: "Reduce motion", checked: false },
              { label: "High contrast mode", checked: false },
            ].map((item) => (
              <label
                className="flex cursor-pointer items-center justify-between"
                key={item.label}
              >
                <span className="text-sm">{item.label}</span>
                <input
                  className="size-4"
                  defaultChecked={item.checked}
                  type="checkbox"
                />
              </label>
            ))}
          </section>
          <section className="flex flex-col gap-2">
            <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Notifications
            </h3>
            {[
              { label: "Email updates", checked: true },
              { label: "Push notifications", checked: true },
              { label: "Weekly digest", checked: false },
            ].map((item) => (
              <label
                className="flex cursor-pointer items-center justify-between"
                key={item.label}
              >
                <span className="text-sm">{item.label}</span>
                <input
                  className="size-4"
                  defaultChecked={item.checked}
                  type="checkbox"
                />
              </label>
            ))}
          </section>
        </div>
        <SheetFooter>
          <Button variant="default">Save preferences</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/** Invite members sheet — demonstrates a form composition inside a sheet. */
export const InviteMembers: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="brand-solid">
            <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
            Invite members
          </Button>
        }
      />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Invite team members</SheetTitle>
          <SheetDescription>
            Send invitations to your teammates. They will receive an email with
            a link to join.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 p-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="sheet-invite-email">
              Email addresses
            </label>
            <textarea
              className="resize-none rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
              id="sheet-invite-email"
              placeholder="jane@example.com, john@example.com"
              rows={3}
            />
            <p className="text-muted-foreground text-xs">
              Separate multiple emails with a comma.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="sheet-invite-role">
              Role
            </label>
            <select
              className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
              id="sheet-invite-role"
            >
              <option>Viewer</option>
              <option>Editor</option>
              <option>Admin</option>
            </select>
          </div>
        </div>
        <SheetFooter>
          <Button variant="brand-solid">Send invitations</Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
