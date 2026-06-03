import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@strait/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@strait/ui/components/tooltip";

export default function TooltipVariants() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button aria-label="Dark tooltip" size="icon" variant="outline">
                <HugeiconsIcon icon={InformationCircleIcon} />
              </Button>
            }
          />
          <TooltipContent variant="default">Dark (default)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button aria-label="Light tooltip" size="icon" variant="outline">
                <HugeiconsIcon icon={InformationCircleIcon} />
              </Button>
            }
          />
          <TooltipContent variant="light">Light variant</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                aria-label="Compact tooltip"
                size="icon"
                variant="outline"
              >
                <HugeiconsIcon icon={InformationCircleIcon} />
              </Button>
            }
          />
          <TooltipContent size="sm">Compact (sm)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
