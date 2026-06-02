import { Button } from "@strait/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@strait/ui/components/drawer";

export default function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Quick actions</DrawerTitle>
          <DrawerDescription>
            Choose an action to perform on the selected items.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-1 px-4">
          {["Rename", "Duplicate", "Move to folder", "Archive"].map((label) => (
            <button
              className="rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
              key={label}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
