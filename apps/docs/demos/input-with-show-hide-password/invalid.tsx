import { InputWithShowHidePassword } from "@strait/ui/components/input-with-show-hide-password";
import { Label } from "@strait/ui/components/label";

export default function InputWithShowHidePasswordInvalid() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="show-hide-invalid">Password</Label>
      <InputWithShowHidePassword
        aria-invalid
        defaultValue="short"
        id="show-hide-invalid"
        placeholder="Enter password"
      />
      <p className="text-destructive text-sm">
        Password must be at least 8 characters.
      </p>
    </div>
  );
}
