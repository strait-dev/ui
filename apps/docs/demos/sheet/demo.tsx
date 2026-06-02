import { Button } from "@strait/ui/components/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@strait/ui/components/sheet";

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open sheet</Button>} />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>
            Manage your workspace preferences below.
          </SheetDescription>
        </SheetHeader>
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
        <SheetFooter>
          <Button variant="default">Save changes</Button>
          <SheetClose render={<Button variant="outline" />}>Discard</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
