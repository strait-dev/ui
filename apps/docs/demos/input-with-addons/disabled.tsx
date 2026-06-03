import { InputWithAddons } from "@strait/ui/components/input-with-addons";
import { Label } from "@strait/ui/components/label";

export default function InputWithAddonsDisabled() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="addons-disabled">Domain (read-only)</Label>
      <InputWithAddons
        defaultValue="mycompany"
        disabled
        id="addons-disabled"
        leading="https://"
        trailing=".com"
      />
    </div>
  );
}
