import {
  Delete02Icon,
  Logout01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";

const meta = {
  title: "Overlays/Alert Dialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A blocking confirmation dialog for destructive or irreversible actions.",
          "Unlike `Dialog`, it cannot be dismissed by clicking outside — the user",
          "must explicitly cancel or confirm.",
          "",
          "Compose it with `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`,",
          "`AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`,",
          "`AlertDialogAction` (the primary CTA), and `AlertDialogCancel`.",
          "",
          "The `size` prop on `AlertDialogContent` switches between `default` (wider,",
          "left-aligned on sm+) and `sm` (narrow, always centered with a 2-column footer).",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    defaultOpen: {
      control: "boolean",
      description: "Open state for uncontrolled usage.",
    },
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — click to open. */
export const Playground: Story = {
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger
        render={<Button variant="destructive">Delete item</Button>}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The item will be permanently deleted
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/** Basic delete confirmation — the most common pattern. */
export const DeleteConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive">
            <HugeiconsIcon data-icon="inline-start" icon={Delete02Icon} />
            Delete project
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project?</AlertDialogTitle>
          <AlertDialogDescription>
            All data associated with &ldquo;Acme Redesign&rdquo; will be
            permanently removed, including tasks, comments, and files. This
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep project</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid">
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/** Small size — centered layout with a 2-column footer. */
export const SmallSize: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="outline">Remove member</Button>}
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Jane Smith?</AlertDialogTitle>
          <AlertDialogDescription>
            Jane will lose access to this workspace and all shared projects.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid">
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/**
 * With a media slot — use `AlertDialogMedia` to place an icon or illustration
 * that gives visual context to the action.
 */
export const WithMedia: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive">
            <HugeiconsIcon data-icon="inline-start" icon={Logout01Icon} />
            Sign out
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <HugeiconsIcon icon={Logout01Icon} />
          </AlertDialogMedia>
          <AlertDialogTitle>Sign out?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be signed out of all active sessions on this device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay signed in</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid">
            Sign out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

/** Non-destructive confirmation — uses a neutral action button. */
export const NonDestructive: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="outline">
            <HugeiconsIcon data-icon="inline-start" icon={Settings01Icon} />
            Reset settings
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset to defaults?</AlertDialogTitle>
          <AlertDialogDescription>
            All custom settings will be reverted to their factory defaults. Your
            data will not be affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="default">
            Reset settings
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
