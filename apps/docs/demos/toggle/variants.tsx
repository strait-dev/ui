import { TextBoldIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Toggle } from "@strait/ui/components/toggle";

export default function ToggleVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(["default", "destructive", "success", "info", "warning"] as const).map(
        (variant) => (
          <Toggle
            aria-label={`Toggle ${variant}`}
            defaultPressed
            emphasis="outline"
            key={variant}
            variant={variant}
          >
            <HugeiconsIcon icon={TextBoldIcon} />
          </Toggle>
        )
      )}
    </div>
  );
}
