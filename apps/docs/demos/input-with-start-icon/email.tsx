import { Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { InputWithStartIcon } from "@strait/ui/components/input-with-start-icon";

export default function InputWithStartIconEmail() {
  return (
    <div className="w-72">
      <InputWithStartIcon
        icon={<HugeiconsIcon icon={Mail01Icon} size={16} />}
        id="start-icon-email"
        label="Email"
        placeholder="you@example.com"
        type="email"
      />
    </div>
  );
}
