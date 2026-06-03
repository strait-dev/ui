import { ArrowRight01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";

export default function ButtonWithIcon() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <HugeiconsIcon data-icon="inline-start" icon={PlusSignIcon} />
        New project
      </Button>
      <Button variant="outline">
        Continue
        <HugeiconsIcon data-icon="inline-end" icon={ArrowRight01Icon} />
      </Button>
    </div>
  );
}
