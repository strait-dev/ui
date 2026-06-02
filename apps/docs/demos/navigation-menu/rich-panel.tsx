import {
  Home01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@strait/ui/components/navigation-menu";

const platformLinks = [
  {
    icon: Home01Icon,
    title: "Dashboard",
    desc: "Overview of your workspace activity.",
  },
  {
    icon: UserIcon,
    title: "Team",
    desc: "Manage members and permissions.",
  },
  {
    icon: Settings01Icon,
    title: "Settings",
    desc: "Configure your account and integrations.",
  },
];

export default function NavigationMenuRichPanelDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid grid-cols-1 gap-1 p-2 md:w-[360px]">
              {platformLinks.map(({ icon, title, desc }) => (
                <li key={title}>
                  <NavigationMenuLink href="#">
                    <HugeiconsIcon className="size-4 shrink-0" icon={icon} />
                    <span>
                      <strong className="block font-medium text-sm">
                        {title}
                      </strong>
                      <span className="text-muted-foreground text-xs">
                        {desc}
                      </span>
                    </span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
