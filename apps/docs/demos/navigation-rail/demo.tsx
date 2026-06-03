"use client";

import {
  Home01Icon,
  Notification01Icon,
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
  { icon: Notification01Icon, label: "Notifications", id: "notifications" },
] as const;

export default function NavigationRailDemo() {
  const [active, setActive] = useState("home");

  return (
    <div className="flex h-80 w-fit rounded-lg border">
      <NavigationRail>
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
          <NavigationRailItem icon={Settings01Icon} label="Settings" />
          <NavigationRailItem icon={UserIcon} label="Profile" />
        </NavigationRailFooter>
      </NavigationRail>
    </div>
  );
}
