import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { InputWithStartIcon } from "@strait/ui/components/input-with-start-icon";

export default function InputWithStartIconDemo() {
  return (
    <div className="w-72">
      <InputWithStartIcon
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="start-icon-demo"
        label="Search"
        placeholder="Search…"
      />
    </div>
  );
}
