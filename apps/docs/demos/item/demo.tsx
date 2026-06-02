import {
  Folder01Icon,
  Mail01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@strait/ui/components/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@strait/ui/components/item";

const items = [
  {
    id: 1,
    icon: Folder01Icon,
    title: "Projects",
    description: "12 active projects",
    badge: "12",
  },
  {
    id: 2,
    icon: Mail01Icon,
    title: "Inbox",
    description: "3 unread messages",
    badge: "3",
  },
  {
    id: 3,
    icon: Settings01Icon,
    title: "Settings",
    description: "Account and preferences",
    badge: null,
  },
];

export default function ItemDemo() {
  return (
    <div className="w-80">
      <ItemGroup>
        {items.map((item) => (
          <Item key={item.id} variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={item.icon} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{item.title}</ItemTitle>
              <ItemDescription>{item.description}</ItemDescription>
            </ItemContent>
            {item.badge ? (
              <Badge size="xs" variant="secondary">
                {item.badge}
              </Badge>
            ) : null}
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
