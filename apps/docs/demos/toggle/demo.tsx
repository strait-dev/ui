import { TextBoldIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Toggle } from "@strait/ui/components/toggle";

export default function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bold">
      <HugeiconsIcon icon={TextBoldIcon} />
    </Toggle>
  );
}
