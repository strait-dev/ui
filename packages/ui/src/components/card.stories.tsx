import {
  BarChartIcon,
  Delete02Icon,
  Download04Icon,
  Edit02Icon,
  MoreHorizontalIcon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta: Meta<typeof Card> = {
  title: "Data Display/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Surface container with rounded corners and a subtle ring border.",
          "Compose from: `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`,",
          "`CardContent`, and `CardFooter`.",
          "",
          "**Sizes** (`sm | default | lg`) — gap and padding cascade from the root.",
          "`CardAction` occupies the top-right cell of the header grid.",
          "An `<img>` as the *first* child of `Card` bleeds edge-to-edge and",
          "receives rounded top corners automatically.",
          "",
          "**Variants** (`default | outline | ghost`) — `default` keeps the current",
          "`bg-card ring-1 ring-foreground/10`; `outline` uses a visible `border` +",
          "`bg-card` and drops the ring; `ghost` is transparent with no ring or border.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
      description: "Internal spacing preset.",
      table: { defaultValue: { summary: "default" } },
    },
    variant: {
      control: "select",
      options: ["default", "outline", "ghost"],
      description: "Surface decoration style.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: { size: "default", variant: "default" },
};

export default meta;

type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Playground                                                          */
/* ------------------------------------------------------------------ */

/** Interactive playground — adjust `size` and `variant` via the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Project settings</CardTitle>
        <CardDescription>Manage your project configuration.</CardDescription>
        <CardAction>
          <Button aria-label="More options" size="icon-sm" variant="ghost">
            <HugeiconsIcon icon={MoreHorizontalIcon} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Update the name, visibility, and members of your project here.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
        <Button className="ml-auto" size="sm">
          Save changes
        </Button>
      </CardFooter>
    </Card>
  ),
};

/* ------------------------------------------------------------------ */
/* Sizes                                                               */
/* ------------------------------------------------------------------ */

/** `sm`, `default`, and `lg` — note the progressive gap and padding. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Card className="w-72" key={size} size={size}>
          <CardHeader>
            <CardTitle>Card — {size}</CardTitle>
            <CardDescription>size="{size}"</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Content area at the {size} size preset.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */

/** `default`, `outline`, and `ghost` — surface decoration comparison. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(["default", "outline", "ghost"] as const).map((variant) => (
        <Card className="w-72" key={variant} variant={variant}>
          <CardHeader>
            <CardTitle>Card — {variant}</CardTitle>
            <CardDescription>variant="{variant}"</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Surface style: {variant}.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Header-only                                                         */
/* ------------------------------------------------------------------ */

/** Card used purely as a titled section — no footer. */
export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Monthly summary</CardTitle>
        <CardDescription>Your usage report for May 2025.</CardDescription>
        <CardAction>
          <Button aria-label="Download report" size="icon-sm" variant="ghost">
            <HugeiconsIcon icon={Download04Icon} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">API calls</p>
            <p className="font-semibold text-base">142,308</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Errors</p>
            <p className="font-semibold text-base">12</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Latency p99</p>
            <p className="font-semibold text-base">84 ms</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Uptime</p>
            <p className="font-semibold text-base">99.98 %</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

/* ------------------------------------------------------------------ */
/* With image                                                          */
/* ------------------------------------------------------------------ */

/** An `<img>` as the first child bleeds to edges and gets rounded top corners. */
export const WithImage: Story = {
  render: () => (
    <Card className="w-72">
      <img
        alt="Project cover"
        className="h-36 w-full object-cover"
        src="https://picsum.photos/seed/card/640/360"
      />
      <CardHeader>
        <CardTitle>New project</CardTitle>
        <CardDescription>Created 3 days ago</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          A showcase of the new product landing page.
        </p>
      </CardContent>
      <CardFooter>
        <Badge variant="success-light">Active</Badge>
        <Button className="ml-auto" size="sm" variant="ghost">
          Open
        </Button>
      </CardFooter>
    </Card>
  ),
};

/* ------------------------------------------------------------------ */
/* Profile / person card                                               */
/* ------------------------------------------------------------------ */

/** User profile card combining avatar, name, role, and actions. */
export const ProfileCard: Story = {
  render: () => (
    <Card className="w-64">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarImage
              alt="Alice Martin"
              src="https://i.pravatar.cc/80?img=47"
            />
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Alice Martin</CardTitle>
            <CardDescription>Senior Engineer</CardDescription>
          </div>
        </div>
        <CardAction>
          <Button aria-label="Edit profile" size="icon-sm" variant="ghost">
            <HugeiconsIcon icon={Edit02Icon} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Badge variant="info-light">
            <HugeiconsIcon icon={BarChartIcon} />
            Product
          </Badge>
          <Badge variant="secondary-light">
            <HugeiconsIcon icon={UserIcon} />
            Admin
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="sm" variant="outline">
          View profile
        </Button>
      </CardFooter>
    </Card>
  ),
};

/* ------------------------------------------------------------------ */
/* Destructive action                                                  */
/* ------------------------------------------------------------------ */

/** A danger zone card with a destructive footer action. */
export const DangerZone: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Delete project</CardTitle>
        <CardDescription>
          This action is irreversible. All data will be permanently removed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="rounded-lg bg-destructive/10 p-3 text-destructive text-sm">
          Deleting this project will remove 24 deployments and all associated
          logs. This cannot be undone.
        </p>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" size="sm" variant="destructive-solid">
          <HugeiconsIcon data-icon="inline-start" icon={Delete02Icon} />
          Delete project
        </Button>
      </CardFooter>
    </Card>
  ),
};

/* ------------------------------------------------------------------ */
/* Settings card                                                       */
/* ------------------------------------------------------------------ */

/** Settings / configuration card with icon actions in the header. */
export const SettingsCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose when and how you receive notifications.
        </CardDescription>
        <CardAction>
          <Button aria-label="Open settings" size="icon-sm" variant="ghost">
            <HugeiconsIcon icon={Settings01Icon} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 text-sm">
          {["Email digests", "Push notifications", "Slack integration"].map(
            (item) => (
              <div className="flex items-center justify-between" key={item}>
                <span>{item}</span>
                <Badge variant="success-light">On</Badge>
              </div>
            )
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" size="sm">
          Save preferences
        </Button>
      </CardFooter>
    </Card>
  ),
};

/* ------------------------------------------------------------------ */
/* Grid of cards                                                       */
/* ------------------------------------------------------------------ */

/** Three cards in a responsive grid — typical dashboard layout. */
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[
        {
          title: "Total revenue",
          value: "$48,295",
          delta: "+12 %",
          badge: "success-light" as const,
        },
        {
          title: "Active users",
          value: "3,842",
          delta: "+4 %",
          badge: "info-light" as const,
        },
        {
          title: "Error rate",
          value: "0.08 %",
          delta: "-0.02 %",
          badge: "warning-light" as const,
        },
      ].map(({ title, value, delta, badge }) => (
        <Card key={title}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-2xl">{value}</p>
            <Badge className="mt-1" variant={badge}>
              {delta} vs last month
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
