import { Mail01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@strait/ui/components/input-group";
import { Label } from "@strait/ui/components/label";

export default function InputGroupStates() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Disabled</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <HugeiconsIcon className="size-4" icon={Search01Icon} />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput disabled placeholder="Cannot search" />
        </InputGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Invalid</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <HugeiconsIcon className="size-4" icon={Mail01Icon} />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            aria-invalid
            placeholder="you@example.com"
            type="email"
          />
        </InputGroup>
        <p className="text-destructive text-sm">Enter a valid email address.</p>
      </div>
    </div>
  );
}
