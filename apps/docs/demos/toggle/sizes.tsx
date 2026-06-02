import { TextBoldIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Toggle } from "@strait/ui/components/toggle";

export default function ToggleSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(["xs", "sm", "default", "lg", "xl"] as const).map((size) => (
        <Toggle
          aria-label={`Toggle bold ${size}`}
          emphasis="outline"
          key={size}
          size={size}
        >
          <HugeiconsIcon icon={TextBoldIcon} />
        </Toggle>
      ))}
    </div>
  );
}
