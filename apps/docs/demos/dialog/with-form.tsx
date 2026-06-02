"use client";

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
import { useState } from "react";

export default function DialogWithForm() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={<Button variant="outline">Edit profile</Button>} />
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your display name and email address below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="name">
              Display name
            </label>
            <input
              className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue="Acme Corp"
              id="name"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium text-sm" htmlFor="email">
              Email
            </label>
            <input
              className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue="hello@acme.com"
              id="email"
              type="email"
            />
          </div>
        </div>
        <DialogFooter showCloseButton>
          <Button onClick={() => setOpen(false)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
