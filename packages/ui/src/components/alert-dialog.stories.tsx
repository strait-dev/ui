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
          "The `size` prop on `AlertDialogContent` accepts `sm | default | lg | xl | full`",
          "and controls the max-width of the panel via `alertDialogContentVariants`.",
          "`default` matches the original `sm:max-w-sm` cap — non-breaking.",
          "`sm` stays centred and uses a two-column footer grid.",
          "",
          'Pass `accent="destructive"` on `AlertDialogHeader` to tint the title with',
          "`text-destructive` — useful for irreversible deletion flows.",
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

/**
 * All five `size` values on `AlertDialogContent` side by side for visual
 * comparison. Each dialog opens via its own trigger.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
        <AlertDialog key={size}>
          <AlertDialogTrigger
            render={<Button variant="outline">size="{size}"</Button>}
          />
          <AlertDialogContent size={size}>
            <AlertDialogHeader>
              <AlertDialogTitle>size="{size}" dialog</AlertDialogTitle>
              <AlertDialogDescription>
                This alert dialog uses the <strong>{size}</strong> size variant.
                Resize the viewport to see max-width behaviour.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  ),
};

/**
 * Destructive confirmation with `accent="destructive"` on the header — the
 * title is tinted with `text-destructive` automatically via a child selector.
 */
export const DestructiveConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive">
            <HugeiconsIcon data-icon="inline-start" icon={Delete02Icon} />
            Delete account
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader accent="destructive">
          <AlertDialogTitle>Permanently delete account?</AlertDialogTitle>
          <AlertDialogDescription>
            This is irreversible. All your data, projects, and billing history
            will be erased immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep account</AlertDialogCancel>
          <AlertDialogAction variant="destructive-solid">
            Yes, delete account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
