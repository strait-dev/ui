import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Separator } from "./separator";
import { Shell } from "./shell";

const meta = {
  title: "Layout/Shell",
  component: Shell,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A page-level layout wrapper that applies consistent horizontal padding",
          "and a vertical flex column with a gap.",
          "",
          "Three variants adjust content alignment:",
          "- **`default`** — left-aligned, full-width content.",
          "- **`centered`** — horizontally centred children (useful for auth pages, empty states).",
          "- **`fluid`** — like default but intended for full-bleed sections that manage",
          "  their own max-width internally.",
          "",
          "Extend it with a `className` for custom max-widths, backgrounds, or min-height.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "centered", "fluid"],
      description: "Layout alignment strategy.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  args: {
    variant: "default",
  },
} satisfies Meta<typeof Shell>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — switch variants via the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <Shell {...args}>
      <div className="rounded-lg border bg-muted/40 p-6 text-center text-muted-foreground text-sm">
        Shell content area — variant:{" "}
        <strong>{args.variant ?? "default"}</strong>
      </div>
      <div className="rounded-lg border bg-muted/40 p-6 text-center text-muted-foreground text-sm">
        Another section
      </div>
    </Shell>
  ),
};

/** Default variant — left-aligned content with responsive horizontal padding. */
export const Default: Story = {
  args: { variant: "default" },
  render: (args) => (
    <Shell {...args} className="max-w-2xl">
      <div>
        <h1 className="font-semibold text-xl">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Welcome back. Here's what's happening today.
        </p>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-4">
        {["Total Users", "Active Projects", "Open Issues"].map((label, i) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold text-2xl">{(i + 1) * 142}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Shell>
  ),
};

/** Centered variant — children are centred horizontally, ideal for auth/onboarding pages. */
export const Centered: Story = {
  args: { variant: "centered" },
  render: (args) => (
    <Shell {...args} className="min-h-64 justify-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm">
            Enter your credentials to continue.
          </p>
          <Button className="w-full" variant="default">
            Continue with email
          </Button>
          <Button className="w-full" variant="outline">
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </Shell>
  ),
};

/** Fluid variant — full-width sections that own their own inner layout. */
export const Fluid: Story = {
  args: { variant: "fluid" },
  render: (args) => (
    <Shell {...args}>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">All Projects</h2>
        <Button size="sm" variant="brand-solid">
          New Project
        </Button>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        {["Alpha", "Beta", "Gamma", "Delta"].map((name) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle className="text-sm">Project {name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">
                Last updated 2 days ago
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Shell>
  ),
};

/** All three variants rendered together for a quick visual comparison. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["default", "centered", "fluid"] as const).map((variant) => (
        <div key={variant}>
          <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
            {variant}
          </p>
          <div className="rounded-lg border">
            <Shell variant={variant}>
              <div className="rounded-md bg-muted/50 p-4 text-center text-muted-foreground text-sm">
                variant="{variant}"
              </div>
              <div className="rounded-md bg-muted/50 p-4 text-center text-muted-foreground text-sm">
                Second section
              </div>
            </Shell>
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * A realistic page composition: Shell wrapping a nav, a hero, a stats row,
 * and a footer — demonstrating how the gap and padding hold together.
 */
export const PageComposition: Story = {
  render: () => (
    <Shell className="max-w-3xl" variant="default">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg">Strait</span>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost">
            Docs
          </Button>
          <Button size="sm" variant="ghost">
            Blog
          </Button>
          <Button size="sm" variant="brand-solid">
            Get started
          </Button>
        </div>
      </div>

      <Separator />

      {/* Hero */}
      <div className="py-6 text-center">
        <h1 className="font-bold text-3xl tracking-tight">
          Build faster with Strait UI
        </h1>
        <p className="mt-2 text-muted-foreground">
          Accessible, composable components for modern React apps.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Button variant="brand-solid">Browse components</Button>
          <Button variant="outline">View on GitHub</Button>
        </div>
      </div>

      <Separator />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Components", value: "60+" },
          { label: "Primitives", value: "Base UI" },
          { label: "Bundle size", value: "~12 kB" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6 text-center">
              <p className="font-bold text-2xl">{s.value}</p>
              <p className="text-muted-foreground text-xs">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Footer */}
      <p className="text-center text-muted-foreground text-xs">
        © 2026 Strait. MIT licence.
      </p>
    </Shell>
  ),
};
