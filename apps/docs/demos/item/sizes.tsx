import { Folder01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@strait/ui/components/item";

const sizes = ["xs", "sm", "default", "xl"] as const;

export default function ItemSizesDemo() {
  return (
    <div className="max-w-sm">
      <ItemGroup>
        {sizes.map((size) => (
          <Item key={size} size={size} variant="outline">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={Folder01Icon} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Size — {size}</ItemTitle>
              <ItemDescription>Item row at size="{size}".</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
