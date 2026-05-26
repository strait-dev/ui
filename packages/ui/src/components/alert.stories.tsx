import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CreditCardIcon,
  InformationCircleIcon,
  MultiplicationSignCircleIcon,
  RocketIcon,
  ServerStack02Icon,
  SparklesIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";
import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";

type AlertVariant = NonNullable<ComponentProps<typeof Alert>["variant"]>;

const variantOptions: AlertVariant[] = [
  "default",
  "info",
  "success",
  "warning",
  "destructive",
  "invert",
];

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
          "Alerts support six variants — `default` (neutral) plus the `info`,",
          "`success`, `warning`, and `destructive` intents, each tinting the border,",
          "background, text, and icon with the matching semantic token, and `invert`",
          "for a high-contrast solid surface. Compose with an optional leading icon,",
          "`AlertTitle`, `AlertDescription`, and an `AlertAction` slot for a",
          "dismiss/action button.",
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

/** All five variants side by side, each with its matching default icon. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <Alert {...args} variant="default">
        <HugeiconsIcon icon={InformationCircleIcon} />
        <AlertTitle>Update available</AlertTitle>
        <AlertDescription>
          A new version of the application is ready to install.
        </AlertDescription>
      </Alert>

      <Alert {...args} variant="info">
        <HugeiconsIcon icon={InformationCircleIcon} />
        <AlertTitle>Maintenance scheduled</AlertTitle>
        <AlertDescription>
          The system will be down for maintenance on Saturday at 2 AM UTC.
        </AlertDescription>
      </Alert>

      <Alert {...args} variant="success">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} />
        <AlertTitle>Saved successfully</AlertTitle>
        <AlertDescription>Your changes have been published.</AlertDescription>
      </Alert>

      <Alert {...args} variant="warning">
        <HugeiconsIcon icon={Alert02Icon} />
        <AlertTitle>Low disk space</AlertTitle>
        <AlertDescription>
          You have less than 500 MB remaining. Consider cleaning up old files.
        </AlertDescription>
      </Alert>

      <Alert {...args} variant="destructive">
        <HugeiconsIcon icon={MultiplicationSignCircleIcon} />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          Your session has expired. Please sign in again to continue.
        </AlertDescription>
      </Alert>

      <Alert {...args} variant="invert">
        <HugeiconsIcon icon={InformationCircleIcon} />
        <AlertTitle>Now in beta</AlertTitle>
        <AlertDescription>
          Workspace insights are rolling out to all teams this week.
        </AlertDescription>
      </Alert>
    </div>
  ),
};

/**
 * Invert variant — a high-contrast solid surface for the highest-emphasis
 * announcements. Set `variant="invert"`.
 */
export const Invert: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg" variant="invert">
      <HugeiconsIcon icon={InformationCircleIcon} />
      <AlertTitle>Now in beta</AlertTitle>
      <AlertDescription>
        Workspace insights are rolling out to all teams this week.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline">
          Learn more
        </Button>
      </AlertAction>
    </Alert>
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
    <div className="flex w-full max-w-lg flex-col gap-4">
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

/**
 * Dismiss button — drop an icon `Button` into `AlertAction` to let users
 * close the banner. Wire the click to your own state.
 */
export const WithCloseButton: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg" variant="info">
      <HugeiconsIcon icon={InformationCircleIcon} />
      <AlertTitle>Your changes have been saved</AlertTitle>
      <AlertDescription>
        We've published the latest revision to your team.
      </AlertDescription>
      <AlertAction>
        <Button aria-label="Dismiss" size="icon-xs" variant="ghost">
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
        </Button>
      </AlertAction>
    </Alert>
  ),
};

/**
 * Pair actions — combine a primary call-to-action with a dismiss button
 * inside `AlertAction` for paired decisions.
 */
export const WithMultipleActions: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg" variant="warning">
      <HugeiconsIcon icon={Alert02Icon} />
      <AlertTitle>Unsaved changes</AlertTitle>
      <AlertDescription>
        You have edits that haven't been published yet.
      </AlertDescription>
      <AlertAction>
        <div className="flex items-center gap-1">
          <Button size="xs" variant="ghost">
            Discard
          </Button>
          <Button size="xs">Save</Button>
        </div>
      </AlertAction>
    </Alert>
  ),
};

/**
 * Urgent billing — destructive intent paired with a primary recovery action.
 * Use this pattern for payment failures or account-blocking states.
 */
export const UrgentBilling: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg" variant="destructive">
      <HugeiconsIcon icon={CreditCardIcon} />
      <AlertTitle>Your payment method failed</AlertTitle>
      <AlertDescription>
        We could not process your subscription renewal. Update your card before
        June 1 to avoid losing access.
      </AlertDescription>
      <AlertAction>
        <Button size="xs">Update card</Button>
      </AlertAction>
    </Alert>
  ),
};

/**
 * Service status — neutral default surface with a success indicator badge in
 * the title. Useful for incident pages and status banners.
 */
export const ServiceStatus: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg" variant="default">
      <HugeiconsIcon icon={ServerStack02Icon} />
      <AlertTitle>
        <span className="flex items-center gap-2">
          All systems operational
          <Badge dot size="xs" variant="success-light">
            Live
          </Badge>
        </span>
      </AlertTitle>
      <AlertDescription>
        Updated 2 minutes ago. No active incidents across API, dashboard, or
        webhooks.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline">
          View status page
        </Button>
      </AlertAction>
    </Alert>
  ),
};

/**
 * Feature discovery — invert surface with a sparkles icon and a CTA to
 * announce new product capabilities.
 */
export const FeatureDiscovery: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg" variant="invert">
      <HugeiconsIcon icon={SparklesIcon} />
      <AlertTitle>Introducing AI-powered insights</AlertTitle>
      <AlertDescription>
        Get smart summaries and recommendations across your workspace. Try it
        free for 14 days.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline">
          Try it
        </Button>
      </AlertAction>
    </Alert>
  ),
};

/**
 * Onboarding nudge — info intent with a rocket icon to encourage new users
 * through their first-time setup checklist.
 */
export const OnboardingNudge: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg" variant="info">
      <HugeiconsIcon icon={RocketIcon} />
      <AlertTitle>Finish setting up your workspace</AlertTitle>
      <AlertDescription>
        You're 3 steps away from going live. Invite your team, configure
        billing, and connect your first integration.
      </AlertDescription>
      <AlertAction>
        <Button size="xs">Continue setup</Button>
      </AlertAction>
    </Alert>
  ),
};

/**
 * Multi-paragraph message — `AlertDescription` accepts rich text with
 * `<p>` tags. Paragraphs gain bottom spacing via the description's own
 * typography rules.
 */
export const ExtendedMessage: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg" variant="warning">
      <HugeiconsIcon icon={Alert02Icon} />
      <AlertTitle>Maintenance window upcoming</AlertTitle>
      <AlertDescription>
        <p>
          The platform will be unavailable for ~15 minutes on Saturday, June 7
          between 02:00 and 02:15 UTC while we ship a database migration.
        </p>
        <p>
          API requests during the window will receive a 503; please retry with
          an exponential backoff. We'll post updates to{" "}
          <a href="https://status.example.com">status.example.com</a>.
        </p>
      </AlertDescription>
    </Alert>
  ),
};

/**
 * User message — drop an `Avatar` into the icon slot instead of an SVG to
 * frame the alert as a notification from another person.
 */
export const UserMessage: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <Avatar size="sm">
        <AvatarFallback>MR</AvatarFallback>
      </Avatar>
      <AlertTitle>Maria mentioned you in “Q3 launch plan”</AlertTitle>
      <AlertDescription>
        “Can you review the kickoff doc before Thursday? Specifically the
        rollout timeline.”
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline">
          Open
        </Button>
      </AlertAction>
    </Alert>
  ),
};

/**
 * Account verified — success intent acknowledging a completed long-form
 * action like onboarding completion or identity verification.
 */
export const AccountVerified: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-lg" variant="success">
      <HugeiconsIcon icon={UserCircleIcon} />
      <AlertTitle>Identity verified</AlertTitle>
      <AlertDescription>
        Thanks for confirming your details — every feature is now unlocked on
        your account.
      </AlertDescription>
    </Alert>
  ),
};
