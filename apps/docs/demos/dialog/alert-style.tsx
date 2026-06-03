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

export default function DialogAlertStyle() {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="destructive-solid">Delete account</Button>}
      />
      <DialogContent showCloseButton={false}>
        <DialogHeader accent="destructive">
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All your data will be
            erased immediately.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button variant="destructive-solid">Yes, delete my account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
