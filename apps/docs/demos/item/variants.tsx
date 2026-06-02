import {
  Folder01Icon,
  Mail01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
    variant: "default",
    icon: Folder01Icon,
    title: "Default",
    desc: "No border, transparent background.",
  },
  {
    variant: "outline",
    icon: Settings01Icon,
    title: "Outline",
    desc: "Visible border around the row.",
  },
  {
    variant: "muted",
    icon: Mail01Icon,
    title: "Muted",
    desc: "Subtle muted background.",
  },
  {
    variant: "ghost",
    icon: Folder01Icon,
    title: "Ghost",
    desc: "Transparent until hovered.",
  },
] as const;

export default function ItemVariantsDemo() {
  return (
    <div className="max-w-sm">
      <ItemGroup>
        {items.map(({ variant, icon, title, desc }) => (
          <Item key={variant} variant={variant}>
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={icon} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{title}</ItemTitle>
              <ItemDescription>{desc}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
