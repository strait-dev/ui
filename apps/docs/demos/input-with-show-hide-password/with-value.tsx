import { InputWithShowHidePassword } from "@strait/ui/components/input-with-show-hide-password";
import { Label } from "@strait/ui/components/label";

export default function InputWithShowHidePasswordWithValue() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="show-hide-value">Password</Label>
      <InputWithShowHidePassword
        defaultValue="mySecretPass123"
        id="show-hide-value"
        placeholder="Enter password"
      />
    </div>
  );
}
