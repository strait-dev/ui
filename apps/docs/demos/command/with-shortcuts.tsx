import {
  Add01Icon,
  Delete02Icon,
  Edit02Icon,
  Search01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@strait/ui/components/command";

export default function CommandWithShortcuts() {
  return (
    <div className="w-full max-w-sm rounded-xl border shadow-sm">
      <Command>
        <CommandInput placeholder="Type a command…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem>
              <HugeiconsIcon icon={Add01Icon} />
              New document
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={Search01Icon} />
              Find in page
              <CommandShortcut>⌘F</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={Edit02Icon} />
              Rename
              <CommandShortcut>F2</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Danger zone">
            <CommandItem>
              <HugeiconsIcon icon={Settings01Icon} />
              Advanced settings
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={Delete02Icon} />
              Delete
              <CommandShortcut>⌫</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
