import {
  Calendar01Icon,
  ChartHistogramIcon,
  CreditCardIcon,
  Home01Icon,
  Settings01Icon,
  UserIcon,
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
} from "@strait/ui/components/command";

export default function CommandWithGroups() {
  return (
    <div className="w-full max-w-sm rounded-xl border shadow-sm">
      <Command>
        <CommandInput placeholder="Search pages and actions…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem>
              <HugeiconsIcon icon={Home01Icon} />
              Dashboard
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={ChartHistogramIcon} />
              Analytics
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={Calendar01Icon} />
              Calendar
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Account">
            <CommandItem>
              <HugeiconsIcon icon={UserIcon} />
              Profile
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={CreditCardIcon} />
              Billing
            </CommandItem>
            <CommandItem>
              <HugeiconsIcon icon={Settings01Icon} />
              Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
