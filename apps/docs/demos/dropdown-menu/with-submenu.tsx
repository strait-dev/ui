import {
  Copy01Icon,
  Delete02Icon,
  Edit02Icon,
  MoreHorizontalIcon,
  Share01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@strait/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@strait/ui/components/dropdown-menu";

export default function DropdownMenuWithSubmenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button aria-label="More options" size="icon" variant="outline">
            <HugeiconsIcon icon={MoreHorizontalIcon} />
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HugeiconsIcon icon={Edit02Icon} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={Copy01Icon} />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <HugeiconsIcon icon={Share01Icon} />
              Share
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
              <DropdownMenuItem>Share via email</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <HugeiconsIcon icon={Delete02Icon} />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
