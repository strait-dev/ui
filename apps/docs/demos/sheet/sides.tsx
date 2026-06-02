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

const sides = ["top", "right", "bottom", "left"] as const;

export default function SheetSides() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger
            render={
              <Button variant="outline">
                {side.charAt(0).toUpperCase() + side.slice(1)}
              </Button>
            }
          />
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>
                {side.charAt(0).toUpperCase() + side.slice(1)} panel
              </SheetTitle>
              <SheetDescription>
                This sheet slides in from the {side} edge of the viewport.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose render={<Button variant="outline" />}>
                Close
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
