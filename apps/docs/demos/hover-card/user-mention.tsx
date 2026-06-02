import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@strait/ui/components/hover-card";

export default function HoverCardUserMention() {
  return (
    <p className="text-sm">
      This task was created by{" "}
      <HoverCard>
        <HoverCardTrigger
          render={
            <Button className="h-auto p-0" variant="link">
              @jsmith
            </Button>
          }
        />
        <HoverCardContent>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon className="size-5" icon={UserIcon} />
            </div>
            <div>
              <p className="font-medium text-sm">Jane Smith</p>
              <p className="text-muted-foreground text-xs">
                jane@example.com · Admin
              </p>
            </div>
          </div>
          <p className="mt-2 text-muted-foreground text-xs">
            Leads the product design team. Based in New York.
          </p>
          <div className="mt-2 flex gap-4">
            <div>
              <p className="font-medium text-sm">48</p>
              <p className="text-muted-foreground text-xs">Tasks completed</p>
            </div>
            <div>
              <p className="font-medium text-sm">6</p>
              <p className="text-muted-foreground text-xs">Active projects</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      and assigned to you.
    </p>
  );
}
