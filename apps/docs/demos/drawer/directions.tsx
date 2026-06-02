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

export default function DrawerDirections() {
  return (
    <div className="flex flex-wrap gap-3">
      {(["bottom", "right", "left", "top"] as const).map((direction) => (
        <Drawer direction={direction} key={direction}>
          <DrawerTrigger asChild>
            <Button variant="outline">{direction}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                {direction.charAt(0).toUpperCase() + direction.slice(1)} drawer
              </DrawerTitle>
              <DrawerDescription>
                Slides in from the {direction} edge.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 py-2">
              <p className="text-muted-foreground text-sm">
                Drawer body content goes here.
              </p>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  );
}
