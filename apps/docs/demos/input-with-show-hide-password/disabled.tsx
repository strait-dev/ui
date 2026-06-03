import { InputWithShowHidePassword } from "@strait/ui/components/input-with-show-hide-password";
import { Label } from "@strait/ui/components/label";

export default function InputWithShowHidePasswordDisabled() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="show-hide-disabled">Password (read-only)</Label>
      <InputWithShowHidePassword
        defaultValue="readonlypassword"
        disabled
        id="show-hide-disabled"
        placeholder="Enter password"
      />
    </div>
  );
}
