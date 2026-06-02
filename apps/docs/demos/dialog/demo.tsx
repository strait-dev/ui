import { Button } from "@strait/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@strait/ui/components/dialog";

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your display name and bio. Changes will be visible to your
            team immediately.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="default">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
