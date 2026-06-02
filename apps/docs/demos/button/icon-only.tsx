import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";

export default function ButtonIconOnly() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button aria-label="Settings" size="icon-sm" variant="outline">
        <HugeiconsIcon icon={Settings01Icon} />
      </Button>
      <Button aria-label="Settings" size="icon" variant="outline">
        <HugeiconsIcon icon={Settings01Icon} />
      </Button>
      <Button aria-label="Settings" size="icon-lg" variant="outline">
        <HugeiconsIcon icon={Settings01Icon} />
      </Button>
    </div>
  );
}
