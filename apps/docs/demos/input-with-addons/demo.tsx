import { InputWithAddons } from "@strait/ui/components/input-with-addons";
import { Label } from "@strait/ui/components/label";

export default function InputWithAddonsDemo() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="addon-demo">Website</Label>
      <InputWithAddons
        id="addon-demo"
        leading="https://"
        placeholder="yoursite"
        trailing=".com"
      />
    </div>
  );
}
