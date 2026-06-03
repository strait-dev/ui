import { Folder01Icon, MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@strait/ui/components/badge";
import { Button } from "@strait/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@strait/ui/components/item";

const projects = [
  { title: "Design System", desc: "15 open tasks", badge: "Active" as const },
  {
    title: "Marketing Site",
    desc: "All tasks complete",
    badge: "Completed" as const,
  },
  { title: "Mobile App", desc: "3 blocked tasks", badge: "Paused" as const },
];

const badgeVariant = (badge: "Active" | "Completed" | "Paused") => {
  if (badge === "Active") {
    return "success-light" as const;
  }
  if (badge === "Completed") {
    return "info-light" as const;
  }
  return "warning-light" as const;
};

export default function ItemWithActionsDemo() {
  return (
    <div className="max-w-sm">
      <ItemGroup>
        {projects.map(({ title, desc, badge }) => (
          <Item key={title} variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={Folder01Icon} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
              <ItemDescription>{desc}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant={badgeVariant(badge)}>{badge}</Badge>
              <Button aria-label="More options" size="icon-xs" variant="ghost">
                <HugeiconsIcon icon={MoreHorizontalIcon} />
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
