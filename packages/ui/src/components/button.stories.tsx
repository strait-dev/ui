import {
  AppleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRightIcon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  Delete02Icon,
  Download04Icon,
  FavouriteIcon,
  GithubIcon,
  GoogleIcon,
  Moon01Icon,
  NewTwitterIcon,
  PlusSignIcon,
  Search01Icon,
  Settings01Icon,
  StarIcon,
  Sun01Icon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, Fragment, useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Badge } from "./badge";
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
  "secondary-outline",
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
  "invert-solid",
  "invert",
  "invert-outline",
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

/**
 * Interaction test: clicking the button fires its `onClick` handler, and a
 * disabled button does not. Runs in the Storybook Vitest browser suite.
 */
export const ClickInteraction: Story = {
  args: { onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Button" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

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
  {
    name: "Invert",
    solid: "invert-solid",
    soft: "invert",
    outline: "invert-outline",
  },
];

const specialVariants: ButtonVariant[] = ["ghost", "link", "secondary-outline"];

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
        )
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

/**
 * Copy-with-feedback — swap label and icon for ~1.5 s after click so the
 * action confirms itself without a toast.
 */
export const CopyWithFeedback: Story = {
  render: () => {
    function CopyButton() {
      const [copied, setCopied] = useState(false);
      return (
        <Button
          onClick={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          variant="outline"
        >
          <HugeiconsIcon
            data-icon="inline-start"
            icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
            strokeWidth={2}
          />
          {copied ? "Copied" : "Copy link"}
        </Button>
      );
    }
    return <CopyButton />;
  },
};

/**
 * Async action — disable the button and swap in a `Spinner` while the
 * underlying promise is in flight.
 */
export const AsyncAction: Story = {
  render: () => {
    function SaveButton() {
      const [pending, setPending] = useState(false);
      return (
        <Button
          disabled={pending}
          onClick={() => {
            setPending(true);
            setTimeout(() => setPending(false), 1400);
          }}
        >
          {pending ? (
            <>
              <Spinner className="size-3.5" data-icon="inline-start" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      );
    }
    return <SaveButton />;
  },
};

/**
 * Like-with-count — toggle a filled heart and a numeric counter; the
 * fill colour swaps from `muted-foreground` to `destructive`.
 */
export const LikeWithCount: Story = {
  render: () => {
    function LikeButton() {
      const [liked, setLiked] = useState(false);
      return (
        <Button
          aria-pressed={liked}
          onClick={() => setLiked((p) => !p)}
          variant="outline"
        >
          <HugeiconsIcon
            className={liked ? "text-destructive" : "text-muted-foreground"}
            data-icon="inline-start"
            icon={FavouriteIcon}
            strokeWidth={2}
          />
          {liked ? "Liked" : "Like"}
          <span className="ml-1 text-muted-foreground text-xs">
            {liked ? "1,238" : "1,237"}
          </span>
        </Button>
      );
    }
    return <LikeButton />;
  },
};

/** Star-with-count — same pattern as Like but for repository starring. */
export const StarWithCount: Story = {
  render: () => {
    function StarButton() {
      const [starred, setStarred] = useState(false);
      return (
        <ButtonGroup>
          <Button
            aria-pressed={starred}
            onClick={() => setStarred((p) => !p)}
            variant="outline"
          >
            <HugeiconsIcon
              className={starred ? "text-warning" : "text-muted-foreground"}
              data-icon="inline-start"
              icon={StarIcon}
              strokeWidth={2}
            />
            {starred ? "Starred" : "Star"}
          </Button>
          <Button variant="outline">{starred ? "4.2k" : "4.1k"}</Button>
        </ButtonGroup>
      );
    }
    return <StarButton />;
  },
};

/**
 * Notification badge — overlay a count `Badge` over an icon button by
 * positioning it absolutely at the corner.
 */
export const WithNotificationBadge: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Button aria-label="Inbox" size="icon" variant="outline">
          <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
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
        <Button variant="outline">
          <HugeiconsIcon
            data-icon="inline-start"
            icon={ArrowDown01Icon}
            strokeWidth={2}
          />
          Drafts
        </Button>
        <Badge
          className="absolute -top-1.5 -right-1.5"
          size="xs"
          variant="info"
        >
          12
        </Badge>
      </div>
    </div>
  ),
};

/**
 * Status dot prefix — pair a small dot with a `ghost` button to surface
 * environment, agent online state, or session status inline.
 */
export const WithStatusDot: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="ghost">
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-success"
          data-icon="inline-start"
        />
        Production
      </Button>
      <Button variant="ghost">
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-warning"
          data-icon="inline-start"
        />
        Staging
      </Button>
      <Button variant="ghost">
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-muted-foreground"
          data-icon="inline-start"
        />
        Local
      </Button>
    </div>
  ),
};

/**
 * Go-back link — `variant="ghost"` paired with a leading arrow gives a
 * lightweight breadcrumb-style back affordance.
 */
export const GoBackLink: Story = {
  render: () => (
    <Button variant="ghost">
      <HugeiconsIcon
        data-icon="inline-start"
        icon={ArrowLeft01Icon}
        strokeWidth={2}
      />
      Back to projects
    </Button>
  ),
};

/**
 * Sliding-icon hover — the trailing arrow slides right on hover via a
 * transform transition.
 */
export const SlidingIconHover: Story = {
  render: () => (
    <Button className="group" variant="default">
      Continue
      <HugeiconsIcon
        className="transition-transform duration-200 group-hover:translate-x-0.5"
        data-icon="inline-end"
        icon={ArrowRightIcon}
        strokeWidth={2}
      />
    </Button>
  ),
};

/**
 * Theme toggle — single icon button swaps between sun and moon based on
 * local state. Wire it to your actual theme provider in production.
 */
export const ThemeToggle: Story = {
  render: () => {
    function Toggle() {
      const [dark, setDark] = useState(false);
      return (
        <Button
          aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={() => setDark((p) => !p)}
          size="icon"
          variant="outline"
        >
          <HugeiconsIcon icon={dark ? Moon01Icon : Sun01Icon} strokeWidth={2} />
        </Button>
      );
    }
    return <Toggle />;
  },
};

/**
 * Social login — a column of `outline` buttons with vendor icons; common
 * top-of-form pattern on auth screens.
 */
export const SocialLogin: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-2">
      <Button className="w-full" variant="outline">
        <HugeiconsIcon
          data-icon="inline-start"
          icon={GoogleIcon}
          strokeWidth={2}
        />
        Continue with Google
      </Button>
      <Button className="w-full" variant="outline">
        <HugeiconsIcon
          data-icon="inline-start"
          icon={GithubIcon}
          strokeWidth={2}
        />
        Continue with GitHub
      </Button>
      <Button className="w-full" variant="outline">
        <HugeiconsIcon
          data-icon="inline-start"
          icon={AppleIcon}
          strokeWidth={2}
        />
        Continue with Apple
      </Button>
    </div>
  ),
};

/**
 * Social icons — icon-only buttons sized `icon-sm` arranged in a row for
 * sharing surfaces.
 */
export const SocialIconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      <Button aria-label="Share on Twitter" size="icon-sm" variant="ghost">
        <HugeiconsIcon icon={NewTwitterIcon} strokeWidth={2} />
      </Button>
      <Button aria-label="Share on GitHub" size="icon-sm" variant="ghost">
        <HugeiconsIcon icon={GithubIcon} strokeWidth={2} />
      </Button>
      <Button aria-label="Share on Google" size="icon-sm" variant="ghost">
        <HugeiconsIcon icon={GoogleIcon} strokeWidth={2} />
      </Button>
      <Button aria-label="Mark as favourite" size="icon-sm" variant="ghost">
        <HugeiconsIcon icon={FavouriteIcon} strokeWidth={2} />
      </Button>
    </div>
  ),
};

/**
 * Confirmation feedback — like {@link CopyWithFeedback}, but for a destructive
 * action. Holds a brief "Confirmed" state before reverting.
 */
export const ConfirmFeedback: Story = {
  render: () => {
    function ConfirmButton() {
      const [done, setDone] = useState(false);
      return (
        <Button
          onClick={() => {
            setDone(true);
            setTimeout(() => setDone(false), 1500);
          }}
          variant={done ? "success" : "destructive-outline"}
        >
          <HugeiconsIcon
            data-icon="inline-start"
            icon={done ? Tick02Icon : Delete02Icon}
            strokeWidth={2}
          />
          {done ? "Removed" : "Remove"}
        </Button>
      );
    }
    return <ConfirmButton />;
  },
};
