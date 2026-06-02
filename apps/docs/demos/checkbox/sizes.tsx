import { Checkbox } from "@strait/ui/components/checkbox";
import { Label } from "@strait/ui/components/label";

export default function CheckboxSizes() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Checkbox defaultChecked id="cb-sm" size="sm" />
        <Label htmlFor="cb-sm">Small (14 px)</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox defaultChecked id="cb-default" size="default" />
        <Label htmlFor="cb-default">Default (16 px)</Label>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox defaultChecked id="cb-lg" size="lg" />
        <Label htmlFor="cb-lg">Large (20 px)</Label>
      </div>
    </div>
  );
}
