"use client";

import { Button } from "@strait/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@strait/ui/components/collapsible";

export default function CollapsibleDemo() {
  return (
    <Collapsible className="w-80" defaultOpen>
      <div className="flex items-center justify-between rounded-lg border px-4 py-2">
        <span className="font-medium text-sm">Recent activity</span>
        <CollapsibleTrigger
          render={
            <Button aria-label="Toggle activity" size="sm" variant="ghost">
              Hide
            </Button>
          }
        />
      </div>
      <CollapsibleContent className="mt-2 space-y-2">
        {[
          "Pushed 3 commits to main",
          "Opened PR #42: Add dark mode",
          "Commented on issue #17",
        ].map((item) => (
          <div className="rounded-md bg-muted px-3 py-2 text-sm" key={item}>
            {item}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
