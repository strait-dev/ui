import { InputWithShowHidePassword } from "@strait/ui/components/input-with-show-hide-password";
import { Label } from "@strait/ui/components/label";

export default function InputWithShowHidePasswordDemo() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="show-hide-demo">Password</Label>
      <InputWithShowHidePassword
        id="show-hide-demo"
        placeholder="Enter your password"
      />
    </div>
  );
}
