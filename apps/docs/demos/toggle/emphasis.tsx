import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Toggle } from "@strait/ui/components/toggle";

export default function ToggleEmphasis() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="w-16 text-muted-foreground text-xs">default</span>
        <div className="flex gap-2">
          <Toggle aria-label="Bold" emphasis="default">
            <HugeiconsIcon icon={TextBoldIcon} />
          </Toggle>
          <Toggle aria-label="Italic" defaultPressed emphasis="default">
            <HugeiconsIcon icon={TextItalicIcon} />
          </Toggle>
          <Toggle aria-label="Underline" emphasis="default">
            <HugeiconsIcon icon={TextUnderlineIcon} />
          </Toggle>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-16 text-muted-foreground text-xs">outline</span>
        <div className="flex gap-2">
          <Toggle aria-label="Bold" emphasis="outline">
            <HugeiconsIcon icon={TextBoldIcon} />
          </Toggle>
          <Toggle aria-label="Italic" defaultPressed emphasis="outline">
            <HugeiconsIcon icon={TextItalicIcon} />
          </Toggle>
          <Toggle aria-label="Underline" emphasis="outline">
            <HugeiconsIcon icon={TextUnderlineIcon} />
          </Toggle>
        </div>
      </div>
    </div>
  );
}
