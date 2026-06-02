import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@strait/ui/components/alert-dialog";
import { Button } from "@strait/ui/components/button";

export default function AlertDialogSizes() {
  return (
    <div className="flex flex-wrap gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <AlertDialog key={size}>
          <AlertDialogTrigger
            render={<Button variant="outline">size="{size}"</Button>}
          />
          <AlertDialogContent size={size}>
            <AlertDialogHeader>
              <AlertDialogTitle>size="{size}" dialog</AlertDialogTitle>
              <AlertDialogDescription>
                This alert dialog uses the {size} size variant.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  );
}
