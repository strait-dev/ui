import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@strait/ui/components/input-group";
import { Label } from "@strait/ui/components/label";

export default function InputGroupDemo() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="search">Search</Label>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <HugeiconsIcon className="size-4" icon={Search01Icon} />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput id="search" placeholder="Search anything…" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="xs" type="submit" variant="secondary">
            Go
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
