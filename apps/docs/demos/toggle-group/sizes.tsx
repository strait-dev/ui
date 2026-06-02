import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@strait/ui/components/toggle-group";

export default function ToggleGroupSizes() {
  return (
    <div className="flex flex-col items-center gap-3">
      {(["xs", "sm", "default", "lg", "xl"] as const).map((size) => (
        <ToggleGroup
          defaultValue={["center"]}
          emphasis="outline"
          key={size}
          size={size}
        >
          <ToggleGroupItem aria-label="Align left" value="left">
            <HugeiconsIcon icon={TextAlignLeftIcon} />
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Align center" value="center">
            <HugeiconsIcon icon={TextAlignCenterIcon} />
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Align right" value="right">
            <HugeiconsIcon icon={TextAlignRightIcon} />
          </ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  );
}
