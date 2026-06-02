"use client";

import {
  Home01Icon,
  Search01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import {
  NavigationRail,
  NavigationRailFooter,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationRailSection,
} from "@strait/ui/components/navigation-rail";
import { useState } from "react";

const items = [
  { icon: Home01Icon, label: "Home", id: "home" },
  { icon: Search01Icon, label: "Search", id: "search" },
  { icon: Settings01Icon, label: "Settings", id: "settings" },
] as const;

export default function NavigationRailRightDemo() {
  const [active, setActive] = useState("home");

  return (
    <div className="flex h-80 w-fit rounded-lg border">
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-muted-foreground text-sm">
          Main content — rail is on the right.
        </p>
      </div>
      <NavigationRail orientation="right">
        <NavigationRailHeader>
          <div className="flex size-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground text-sm">
            S
          </div>
        </NavigationRailHeader>
        <NavigationRailSection>
          {items.map(({ icon, label, id }) => (
            <NavigationRailItem
              active={active === id}
              icon={icon}
              key={id}
              label={label}
              onClick={() => setActive(id)}
            />
          ))}
        </NavigationRailSection>
        <NavigationRailFooter>
          <NavigationRailItem icon={UserIcon} label="Profile" />
        </NavigationRailFooter>
      </NavigationRail>
    </div>
  );
}
