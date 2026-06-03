import { PlusSignIcon } from "@hugeicons/core-free-icons";
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

export default function DrawerWithForm() {
  return (
    <Drawer direction="bottom">
      <DrawerTrigger asChild>
        <Button variant="brand-solid">
          <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
          New task
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create task</DrawerTitle>
          <DrawerDescription>
            Add a new task to the current project.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-3 px-4 py-2">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="task-name">
              Task name
            </label>
            <input
              className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
              id="task-name"
              placeholder="e.g. Design the onboarding screens"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="task-priority">
              Priority
            </label>
            <select
              className="rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none ring-1 ring-foreground/10 focus:ring-2 focus:ring-foreground/20"
              id="task-priority"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
        <DrawerFooter>
          <Button variant="brand-solid">Create task</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
