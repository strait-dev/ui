import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@strait/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@strait/ui/components/tooltip";

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button aria-label="Settings" size="icon" variant="outline">
              <HugeiconsIcon icon={Settings01Icon} />
            </Button>
          }
        />
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
