import { Dollar01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@strait/ui/components/input-group";
import { Label } from "@strait/ui/components/label";

export default function InputGroupTextAddons() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ig-price">Price</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <HugeiconsIcon className="size-4" icon={Dollar01Icon} />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="ig-price" placeholder="0.00" type="number" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ig-url">Website</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="ig-url" placeholder="example.com" type="text" />
        </InputGroup>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ig-email">Email</Label>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <HugeiconsIcon className="size-4" icon={Mail01Icon} />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id="ig-email"
            placeholder="you@example.com"
            type="email"
          />
        </InputGroup>
      </div>
    </div>
  );
}
