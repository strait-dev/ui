import { Button } from "@strait/ui/components/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@strait/ui/components/hover-card";

export default function HoverCardPlacements() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {(["top", "bottom", "left", "right"] as const).map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger
            render={
              <Button size="sm" variant="outline">
                {side}
              </Button>
            }
          />
          <HoverCardContent side={side}>
            <p className="font-medium text-sm">Placed on {side}</p>
            <p className="text-muted-foreground text-xs">
              Hover card appears on the {side} side.
            </p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}
