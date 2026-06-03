import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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

export default function DrawerRightPanel() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <HugeiconsIcon data-icon="inline-start" icon={Settings01Icon} />
          Settings panel
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Workspace settings</DrawerTitle>
          <DrawerDescription>
            Adjust your workspace preferences below.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 p-4">
          {[
            { label: "Show sidebar labels", defaultChecked: true },
            { label: "Enable keyboard shortcuts", defaultChecked: true },
            { label: "Compact mode", defaultChecked: false },
          ].map((item) => (
            <label
              className="flex cursor-pointer items-center justify-between gap-4"
              key={item.label}
            >
              <span className="text-sm">{item.label}</span>
              <input
                className="size-4"
                defaultChecked={item.defaultChecked}
                type="checkbox"
              />
            </label>
          ))}
        </div>
        <DrawerFooter>
          <Button variant="default">Save changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Discard</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
