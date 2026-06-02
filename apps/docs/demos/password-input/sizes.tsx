import { Label } from "@strait/ui/components/label";
import { PasswordInput } from "@strait/ui/components/password-input";

export default function PasswordInputSizes() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <div>
        <Label className="mb-1.5 block">Small</Label>
        <PasswordInput id="pw-sm" placeholder="Small password" size="sm" />
      </div>
      <div>
        <Label className="mb-1.5 block">Default</Label>
        <PasswordInput
          id="pw-default"
          placeholder="Default password"
          size="default"
        />
      </div>
      <div>
        <Label className="mb-1.5 block">Large</Label>
        <PasswordInput id="pw-lg" placeholder="Large password" size="lg" />
      </div>
    </div>
  );
}
