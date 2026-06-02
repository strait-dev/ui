import {
  Copy01Icon,
  Delete02Icon,
  Edit02Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@strait/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@strait/ui/components/tooltip";

export default function TooltipSides() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button aria-label="Copy" size="icon" variant="outline">
                <HugeiconsIcon icon={Copy01Icon} />
              </Button>
            }
          />
          <TooltipContent side="top">Copy (top)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button aria-label="Edit" size="icon" variant="outline">
                <HugeiconsIcon icon={Edit02Icon} />
              </Button>
            }
          />
          <TooltipContent side="right">Edit (right)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button aria-label="Delete" size="icon" variant="outline">
                <HugeiconsIcon icon={Delete02Icon} />
              </Button>
            }
          />
          <TooltipContent side="bottom">Delete (bottom)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button aria-label="Settings" size="icon" variant="outline">
                <HugeiconsIcon icon={Settings01Icon} />
              </Button>
            }
          />
          <TooltipContent side="left">Settings (left)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
