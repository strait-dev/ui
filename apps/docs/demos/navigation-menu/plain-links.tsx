import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@strait/ui/components/navigation-menu";

export default function NavigationMenuPlainLinksDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            active
            className={navigationMenuTriggerStyle()}
            href="#"
          >
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        {["Components", "Blog", "Pricing", "About"].map((label) => (
          <NavigationMenuItem key={label}>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="#"
            >
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
