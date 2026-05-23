import {
  Alert01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, Fragment, useState } from "react";

import { Badge } from "./badge";

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
  "warning-light",
  "success-light",
  "info-light",
  "destructive-light",
  "invert-light",
  "secondary-light",
  "primary-outline",
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
