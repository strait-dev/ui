import {
  Home01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@strait/ui/components/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@strait/ui/components/sheet";

const navItems = [
  { label: "Dashboard", icon: Home01Icon },
  { label: "Profile", icon: UserIcon },
  { label: "Settings", icon: Settings01Icon },
];

export default function SheetWithNav() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open menu</Button>} />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-1 flex-col gap-1 px-4">
          {navItems.map((item) => (
            <button
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground text-sm hover:bg-muted"
              key={item.label}
              type="button"
            >
              <HugeiconsIcon className="size-4" icon={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>
        <SheetFooter>
          <SheetClose render={<Button className="w-full" variant="outline" />}>
            Close menu
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
