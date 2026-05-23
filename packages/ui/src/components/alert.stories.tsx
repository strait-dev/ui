import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  MultiplicationSignCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

type AlertVariant = NonNullable<ComponentProps<typeof Alert>["variant"]>;

const variantOptions: AlertVariant[] = ["default", "destructive"];

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Inline contextual messages that draw attention to important information.",
          "Alerts support two variants — `default` (neutral) and `destructive` — and",
          "compose with an optional leading icon, `AlertTitle`, `AlertDescription`,",
          "and an `AlertAction` slot for a dismiss/action button.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: variantOptions,
      description: "Visual intent of the alert.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: {
    variant: "default",
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — pick a variant and adjust content via controls. */
export const Playground: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <HugeiconsIcon icon={InformationCircleIcon} />
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

/** Both variants side by side: `default` and `destructive`. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-lg w-full">
      <Alert {...args} variant="default">
        <HugeiconsIcon icon={InformationCircleIcon} />
        <AlertTitle>Update available</AlertTitle>
        <AlertDescription>
          A new version of the application is ready to install.
        </AlertDescription>
      </Alert>

      <Alert {...args} variant="destructive">
        <HugeiconsIcon icon={MultiplicationSignCircleIcon} />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          Your session has expired. Please sign in again to continue.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

/** Success and warning semantics implemented via icon colour overrides. */
export const WithIntents: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-lg w-full">
      <Alert {...args} variant="default">
        <HugeiconsIcon
          className="text-emerald-500"
          icon={CheckmarkCircle02Icon}
        />
        <AlertTitle>Saved successfully</AlertTitle>
        <AlertDescription>Your changes have been published.</AlertDescription>
      </Alert>

      <Alert {...args} variant="default">
        <HugeiconsIcon className="text-amber-500" icon={Alert02Icon} />
        <AlertTitle>Low disk space</AlertTitle>
        <AlertDescription>
          You have less than 500 MB remaining. Consider cleaning up old files.
        </AlertDescription>
      </Alert>

      <Alert {...args} variant="default">
        <HugeiconsIcon className="text-blue-500" icon={InformationCircleIcon} />
        <AlertTitle>Maintenance scheduled</AlertTitle>
        <AlertDescription>
          The system will be down for maintenance on Saturday at 2 AM UTC.
        </AlertDescription>
      </Alert>

      <Alert {...args} variant="destructive">
        <HugeiconsIcon icon={MultiplicationSignCircleIcon} />
        <AlertTitle>Action required</AlertTitle>
        <AlertDescription>
          Your payment method has expired. Update it to keep your subscription
          active.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

/** Alert without a leading icon — text-only layout. */
export const WithoutIcon: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <AlertTitle>Note</AlertTitle>
      <AlertDescription>
        This feature is available on the Pro plan and above.
      </AlertDescription>
    </Alert>
  ),
};

/** Title only — no description. */
export const TitleOnly: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <HugeiconsIcon icon={InformationCircleIcon} />
      <AlertTitle>Read-only mode enabled</AlertTitle>
    </Alert>
  ),
};

/** With an `AlertAction` button in the top-right corner. */
export const WithAction: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-lg w-full">
      <Alert {...args} variant="default">
        <HugeiconsIcon icon={InformationCircleIcon} />
        <AlertTitle>New feature available</AlertTitle>
        <AlertDescription>
          Try our new AI-powered search experience.
        </AlertDescription>
        <AlertAction>
          <Button size="xs" variant="outline">
            Try it
          </Button>
        </AlertAction>
      </Alert>

      <Alert {...args} variant="destructive">
        <HugeiconsIcon icon={MultiplicationSignCircleIcon} />
        <AlertTitle>Verification failed</AlertTitle>
        <AlertDescription>
          We could not verify your email address.
        </AlertDescription>
        <AlertAction>
          <Button size="xs" variant="outline">
            Resend
          </Button>
        </AlertAction>
      </Alert>
    </div>
  ),
};
