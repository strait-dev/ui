"use client";

import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@strait/ui/components/collapsible";

export default function CollapsibleControlled() {
  return (
    <Collapsible className="w-80" defaultOpen>
      <div className="flex items-center justify-between rounded-lg border px-4 py-2">
        <span className="font-medium text-sm">Project members</span>
        <CollapsibleTrigger
          render={
            <Button aria-label="Toggle members" size="icon-sm" variant="ghost">
              <HugeiconsIcon icon={PlusSignIcon} />
            </Button>
          }
        />
      </div>
      <CollapsibleContent className="mt-2 space-y-2">
        {["Alice Johnson", "Bob Smith", "Carol White"].map((name) => (
          <div
            className="rounded-md border px-4 py-2 font-mono text-sm"
            key={name}
          >
            {name}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
