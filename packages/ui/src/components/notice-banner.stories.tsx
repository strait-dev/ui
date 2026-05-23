import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { NoticeBanner, NoticeBannerAction } from "./notice-banner";

type NoticeBannerVariant = NonNullable<
  React.ComponentProps<typeof NoticeBanner>["variant"]
>;

const variantOptions: NoticeBannerVariant[] = [
  "info",
  "success",
  "warning",
  "destructive",
];

const meta: Meta<typeof NoticeBanner> = {
  title: "Feedback/Notice Banner",
  component: NoticeBanner,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A variant-driven, optionally dismissible inline banner for status",
          "messages and contextual prompts.",
          "",
          "Use it to consolidate billing nudges, quota warnings, onboarding hints,",
          "or any inline call-to-action. Compose with **NoticeBannerAction** for",
          "buttons and links in the trailing slot.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: variantOptions,
      description: "Visual intent of the banner.",
      table: { defaultValue: { summary: "info" } },
    },
    title: {
      control: "text",
      description: "Optional bold heading above the description.",
    },
    dismissible: {
      control: "boolean",
      description: "Shows a dismiss button when true.",
    },
    children: {
      control: "text",
      description: "Description text.",
    },
  },
  args: {
    variant: "info",
    children: "This is a notice banner.",
    dismissible: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — mix any variant, title, and dismiss. */
export const Playground: Story = {};

/* ------------------------------------------------------------------ */
/* All Variants                                                         */
/* ------------------------------------------------------------------ */

/** All four intent variants at a glance. */
export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {variantOptions.map((variant) => (
        <NoticeBanner
          {...args}
          key={variant}
          title={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} banner`}
          variant={variant}
        >
          This is a {variant} message.
        </NoticeBanner>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* With title                                                           */
/* ------------------------------------------------------------------ */

/** Banner with a bold title and supporting description. */
export const WithTitle: Story = {
  args: {
    variant: "info",
    title: "New feature available",
    children: "You can now export your data as CSV from the settings page.",
  },
};

/* ------------------------------------------------------------------ */
/* Dismissible                                                          */
/* ------------------------------------------------------------------ */

/** All variants dismissible. Re-render the story to reset the state. */
export const Dismissible: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {variantOptions.map((variant) => (
        <NoticeBanner
          {...args}
          dismissible
          key={variant}
          title={`${variant.charAt(0).toUpperCase()}${variant.slice(1)}`}
          variant={variant}
        >
          Click the × to dismiss this banner.
        </NoticeBanner>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* With Action                                                          */
/* ------------------------------------------------------------------ */

/** Banner with a trailing action button. */
export const WithAction: Story = {
  args: {
    variant: "warning",
    title: "Free plan limit reached",
    children: "You've used 90 % of your monthly quota.",
    action: (
      <NoticeBannerAction>
        <Button size="sm" variant="outline">
          Upgrade
        </Button>
      </NoticeBannerAction>
    ),
  },
};

/* ------------------------------------------------------------------ */
/* No icon                                                              */
/* ------------------------------------------------------------------ */

/** Suppress the leading icon with `icon={false}`. */
export const NoIcon: Story = {
  args: {
    variant: "success",
    icon: false,
    title: "Payment received",
    children: "Your invoice has been paid successfully.",
  },
};

/* ------------------------------------------------------------------ */
/* Billing-style composite                                              */
/* ------------------------------------------------------------------ */

/** Real-world billing banner with title, description, and action. */
export const BillingComposite: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <NoticeBanner
        action={
          <NoticeBannerAction>
            <Button size="sm">Add card</Button>
          </NoticeBannerAction>
        }
        dismissible
        title="Payment method required"
        variant="destructive"
      >
        Your trial ends in 3 days. Add a payment method to continue.
      </NoticeBanner>
      <NoticeBanner
        action={
          <NoticeBannerAction>
            <Button size="sm" variant="outline">
              View usage
            </Button>
          </NoticeBannerAction>
        }
        title="Approaching limit"
        variant="warning"
      >
        You've used 80 % of your API quota for this month.
      </NoticeBanner>
      <NoticeBanner dismissible title="Deployed successfully" variant="success">
        Your changes are live at app.example.com.
      </NoticeBanner>
    </div>
  ),
};
