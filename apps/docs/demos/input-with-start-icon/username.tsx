import { UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { InputWithStartIcon } from "@strait/ui/components/input-with-start-icon";

export default function InputWithStartIconUsername() {
  return (
    <div className="w-72">
      <InputWithStartIcon
        icon={<HugeiconsIcon icon={UserIcon} size={16} />}
        id="start-icon-username"
        label="Username"
        placeholder="johndoe"
      />
    </div>
  );
}
