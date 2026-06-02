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

export default function DialogSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Dialog>
        <DialogTrigger render={<Button variant="outline">Small</Button>} />
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Small dialog</DialogTitle>
            <DialogDescription>
              Use the small size for compact confirmations or brief messages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger render={<Button variant="outline">Large</Button>} />
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Large dialog</DialogTitle>
            <DialogDescription>
              Use the large size for content-rich dialogs or multi-step flows
              that need more horizontal space.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger
          render={<Button variant="outline">Extra large</Button>}
        />
        <DialogContent size="xl">
          <DialogHeader>
            <DialogTitle>Extra large dialog</DialogTitle>
            <DialogDescription>
              Use the extra large size for wide tables, data grids, or complex
              editor surfaces that require the most available space.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </div>
  );
}
