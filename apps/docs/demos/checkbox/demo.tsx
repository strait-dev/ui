import { Checkbox } from "@strait/ui/components/checkbox";
import { Label } from "@strait/ui/components/label";

export default function CheckboxDemo() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  );
}
