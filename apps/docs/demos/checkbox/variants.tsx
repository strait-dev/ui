import { Checkbox } from "@strait/ui/components/checkbox";
import { Label } from "@strait/ui/components/label";

export default function CheckboxVariants() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked id="cv-default" variant="default" />
        <Label htmlFor="cv-default">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked id="cv-destructive" variant="destructive" />
        <Label htmlFor="cv-destructive">Destructive</Label>
      </div>
    </div>
  );
}
