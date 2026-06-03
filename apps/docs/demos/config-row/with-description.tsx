import {
  Calendar01Icon,
  DatabaseIcon,
  Timer01Icon,
} from "@hugeicons/core-free-icons";
import { ConfigRow } from "@strait/ui/components/config-row";

export default function ConfigRowWithDescription() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <ConfigRow
        description="How long raw events are stored before deletion."
        icon={Timer01Icon}
        label="Retention"
        value="90 days"
      />
      <ConfigRow
        description="Storage region for all uploaded assets."
        icon={DatabaseIcon}
        label="Storage"
        value="us-east-1"
      />
      <ConfigRow
        description="Date when the current billing cycle renews."
        icon={Calendar01Icon}
        label="Next renewal"
        value="2026-07-01"
      />
    </div>
  );
}
