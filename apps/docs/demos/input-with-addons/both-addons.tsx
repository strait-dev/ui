import { InputWithAddons } from "@strait/ui/components/input-with-addons";
import { Label } from "@strait/ui/components/label";

export default function InputWithAddonsBothAddons() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="addons-both">Website</Label>
      <InputWithAddons
        id="addons-both"
        leading="https://"
        placeholder="yoursite"
        trailing=".com"
      />
    </div>
  );
}
