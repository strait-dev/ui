import { Button } from "@strait/ui/components/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@strait/ui/components/hover-card";

export default function HoverCardLinkPreview() {
  return (
    <p className="text-sm">
      Read the full spec in our{" "}
      <HoverCard>
        <HoverCardTrigger
          render={
            <Button className="h-auto p-0" variant="link">
              design guidelines
            </Button>
          }
        />
        <HoverCardContent side="top">
          <div className="flex flex-col gap-1.5">
            <p className="font-medium text-sm">Design Guidelines</p>
            <p className="text-muted-foreground text-xs">
              docs.strait.design/guidelines
            </p>
            <p className="text-muted-foreground text-xs">
              Comprehensive documentation covering typography, colour, spacing,
              and component usage.
            </p>
            <p className="text-muted-foreground text-xs">
              Last updated 2 days ago
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>{" "}
      document.
    </p>
  );
}
