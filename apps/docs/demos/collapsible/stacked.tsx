import { Button } from "@strait/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@strait/ui/components/collapsible";

const sections = [
  {
    id: "appearance",
    label: "Appearance",
    content: "Choose your colour scheme, font size, and interface density.",
  },
  {
    id: "notifications",
    label: "Notifications",
    content:
      "Configure email digests, browser push notifications, and Slack alerts.",
  },
  {
    id: "privacy",
    label: "Privacy",
    content:
      "Manage data sharing, analytics opt-out, and session history settings.",
  },
];

export default function CollapsibleStacked() {
  return (
    <div className="w-80 space-y-2">
      {sections.map((s) => (
        <Collapsible key={s.id}>
          <div className="flex items-center justify-between rounded-lg border px-4 py-2.5">
            <span className="font-medium text-sm">{s.label}</span>
            <CollapsibleTrigger
              render={
                <Button
                  aria-label={`Toggle ${s.label}`}
                  size="sm"
                  variant="ghost"
                >
                  Expand
                </Button>
              }
            />
          </div>
          <CollapsibleContent className="rounded-b-lg border border-t-0 px-4 py-3">
            <p className="text-muted-foreground text-sm">{s.content}</p>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
