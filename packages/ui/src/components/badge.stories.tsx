import {
  Alert01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  GlobeIcon,
  InformationCircleIcon,
  Mail01Icon,
  Notification01Icon,
  StarIcon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, Fragment, useState } from "react";

import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";

type BadgeVariant = NonNullable<ComponentProps<typeof Badge>["variant"]>;
type BadgeSize = NonNullable<ComponentProps<typeof Badge>["size"]>;

const variantOptions: BadgeVariant[] = [
  "default",
  "secondary",
  "outline",
  "info",
  "success",
  "warning",
  "destructive",
  "invert",
  "primary-light",
  "brand-light",
  "warning-light",
  "success-light",
  "info-light",
  "destructive-light",
  "invert-light",
  "secondary-light",
  "primary-outline",
  "brand-outline",
  "warning-outline",
  "success-outline",
  "info-outline",
  "destructive-outline",
  "invert-outline",
  "secondary-outline",
  "ghost",
  "link",
];

const sizeOptions: BadgeSize[] = ["xs", "sm", "default", "lg", "xl"];

const meta: Meta<typeof Badge> = {
  title: "Data Display/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Compact label for status, category, or count. Built on **Base UI** `useRender`,",
          "so it accepts a `render` prop for polymorphism instead of `asChild`.",
          "",
          "Variants follow an intent × emphasis matrix: solid, light, and outline",
          "flavours for brand, info, success, warning, and destructive intents.",
          "Includes the new `secondary-outline` variant.",
          "",
          "New props: `iconLeft`, `iconRight`, `dismissible`/`onDismiss`, `dot`/`dotClassName`, `mono`.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: variantOptions,
      description: "Visual intent and emphasis.",
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: sizeOptions,
      description: "Height/padding preset.",
      table: { defaultValue: { summary: "default" } },
    },
    radius: {
      control: "select",
      options: ["lg", "pill", "md", "sm"],
      description: "Corner radius preset.",
      table: { defaultValue: { summary: "lg" } },
    },
    children: { control: "text", description: "Badge label." },
    mono: {
      control: "boolean",
      description: "Monospaced, uppercase, tracked.",
    },
    dot: { control: "boolean", description: "Show leading dot." },
    dismissible: { control: "boolean", description: "Show dismiss button." },
  },
  args: {
    children: "Badge",
    variant: "default",
    size: "default",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — mix any variant and size. */
export const Playground: Story = {};

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */

const solidVariants: BadgeVariant[] = [
  "default",
  "secondary",
  "info",
  "success",
  "warning",
  "destructive",
  "invert",
];
const lightVariants: BadgeVariant[] = [
  "primary-light",
  "brand-light",
  "info-light",
  "success-light",
  "warning-light",
  "destructive-light",
  "invert-light",
  "secondary-light",
];
const outlineVariants: BadgeVariant[] = [
  "outline",
  "primary-outline",
  "brand-outline",
  "info-outline",
  "success-outline",
  "warning-outline",
  "destructive-outline",
  "invert-outline",
  "secondary-outline",
];

/** All variant groups: solid, light, outline (including the new `secondary-outline`). */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(
        [
          ["Solid", solidVariants],
          ["Light", lightVariants],
          ["Outline", outlineVariants],
        ] as [string, BadgeVariant[]][]
      ).map(([label, variants]) => (
        <div className="flex flex-col gap-2" key={label}>
          <span className="font-medium text-muted-foreground text-xs">
            {label}
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <Badge {...args} key={variant} variant={variant}>
                {variant}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/** All five sizes from `xs` to `xl`. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {sizeOptions.map((size) => (
        <Fragment key={size}>
          <Badge {...args} size={size}>
            {size}
          </Badge>
        </Fragment>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* With icons (iconLeft / iconRight props)                            */
/* ------------------------------------------------------------------ */

/** Badges using the new `iconLeft` / `iconRight` props. */
export const WithIconProps: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} iconLeft={CheckmarkCircle01Icon} variant="success-light">
        Completed
      </Badge>
      <Badge {...args} iconLeft={InformationCircleIcon} variant="info-light">
        In review
      </Badge>
      <Badge {...args} iconLeft={Alert01Icon} variant="warning-light">
        Pending
      </Badge>
      <Badge {...args} iconLeft={Cancel01Icon} variant="destructive-light">
        Failed
      </Badge>
      <Badge {...args} iconRight={Tag01Icon} variant="primary-light">
        Tagged
      </Badge>
    </div>
  ),
};

/** Badges with leading icons for status communication (legacy JSX pattern). */
export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} variant="success-light">
        <HugeiconsIcon icon={CheckmarkCircle01Icon} />
        Completed
      </Badge>
      <Badge {...args} variant="info-light">
        <HugeiconsIcon icon={InformationCircleIcon} />
        In review
      </Badge>
      <Badge {...args} variant="warning-light">
        <HugeiconsIcon icon={Alert01Icon} />
        Pending
      </Badge>
      <Badge {...args} variant="destructive-light">
        <HugeiconsIcon icon={Cancel01Icon} />
        Failed
      </Badge>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Dismissible                                                         */
/* ------------------------------------------------------------------ */

/** Dismissible badges — clicking × fires `onDismiss`. */
export const Dismissible: Story = {
  render: (args) => {
    const [tags, setTags] = useState(["Design", "React", "TypeScript", "UI"]);
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            {...args}
            dismissible
            key={tag}
            onDismiss={() => setTags((prev) => prev.filter((t) => t !== tag))}
            variant="secondary-light"
          >
            {tag}
          </Badge>
        ))}
        {tags.length === 0 && (
          <span className="text-muted-foreground text-xs">
            All tags dismissed.
          </span>
        )}
      </div>
    );
  },
};

/* ------------------------------------------------------------------ */
/* Dot                                                                 */
/* ------------------------------------------------------------------ */

/** Badges with a leading dot — useful for status chips. */
export const WithDot: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Badge {...args} dot dotClassName="bg-success" variant="success-light">
        Active
      </Badge>
      <Badge {...args} dot dotClassName="bg-info" variant="info-light">
        Running
      </Badge>
      <Badge {...args} dot dotClassName="bg-warning" variant="warning-light">
        Pending
      </Badge>
      <Badge
        {...args}
        dot
        dotClassName="bg-destructive"
        variant="destructive-light"
      >
        Failed
      </Badge>
      <Badge {...args} dot variant="secondary-light">
        Unknown
      </Badge>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Mono                                                                */
/* ------------------------------------------------------------------ */

/** `mono` applies `font-mono uppercase tracking-wide` — great for version numbers and codes. */
export const Mono: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge {...args} mono variant="outline">
        v1.2.3
      </Badge>
      <Badge {...args} mono variant="secondary-light">
        abc-123
      </Badge>
      <Badge {...args} mono variant="info-light">
        sha:a1b2c3
      </Badge>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Numeric / count badges                                              */
/* ------------------------------------------------------------------ */

/** Numeric notification counts — typically overlaid on other elements. */
export const CountBadges: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} size="xs" variant="destructive">
        3
      </Badge>
      <Badge {...args} size="sm" variant="default">
        12
      </Badge>
      <Badge {...args} size="default" variant="info">
        99+
      </Badge>
      <Badge {...args} size="lg" variant="warning-light">
        42
      </Badge>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Status row composition                                             */
/* ------------------------------------------------------------------ */

/** Real-world status column — the most common usage pattern. */
export const StatusColumn: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      {(
        [
          { label: "Deployed", variant: "success-light" },
          { label: "Building", variant: "info-light" },
          { label: "Queued", variant: "warning-light" },
          { label: "Failed", variant: "destructive-light" },
          { label: "Cancelled", variant: "secondary-light" },
        ] as { label: string; variant: BadgeVariant }[]
      ).map(({ label, variant }) => (
        <div className="flex items-center gap-2" key={label}>
          <Badge {...args} variant={variant}>
            {label}
          </Badge>
        </div>
      ))}
    </div>
  ),
};

/** Rendered as a `<button>` via the `render` prop — interactive badge. */
export const AsButton: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <Badge
        {...args}
        render={<button onClick={() => alert("clicked")} type="button" />}
        variant="primary-light"
      >
        Click me
      </Badge>
      <Badge
        {...args}
        render={<button onClick={() => alert("clicked")} type="button" />}
        variant="destructive-light"
      >
        Remove tag
      </Badge>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Combined / kitchen-sink                                             */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Radius axis                                                         */
/* ------------------------------------------------------------------ */

/**
 * The four `radius` presets side by side — `lg` (default), `pill` (opt-in full-pill),
 * `md` for tag-style chips matching button corners, and `sm` for a subtle square.
 */
export const Radius: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(["lg", "pill", "md", "sm"] as const).map((radius) => (
        <div className="flex items-center gap-3" key={radius}>
          <span className="w-12 text-muted-foreground text-xs">{radius}</span>
          <Badge {...args} radius={radius} variant="secondary-light">
            Default
          </Badge>
          <Badge {...args} radius={radius} variant="success-light">
            Active
          </Badge>
          <Badge {...args} radius={radius} variant="info-outline">
            Beta
          </Badge>
          <Badge {...args} mono radius={radius} variant="outline">
            v1.2.3
          </Badge>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Composition patterns                                                */
/* ------------------------------------------------------------------ */

/**
 * Avatar chip — pair an `Avatar` with a tag inside a `radius="md"` badge to
 * communicate ownership next to a label.
 */
export const AvatarChip: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="gap-1.5 pl-0.5" radius="pill" variant="secondary-light">
        <Avatar size="xs">
          <AvatarFallback>AJ</AvatarFallback>
        </Avatar>
        Alex Johnson
      </Badge>
      <Badge className="gap-1.5 pl-0.5" radius="pill" variant="success-light">
        <Avatar size="xs">
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
        Maria Cabrera
      </Badge>
      <Badge className="gap-1.5 pl-0.5" radius="pill" variant="info-light">
        <Avatar size="xs">
          <AvatarFallback>NP</AvatarFallback>
        </Avatar>
        Noah Park
      </Badge>
    </div>
  ),
};

/**
 * Region chip — a leading icon or code prefixes a country/region tag.
 */
export const WithRegionCode: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge iconLeft={GlobeIcon} radius="md" variant="secondary-light">
        Global
      </Badge>
      <Badge radius="md" variant="secondary-light">
        US
      </Badge>
      <Badge radius="md" variant="secondary-light">
        Brazil
      </Badge>
      <Badge radius="md" variant="secondary-light">
        EU
      </Badge>
    </div>
  ),
};

/**
 * Rendered as an `<a>` via the `render` prop — turns the badge into a
 * navigable tag with the same focus ring as buttons.
 */
export const AsLink: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge
        // biome-ignore lint/a11y/useAnchorContent: content is provided by Badge children
        // biome-ignore lint/a11y/useValidAnchor: placeholder href for story demo
        render={<a href="#" />}
        variant="primary-light"
      >
        #design-system
      </Badge>
      <Badge
        // biome-ignore lint/a11y/useAnchorContent: content is provided by Badge children
        // biome-ignore lint/a11y/useValidAnchor: placeholder href for story demo
        render={<a href="#" />}
        variant="info-light"
      >
        #components
      </Badge>
      <Badge
        // biome-ignore lint/a11y/useAnchorContent: content is provided by Badge children
        // biome-ignore lint/a11y/useValidAnchor: placeholder href for story demo
        render={<a href="#" />}
        variant="secondary-light"
      >
        #accessibility
      </Badge>
    </div>
  ),
};

/**
 * Notification overlay — anchor a `Badge` to the top-right corner of an
 * icon button using absolute positioning for unread counters.
 */
export const NotificationOverlay: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Button aria-label="Inbox" size="icon" variant="outline">
          <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />
        </Button>
        <Badge
          className="absolute -top-1.5 -right-1.5"
          size="xs"
          variant="destructive"
        >
          3
        </Badge>
      </div>
      <div className="relative">
        <Button aria-label="Notifications" size="icon" variant="outline">
          <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} />
        </Button>
        <Badge
          className="absolute -top-1.5 -right-1.5"
          size="xs"
          variant="info"
        >
          12
        </Badge>
      </div>
      <div className="relative">
        <Button aria-label="Inbox" size="icon" variant="outline">
          <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} />
        </Button>
        <Badge
          className="absolute -top-1.5 -right-1.5"
          dot
          dotClassName="bg-success size-2"
          variant="success"
        >
          <span className="sr-only">3 unread</span>
        </Badge>
      </div>
    </div>
  ),
};

/**
 * Rating chip — combine a leading star icon with a numeric label.
 */
export const RatingChip: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge iconLeft={StarIcon} radius="md" variant="warning-light">
        4.9
      </Badge>
      <Badge iconLeft={StarIcon} radius="md" variant="success-light">
        4.7
      </Badge>
      <Badge iconLeft={StarIcon} radius="md" variant="info-light">
        4.3
      </Badge>
      <Badge iconLeft={StarIcon} radius="md" variant="destructive-light">
        2.1
      </Badge>
    </div>
  ),
};

/**
 * Plan tier — pair a dot with `radius="md"` for plan or environment chips
 * that match data-table chrome.
 */
export const PlanTier: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge
        dot
        dotClassName="bg-muted-foreground"
        radius="md"
        variant="outline"
      >
        Free
      </Badge>
      <Badge dot dotClassName="bg-info" radius="md" variant="info-light">
        Pro
      </Badge>
      <Badge dot dotClassName="bg-success" radius="md" variant="success-light">
        Team
      </Badge>
      <Badge dot dotClassName="bg-warning" radius="md" variant="warning-light">
        Enterprise
      </Badge>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Combined / kitchen-sink                                             */
/* ------------------------------------------------------------------ */

/** Kitchen-sink: dot + iconLeft + dismissible combined. */
export const Combined: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Badge
        {...args}
        dismissible
        dot
        dotClassName="bg-info"
        iconLeft={InformationCircleIcon}
        onDismiss={() => setVisible(false)}
        variant="info-light"
      >
        New feature available
      </Badge>
    ) : (
      <span className="text-muted-foreground text-xs">Badge dismissed.</span>
    );
  },
};
