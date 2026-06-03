import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { InputWithStartIcon } from "@strait/ui/components/input-with-start-icon";

export default function InputWithStartIconDisabled() {
  return (
    <div className="w-72">
      <InputWithStartIcon
        defaultValue="readonly query"
        disabled
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="start-icon-disabled"
        label="Search (disabled)"
        placeholder="Search…"
      />
    </div>
  );
}
