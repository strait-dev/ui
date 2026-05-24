import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Banner,
  BannerActions,
  BannerClose,
  BannerContent,
  BannerDescription,
  BannerIcon,
  BannerTitle,
  NoticeBanner,
  NoticeBannerAction,
} from "./banner";
import { Button } from "./button";

type BannerVariant = NonNullable<
  React.ComponentProps<typeof Banner>["variant"]
>;
type BannerLayout = NonNullable<React.ComponentProps<typeof Banner>["layout"]>;

const variantOptions: BannerVariant[] = [
  "info",
  "success",
  "warning",
  "destructive",
];

const layoutOptions: BannerLayout[] = ["inline", "full-width"];

const meta: Meta<typeof Banner> = {
  title: "Feedback/Banner",
  component: Banner,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A composable, sub-part banner for status messages and call-to-action prompts.",
          "",
          "Build banners from **Banner**, **BannerIcon**, **BannerContent**, **BannerTitle**,",
          "**BannerDescription**, **BannerActions**, and **BannerClose**.",
          "",
          "Three variant axes control appearance:",
          "- `variant` — intent colour (`info` | `success` | `warning` | `destructive`)",
          "- `layout` — `inline` (rounded card, default) or `full-width` (flush, edge-to-edge)",
          "- `size` — `default` or `sm`",
          "",
          "Back-compat monolithic API is also exported as **NoticeBanner**.",
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
    layout: {
      control: "select",
      options: layoutOptions,
      description: "Layout mode — inline card or full-width strip.",
      table: { defaultValue: { summary: "inline" } },
    },
    size: {
      control: "select",
      options: ["default", "sm"],
      description: "Padding scale.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: {
    variant: "info",
    layout: "inline",
    size: "default",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

/** Interactive playground — mix any variant, layout, and size. */
export const Playground: Story = {
  render: (args) => (
    <Banner {...args}>
      <BannerIcon />
      <BannerContent>
        <BannerTitle>Banner title</BannerTitle>
        <BannerDescription>This is a banner description.</BannerDescription>
      </BannerContent>
    </Banner>
  ),
};

// ---------------------------------------------------------------------------
// All Intents
// ---------------------------------------------------------------------------

/** All four intent variants side by side. */
export const AllIntents: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {variantOptions.map((variant) => (
        <Banner {...args} key={variant} variant={variant}>
          <BannerIcon />
          <BannerContent>
            <BannerTitle>
              {variant.charAt(0).toUpperCase() + variant.slice(1)} banner
            </BannerTitle>
            <BannerDescription>This is a {variant} message.</BannerDescription>
          </BannerContent>
        </Banner>
      ))}
    </div>
  ),
};

// ---------------------------------------------------------------------------
// Layouts: inline vs full-width
// ---------------------------------------------------------------------------

/** `inline` (default) — rounded card with border on all sides. */
export const LayoutInline: Story = {
  args: {
    variant: "info",
    layout: "inline",
  },
  render: (args) => (
    <Banner {...args}>
      <BannerIcon />
      <BannerContent>
        <BannerTitle>Inline banner</BannerTitle>
        <BannerDescription>Rendered as a rounded card.</BannerDescription>
      </BannerContent>
    </Banner>
  ),
};

/**
 * `full-width` — flush, edge-to-edge strip with no horizontal border or radius.
 * Typically placed at the top of a page or inside a layout container.
 */
export const LayoutFullWidth: Story = {
  parameters: { layout: "fullscreen" },
  args: {
    variant: "warning",
    layout: "full-width",
  },
  render: (args) => (
    <Banner {...args}>
      <BannerIcon />
      <BannerContent>
        <BannerTitle>Full-width banner</BannerTitle>
        <BannerDescription>
          Edge-to-edge — no side borders, no border-radius.
        </BannerDescription>
      </BannerContent>
    </Banner>
  ),
};

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

/** Both size values for comparison. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(["default", "sm"] as const).map((size) => (
        <Banner {...args} key={size} size={size} variant="info">
          <BannerIcon />
          <BannerContent>
            <BannerTitle>Size: {size}</BannerTitle>
            <BannerDescription>
              {size === "default"
                ? "Standard padding (px-3 py-2)."
                : "Compact padding (px-2.5 py-1.5)."}
            </BannerDescription>
          </BannerContent>
        </Banner>
      ))}
    </div>
  ),
};

// ---------------------------------------------------------------------------
// With Actions + Close
// ---------------------------------------------------------------------------

/** Composition with trailing actions cluster and stateless close button. */
export const WithActionsAndClose: Story = {
  render: (args) => (
    <Banner {...args} variant="warning">
      <BannerIcon />
      <BannerContent>
        <BannerTitle>Free plan limit reached</BannerTitle>
        <BannerDescription>
          You've used 90 % of your monthly quota.
        </BannerDescription>
      </BannerContent>
      <BannerActions>
        <Button size="sm" variant="outline">
          Upgrade
        </Button>
        <BannerClose onClick={() => alert("dismissed")} />
      </BannerActions>
    </Banner>
  ),
};

// ---------------------------------------------------------------------------
// Back-compat: NoticeBanner
// ---------------------------------------------------------------------------

/** Back-compat monolithic API — identical prop surface to the original NoticeBanner. */
export const BackCompatNoticeBanner: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <NoticeBanner title="New feature available" variant="info">
        You can now export your data as CSV from the settings page.
      </NoticeBanner>

      <NoticeBanner
        action={
          <NoticeBannerAction>
            <Button size="sm" variant="outline">
              Upgrade
            </Button>
          </NoticeBannerAction>
        }
        dismissible
        title="Free plan limit reached"
        variant="warning"
      >
        You've used 90 % of your monthly quota.
      </NoticeBanner>

      <NoticeBanner dismissible title="Deployed successfully" variant="success">
        Your changes are live at app.example.com.
      </NoticeBanner>

      <NoticeBanner dismissible title="Payment failed" variant="destructive">
        Your card was declined. Please update your billing info.
      </NoticeBanner>

      <NoticeBanner icon={false} variant="info">
        Icon suppressed with <code>icon=&#123;false&#125;</code>.
      </NoticeBanner>
    </div>
  ),
};
