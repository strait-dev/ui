import {
  Copy01Icon,
  Delete02Icon,
  Edit02Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@strait/ui/components/context-menu";

export default function ContextMenuWithSubmenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex h-32 w-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
          Right-click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <HugeiconsIcon icon={Edit02Icon} />
          Rename
          <ContextMenuShortcut>↵</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <HugeiconsIcon icon={Copy01Icon} />
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <HugeiconsIcon icon={PlusSignIcon} />
            Move to
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>components/</ContextMenuItem>
            <ContextMenuItem>pages/</ContextMenuItem>
            <ContextMenuItem>lib/</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <HugeiconsIcon icon={Delete02Icon} />
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
