import {
  Home01Icon,
  Notification01Icon,
  Search01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  NavigationRail,
  NavigationRailFooter,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationRailSection,
} from "./navigation-rail";

const meta: Meta<typeof NavigationRail> = {
  title: "Navigation/NavigationRail",
  component: NavigationRail,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A compact vertical icon rail used as the primary navigation in app-shell layouts.",
          "",
          "Exports: `NavigationRail`, `NavigationRailItem`, `NavigationRailSection`,",
          "`NavigationRailHeader`, `NavigationRailFooter`.",
          "",
          "`NavigationRail` wraps children in a `TooltipProvider`, so each",
          "`NavigationRailItem` automatically shows the `label` as a side tooltip.",
          "",
          "Props of note:",
          '- `NavigationRail.orientation` — `"left"` (default) or `"right"`.',
          "- `NavigationRailItem.icon` — required `IconSvgElement` from Hugeicons.",
          "- `NavigationRailItem.isActive` — applies secondary/accent background.",
          "- `NavigationRailItem.badge` — renders a small dot badge on the icon.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    orientation: {
      control: "radio",
      options: ["left", "right"],
      description: "Side of the screen the rail is placed on.",
      table: { defaultValue: { summary: "left" } },
    },
  },
  args: {
    orientation: "left",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — hover each icon to see its tooltip. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex h-96 w-fit rounded-lg border">
      <NavigationRail {...args}>
        <NavigationRailSection>
          <NavigationRailItem icon={Home01Icon} label="Home" isActive />
          <NavigationRailItem icon={Search01Icon} label="Search" />
          <NavigationRailItem icon={Notification01Icon} label="Notifications" />
          <NavigationRailItem icon={Settings01Icon} label="Settings" />
        </NavigationRailSection>
      </NavigationRail>
    </div>
  ),
};

/** Full rail layout with header, main section, and footer. */
export const WithHeaderAndFooter: Story = {
  render: (args) => (
    <div className="flex h-96 w-fit rounded-lg border">
      <NavigationRail {...args}>
        <NavigationRailHeader>
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
            S
          </div>
        </NavigationRailHeader>
        <NavigationRailSection>
          <NavigationRailItem icon={Home01Icon} label="Home" isActive />
          <NavigationRailItem icon={Search01Icon} label="Search" />
          <NavigationRailItem icon={Notification01Icon} label="Notifications" />
        </NavigationRailSection>
        <NavigationRailFooter>
          <NavigationRailItem icon={Settings01Icon} label="Settings" />
          <NavigationRailItem icon={UserIcon} label="Profile" />
        </NavigationRailFooter>
      </NavigationRail>
    </div>
  ),
};

/** Right-oriented rail — border flips to the left side. */
export const RightOrientation: Story = {
  render: (args) => (
    <div className="flex h-96 w-fit rounded-lg border">
      <NavigationRail {...args} orientation="right">
        <NavigationRailSection>
          <NavigationRailItem icon={Home01Icon} label="Home" isActive />
          <NavigationRailItem icon={Search01Icon} label="Search" />
          <NavigationRailItem icon={Settings01Icon} label="Settings" />
        </NavigationRailSection>
      </NavigationRail>
    </div>
  ),
};

/** Badge on an item — a 2×2 dot appears in the top-right corner. */
export const WithBadge: Story = {
  render: (args) => (
    <div className="flex h-72 w-fit rounded-lg border">
      <NavigationRail {...args}>
        <NavigationRailSection>
          <NavigationRailItem icon={Home01Icon} label="Home" isActive />
          <NavigationRailItem
            icon={Notification01Icon}
            label="Notifications"
            badge={<span className="h-2 w-2 rounded-full bg-destructive" />}
          />
          <NavigationRailItem icon={Settings01Icon} label="Settings" />
        </NavigationRailSection>
      </NavigationRail>
    </div>
  ),
};

/** Disabled item — reduced opacity and non-interactive. */
export const WithDisabled: Story = {
  render: (args) => (
    <div className="flex h-72 w-fit rounded-lg border">
      <NavigationRail {...args}>
        <NavigationRailSection>
          <NavigationRailItem icon={Home01Icon} label="Home" isActive />
          <NavigationRailItem icon={Search01Icon} label="Search" disabled />
          <NavigationRailItem icon={Settings01Icon} label="Settings" />
        </NavigationRailSection>
      </NavigationRail>
    </div>
  ),
};

/** Controlled active state via React state. */
export const Controlled: Story = {
  render: (args) => {
    const items = [
      { icon: Home01Icon, label: "Home", id: "home" },
      { icon: Search01Icon, label: "Search", id: "search" },
      { icon: Notification01Icon, label: "Notifications", id: "notifications" },
      { icon: Settings01Icon, label: "Settings", id: "settings" },
    ] as const;

    const [active, setActive] = useState<string>("home");

    return (
      <div className="flex h-96 items-start gap-6">
        <div className="flex h-96 w-fit rounded-lg border">
          <NavigationRail {...args}>
            <NavigationRailSection>
              {items.map(({ icon, label, id }) => (
                <NavigationRailItem
                  key={id}
                  icon={icon}
                  label={label}
                  isActive={active === id}
                  onClick={() => setActive(id)}
                />
              ))}
            </NavigationRailSection>
          </NavigationRail>
        </div>
        <p className="mt-4 text-muted-foreground text-sm">
          Active: <strong>{active}</strong>
        </p>
      </div>
    );
  },
};
