import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@strait/ui/components/toggle-group";

export default function ToggleGroupMultiple() {
  return (
    <ToggleGroup
      defaultValue={["bold", "underline"]}
      emphasis="outline"
      multiple
    >
      <ToggleGroupItem aria-label="Bold" value="bold">
        <HugeiconsIcon icon={TextBoldIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Italic" value="italic">
        <HugeiconsIcon icon={TextItalicIcon} />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Underline" value="underline">
        <HugeiconsIcon icon={TextUnderlineIcon} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
