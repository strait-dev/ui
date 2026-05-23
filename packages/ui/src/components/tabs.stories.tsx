import {
  Home01Icon,
  Search01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Tabs organise content into discrete panels, showing one at a time.",
          "",
          "Built on **Base UI** `@base-ui/react/tabs`. Key composition:",
          "- `Tabs` — root; accepts `defaultValue`, `value`, `onValueChange`, `orientation`.",
          "- `TabsList` — the tab bar; accepts `variant`: `default` (pill strip) or `line`",
          "  (underline indicator).",
          "- `TabsTrigger` — individual tab button; maps to `TabsPrimitive.Tab`.",
          "- `TabsContent` — panel; maps to `TabsPrimitive.Panel`.",
          "",
          "Use `render` (not `asChild`) on Base UI parts when you need to swap the",
          "underlying element.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Layout direction of the tab list.",
      table: { defaultValue: { summary: "horizontal" } },
    },
  },
  args: {
    defaultValue: "account",
    orientation: "horizontal",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — tweak orientation and variant via controls. */
export const Playground: Story = {
  render: (args) => (
    <Tabs {...args} className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-muted-foreground text-sm">
          Manage your account settings.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-muted-foreground text-sm">
          Change your password here.
        </p>
      </TabsContent>
      <TabsContent value="notifications">
        <p className="text-muted-foreground text-sm">
          Configure notification preferences.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

/** `default` variant — pill-shaped active indicator on a muted background. */
export const DefaultVariant: Story = {
  render: (args) => (
    <Tabs {...args} className="w-full max-w-sm">
      <TabsList variant="default">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="mt-2 text-muted-foreground text-sm">Account content.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="mt-2 text-muted-foreground text-sm">Password content.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="mt-2 text-muted-foreground text-sm">Settings content.</p>
      </TabsContent>
    </Tabs>
  ),
};

/** `line` variant — a subtle underline indicator, no background fill. */
export const LineVariant: Story = {
  render: (args) => (
    <Tabs {...args} className="w-full max-w-sm">
      <TabsList variant="line">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="mt-2 text-muted-foreground text-sm">Account content.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="mt-2 text-muted-foreground text-sm">Password content.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="mt-2 text-muted-foreground text-sm">Settings content.</p>
      </TabsContent>
    </Tabs>
  ),
};

/** Vertical orientation — tab list stacks on the left, content on the right. */
export const Vertical: Story = {
  render: (args) => (
    <Tabs {...args} orientation="vertical" className="w-full max-w-lg">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent className="px-4" value="account">
        <p className="text-muted-foreground text-sm">Account content.</p>
      </TabsContent>
      <TabsContent className="px-4" value="password">
        <p className="text-muted-foreground text-sm">Password content.</p>
      </TabsContent>
      <TabsContent className="px-4" value="settings">
        <p className="text-muted-foreground text-sm">Settings content.</p>
      </TabsContent>
    </Tabs>
  ),
};

/** Tabs with leading icons next to the label. */
export const WithIcons: Story = {
  render: (args) => (
    <Tabs {...args} className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="account">
          <HugeiconsIcon icon={UserIcon} />
          Account
        </TabsTrigger>
        <TabsTrigger value="search">
          <HugeiconsIcon icon={Search01Icon} />
          Search
        </TabsTrigger>
        <TabsTrigger value="settings">
          <HugeiconsIcon icon={Settings01Icon} />
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="mt-2 text-muted-foreground text-sm">
          Manage your account.
        </p>
      </TabsContent>
      <TabsContent value="search">
        <p className="mt-2 text-muted-foreground text-sm">Search content.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="mt-2 text-muted-foreground text-sm">Adjust settings.</p>
      </TabsContent>
    </Tabs>
  ),
};

/** A tab that is disabled. */
export const WithDisabled: Story = {
  render: (args) => (
    <Tabs {...args} className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger disabled value="team">
          Team (disabled)
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="mt-2 text-muted-foreground text-sm">Account panel.</p>
      </TabsContent>
      <TabsContent value="billing">
        <p className="mt-2 text-muted-foreground text-sm">Billing panel.</p>
      </TabsContent>
      <TabsContent value="team">
        <p className="mt-2 text-muted-foreground text-sm">Team panel.</p>
      </TabsContent>
    </Tabs>
  ),
};

/** Fully controlled — the active tab is driven by React state. */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("home");
    return (
      <div className="flex w-full max-w-sm flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          Active tab: <strong>{value}</strong>
        </p>
        <Tabs
          value={value}
          onValueChange={(v) => setValue(v ?? "")}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="home">
              <HugeiconsIcon icon={Home01Icon} />
              Home
            </TabsTrigger>
            <TabsTrigger value="search">
              <HugeiconsIcon icon={Search01Icon} />
              Search
            </TabsTrigger>
            <TabsTrigger value="settings">
              <HugeiconsIcon icon={Settings01Icon} />
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <p className="mt-2 text-muted-foreground text-sm">Home content.</p>
          </TabsContent>
          <TabsContent value="search">
            <p className="mt-2 text-muted-foreground text-sm">
              Search content.
            </p>
          </TabsContent>
          <TabsContent value="settings">
            <p className="mt-2 text-muted-foreground text-sm">
              Settings content.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    );
  },
};
