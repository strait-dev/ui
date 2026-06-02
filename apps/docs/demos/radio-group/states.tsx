import { Label } from "@strait/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@strait/ui/components/radio-group";

export default function RadioGroupStates() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 font-medium text-muted-foreground text-xs">
          Default
        </p>
        <RadioGroup defaultValue="a">
          <div className="flex items-center gap-2">
            <RadioGroupItem id="state-a" value="a" />
            <Label htmlFor="state-a">Option A (selected)</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="state-b" value="b" />
            <Label htmlFor="state-b">Option B</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <p className="mb-2 font-medium text-muted-foreground text-xs">
          Disabled group
        </p>
        <RadioGroup defaultValue="x" disabled>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="dis-x" value="x" />
            <Label htmlFor="dis-x">Checked disabled</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="dis-y" value="y" />
            <Label htmlFor="dis-y">Unchecked disabled</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
