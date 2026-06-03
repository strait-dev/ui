import { Checkbox } from "@strait/ui/components/checkbox";
import { Label } from "@strait/ui/components/label";

export default function CheckboxStates() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-unchecked" />
        <Label htmlFor="cb-unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked id="cb-checked" />
        <Label htmlFor="cb-checked">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox disabled id="cb-disabled" />
        <Label htmlFor="cb-disabled">Disabled unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked disabled id="cb-disabled-checked" />
        <Label htmlFor="cb-disabled-checked">Disabled checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox aria-invalid id="cb-invalid" />
        <Label htmlFor="cb-invalid">Invalid</Label>
      </div>
    </div>
  );
}
