import {
  Edit02Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta = {
  title: "Overlays/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A modal dialog built on Base UI's Dialog primitive. It blocks interaction",
          "with the page behind a backdrop while open. Use it for focused tasks that",
          "require a user decision before proceeding.",
          "",
          "Compose it with `DialogTrigger`, `DialogContent`, `DialogHeader`,",
          "`DialogTitle`, `DialogDescription`, and `DialogFooter`. The close button",
          "is rendered automatically; pass `showCloseButton={false}` to suppress it.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    modal: {
      control: "boolean",
      description:
        "When `true` (default) the dialog traps focus and blocks outside interaction.",
      table: { defaultValue: { summary: "true" } },
    },
    defaultOpen: {
      control: "boolean",
      description: "Open state for uncontrolled usage.",
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — click the button to open the dialog. */
export const Playground: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>
            This is a description that gives context about what this dialog is
            for. It can span multiple lines.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="default">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** A basic triggered dialog with a title and description. */
export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome back</DialogTitle>
          <DialogDescription>
            You have been away for a while. Here is a quick summary of what
            changed while you were gone.
          </DialogDescription>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          3 new team members joined, 12 tasks were completed, and 2 projects
          reached their milestones.
        </p>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
};

/**
 * A dialog with a form inside. The footer contains a primary action and a
 * Cancel button that closes the dialog.
 */
export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="brand-solid">
            <HugeiconsIcon data-icon="inline-start" icon={Edit02Icon} />
            Edit profile
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your display name and bio. Changes will be visible to your
            team immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="dialog-name">
              Display name
            </label>
            <input
              className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
              defaultValue="Jane Smith"
              id="dialog-name"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="dialog-bio">
              Bio
            </label>
            <textarea
              className="resize-none rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
              defaultValue="Product designer at Strait."
              id="dialog-bio"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter showCloseButton>
          <Button variant="default">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Without the built-in close button — the footer manages dismissal instead. */
export const NoCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open</Button>} />
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Session expired</DialogTitle>
          <DialogDescription>
            Your session has expired. Please sign in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button variant="brand-solid">Sign in</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Settings dialog demonstrating a richer content layout. */
export const Settings: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger
        render={
          <Button aria-label="Open settings" size="icon" variant="ghost">
            <HugeiconsIcon icon={Settings01Icon} />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your workspace preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {[
            {
              label: "Email notifications",
              description: "Receive updates via email.",
            },
            {
              label: "Marketing emails",
              description: "News about features and offers.",
            },
            {
              label: "Weekly digest",
              description: "A summary of your week.",
            },
          ].map((item) => (
            <div
              className="flex items-center justify-between gap-4"
              key={item.label}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-sm">{item.label}</span>
                <span className="text-muted-foreground text-xs">
                  {item.description}
                </span>
              </div>
              <input
                aria-label={item.label}
                className="size-4 cursor-pointer"
                defaultChecked
                type="checkbox"
              />
            </div>
          ))}
        </div>
        <DialogFooter showCloseButton>
          <Button variant="default">Save preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** User profile dialog showing an icon trigger pattern. */
export const ProfilePreview: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger
        render={
          <Button aria-label="View profile" size="icon" variant="outline">
            <HugeiconsIcon icon={UserIcon} />
          </Button>
        }
      />
      <DialogContent>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <HugeiconsIcon className="size-5" icon={UserIcon} />
          </div>
          <div>
            <p className="font-medium text-sm">Jane Smith</p>
            <p className="text-muted-foreground text-xs">
              jane@example.com · Admin
            </p>
          </div>
        </div>
        <DialogHeader>
          <DialogDescription>
            Jane joined Strait 6 months ago and has completed 48 tasks across 3
            active projects.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="outline">Send message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
