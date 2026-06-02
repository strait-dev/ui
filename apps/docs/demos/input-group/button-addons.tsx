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

export default function InputGroupButtonAddons() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ig-search">Search</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <HugeiconsIcon className="size-4" icon={Search01Icon} />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="ig-search" placeholder="Search anything…" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="xs" type="submit" variant="secondary">
              Go
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ig-key">API key</Label>
        <InputGroup>
          <InputGroupInput
            defaultValue="sk_live_AbCdEfGhIjKl"
            id="ig-key"
            readOnly
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="xs" variant="ghost">
              Copy
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  );
}
