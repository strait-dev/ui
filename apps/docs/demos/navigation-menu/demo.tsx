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

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-1 p-2 md:w-[360px]">
              {[
                {
                  icon: Home01Icon,
                  title: "Introduction",
                  desc: "Re-usable components built with Base UI.",
                },
                {
                  icon: Settings01Icon,
                  title: "Installation",
                  desc: "How to install and configure the library.",
                },
                {
                  icon: UserIcon,
                  title: "Theming",
                  desc: "Customise tokens to match your brand.",
                },
              ].map(({ icon, title, desc }) => (
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
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Blog
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
