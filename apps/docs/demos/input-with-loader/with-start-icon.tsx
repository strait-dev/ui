import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { InputWithLoader } from "@strait/ui/components/input-with-loader";
import { Label } from "@strait/ui/components/label";

export default function InputWithLoaderWithStartIcon() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="loader-start">Search</Label>
      <InputWithLoader
        icon={<HugeiconsIcon icon={Search01Icon} size={16} />}
        id="loader-start"
        placeholder="Search…"
      />
    </div>
  );
}
