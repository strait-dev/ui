import {
  ArrowDown01Icon,
  ArrowRightIcon,
  Copy01Icon,
  Delete02Icon,
  Download04Icon,
  PlusSignIcon,
  Search01Icon,
  Settings01Icon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, Fragment } from "react";

import { Button } from "./button";
import { ButtonGroup, ButtonGroupSeparator } from "./button-group";
import { Kbd } from "./kbd";
import { Spinner } from "./spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

type ButtonVariant = NonNullable<ComponentProps<typeof Button>["variant"]>;
type ButtonSize = NonNullable<ComponentProps<typeof Button>["size"]>;

const variantOptions: ButtonVariant[] = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "link",
  "brand-solid",
  "brand",
  "brand-outline",
  "destructive-solid",
  "destructive",
  "destructive-outline",
  "success-solid",
  "success",
  "success-outline",
  "warning-solid",
  "warning",
  "warning-outline",
  "info-solid",
  "info",
  "info-outline",
];

const sizeOptions: ButtonSize[] = [
  "xs",
  "sm",
  "default",
  "lg",
  "xl",
  "icon-xs",
  "icon-sm",
  "icon",
  "icon-lg",
  "icon-xl",
];

const meta = {
  title: "Actions/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Buttons trigger actions. Emphasis is expressed through a matrix of",
          "**intent** (neutral, brand, destructive, success, warning, info) and",
          "**emphasis level** (solid → soft → outline → ghost → link).",
          "",
          "**Naming convention**",
          "- A bare intent name is the *soft* (tinted) emphasis: `brand`, `destructive`, `success`, `warning`, `info`.",
          "- `*-solid` is the high-emphasis filled style: `brand-solid`, `destructive-solid`, …",
          "- `*-outline` is the bordered style: `brand-outline`, …",
          "- Neutral keeps its conventional names: `default` (solid), `secondary` (soft/grey), `outline`.",
          "- `ghost` and `link` are special low-emphasis styles.",
          "",
          'Icons can be placed inline by adding `data-icon="inline-start"` or',
          '`data-icon="inline-end"` to the icon element — the button adjusts its',
          "padding automatically.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: variantOptions,
      description: "Visual style (intent + emphasis).",
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: sizeOptions,
      description:
        "Height/padding preset. `icon-*` sizes render square icon buttons.",
      table: { defaultValue: { summary: "default" } },
    },
    disabled: {
      control: "boolean",
      description: "Disables the button and reduces opacity.",
    },
    children: { control: "text", description: "Button label / content." },
  },
  args: {
    children: "Button",
    variant: "default",
    size: "default",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — use the controls to mix any variant and size. */
export const Playground: Story = {};

/* ------------------------------------------------------------------ */
/* The full matrix                                                     */
/* ------------------------------------------------------------------ */

const matrixRows: {
  name: string;
  solid: ButtonVariant;
  soft: ButtonVariant;
  outline: ButtonVariant;
}[] = [
  { name: "Neutral", solid: "default", soft: "secondary", outline: "outline" },
  {
    name: "Brand",
    solid: "brand-solid",
    soft: "brand",
    outline: "brand-outline",
  },
  {
    name: "Destructive",
    solid: "destructive-solid",
    soft: "destructive",
    outline: "destructive-outline",
  },
  {
    name: "Success",
    solid: "success-solid",
    soft: "success",
    outline: "success-outline",
  },
  {
    name: "Warning",
    solid: "warning-solid",
    soft: "warning",
    outline: "warning-outline",
  },
  { name: "Info", solid: "info-solid", soft: "info", outline: "info-outline" },
];

const specialVariants: ButtonVariant[] = ["ghost", "link"];

/**
 * Every variant in one place: each intent across solid / soft / outline
 * emphasis, plus the special `ghost` and `link` styles.
 */
export const Matrix: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div className="grid w-fit grid-cols-[7rem_repeat(3,9rem)] items-center gap-x-4 gap-y-3">
        <span />
        <span className="text-center font-medium text-muted-foreground text-xs">
          Solid
        </span>
        <span className="text-center font-medium text-muted-foreground text-xs">
          Soft
        </span>
        <span className="text-center font-medium text-muted-foreground text-xs">
          Outline
        </span>
        {matrixRows.map((row) => (
          <Fragment key={row.name}>
            <span className="text-muted-foreground text-sm">{row.name}</span>
            <div className="flex justify-center">
              <Button {...args} variant={row.solid}>
                {row.name}
              </Button>
            </div>
            <div className="flex justify-center">
              <Button {...args} variant={row.soft}>
                {row.name}
              </Button>
            </div>
            <div className="flex justify-center">
              <Button {...args} variant={row.outline}>
                {row.name}
              </Button>
            </div>
          </Fragment>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-medium text-muted-foreground text-xs">
          Special
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {specialVariants.map((variant) => (
            <Button {...args} key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** A flat list of all 20 variants, each labelled with its exact name. */
export const AllVariants: Story = {
  render: (args) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-4">
      {variantOptions.map((variant) => (
        <div className="flex flex-col items-start gap-1.5" key={variant}>
          <Button {...args} variant={variant}>
            Button
          </Button>
          <code className="text-muted-foreground text-xs">{variant}</code>
        </div>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Sizes                                                               */
/* ------------------------------------------------------------------ */

/** Text button sizes, from `xs` to `xl`. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="xs">
        Extra small
      </Button>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="default">
        Default
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
      <Button {...args} size="xl">
        Extra large
      </Button>
    </div>
  ),
};

/** Square icon-only sizes. Always provide an `aria-label`. */
export const IconButtons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["icon-xs", "icon-sm", "icon", "icon-lg", "icon-xl"] as const).map(
        (size) => (
          <Button
            {...args}
            aria-label="Add item"
            key={size}
            size={size}
            variant="outline"
          >
            <HugeiconsIcon icon={PlusSignIcon} />
          </Button>
        ),
      )}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Icons & content                                                     */
/* ------------------------------------------------------------------ */

/**
 * Inline icons. Mark the icon with `data-icon="inline-start"` or
 * `data-icon="inline-end"` so the button tightens the adjacent padding.
 */
export const WithIcons: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="brand-solid">
        <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
        New project
      </Button>
      <Button {...args} variant="outline">
        Continue
        <HugeiconsIcon data-icon="inline-end" icon={ArrowRightIcon} />
      </Button>
      <Button {...args} variant="secondary">
        <HugeiconsIcon data-icon="inline-start" icon={Download04Icon} />
        Download
      </Button>
    </div>
  ),
};

/** A loading button: the `Spinner` component plus a disabled state. */
export const Loading: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} disabled variant="default">
        <Spinner data-icon="inline-start" />
        Saving…
      </Button>
      <Button {...args} disabled variant="outline">
        <Spinner data-icon="inline-start" />
        Loading
      </Button>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* States                                                              */
/* ------------------------------------------------------------------ */

/** Disabled state across representative variants. */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} disabled variant="default">
        Default
      </Button>
      <Button {...args} disabled variant="brand-solid">
        Brand
      </Button>
      <Button {...args} disabled variant="secondary">
        Secondary
      </Button>
      <Button {...args} disabled variant="outline">
        Outline
      </Button>
      <Button {...args} disabled variant="destructive">
        Destructive
      </Button>
      <Button {...args} disabled variant="ghost">
        Ghost
      </Button>
    </div>
  ),
};

/** Rendered as a link via the `render` prop while keeping button styling. */
export const AsLink: Story = {
  render: (args) => (
    <Button
      {...args}
      // biome-ignore lint/a11y/useAnchorContent: content comes from children
      render={<a href="https://example.com" />}
      variant="brand-outline"
    >
      Visit example.com
      <HugeiconsIcon data-icon="inline-end" icon={ArrowRightIcon} />
    </Button>
  ),
};

/* ------------------------------------------------------------------ */
/* Composition                                                         */
/* ------------------------------------------------------------------ */

/**
 * Pair a button with a `Tooltip` to label it — essential for icon-only
 * buttons, where the tooltip carries the action name on hover and focus.
 * The button is supplied to `TooltipTrigger` via its `render` prop.
 */
export const WithTooltip: Story = {
  render: (args) => (
    <TooltipProvider delay={200}>
      <div className="flex flex-wrap items-center gap-3">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button {...args} aria-label="Copy" size="icon" variant="outline">
                <HugeiconsIcon icon={Copy01Icon} />
              </Button>
            }
          />
          <TooltipContent>Copy to clipboard</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                {...args}
                aria-label="Settings"
                size="icon"
                variant="ghost"
              >
                <HugeiconsIcon icon={Settings01Icon} />
              </Button>
            }
          />
          <TooltipContent>Open settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                {...args}
                aria-label="Delete"
                size="icon"
                variant="destructive"
              >
                <HugeiconsIcon icon={Delete02Icon} />
              </Button>
            }
          />
          <TooltipContent>Delete permanently</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

/**
 * Stitch related actions together with `ButtonGroup`: a segmented control
 * (single-choice toolbar) and a split button (primary action + overflow).
 */
export const Group: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="font-medium text-muted-foreground text-xs">
          Segmented
        </span>
        <ButtonGroup>
          <Button
            {...args}
            aria-label="Align left"
            size="icon"
            variant="outline"
          >
            <HugeiconsIcon icon={TextAlignLeftIcon} />
          </Button>
          <Button
            {...args}
            aria-label="Align center"
            size="icon"
            variant="outline"
          >
            <HugeiconsIcon icon={TextAlignCenterIcon} />
          </Button>
          <Button
            {...args}
            aria-label="Align right"
            size="icon"
            variant="outline"
          >
            <HugeiconsIcon icon={TextAlignRightIcon} />
          </Button>
        </ButtonGroup>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-medium text-muted-foreground text-xs">
          Split button
        </span>
        <ButtonGroup>
          <Button {...args} variant="outline">
            Save
          </Button>
          <ButtonGroupSeparator />
          <Button
            {...args}
            aria-label="More save options"
            size="icon"
            variant="outline"
          >
            <HugeiconsIcon icon={ArrowDown01Icon} />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

/** Surface a keyboard shortcut inside the button with `Kbd`. */
export const WithKbd: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="outline">
        <HugeiconsIcon data-icon="inline-start" icon={Search01Icon} />
        Search
        <Kbd>⌘K</Kbd>
      </Button>
      <Button {...args} variant="default">
        Save
        <Kbd>⌘S</Kbd>
      </Button>
    </div>
  ),
};

/** Stretch a button to fill its container with `className="w-full"`. */
export const FullWidth: Story = {
  render: (args) => (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Button {...args} className="w-full" variant="default">
        Continue
      </Button>
      <Button {...args} className="w-full" variant="outline">
        Cancel
      </Button>
    </div>
  ),
};
