import { InputWithAddons } from "@strait/ui/components/input-with-addons";
import { Label } from "@strait/ui/components/label";

export default function InputWithAddonsLeadingOnly() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="addons-leading">Amount</Label>
      <InputWithAddons id="addons-leading" leading="$" placeholder="0.00" />
    </div>
  );
}
