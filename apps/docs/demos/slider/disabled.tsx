import { Label } from "@strait/ui/components/label";
import { Slider } from "@strait/ui/components/slider";

export default function SliderDisabled() {
  return (
    <div className="flex w-72 flex-col gap-2">
      <Label>Volume (disabled)</Label>
      <Slider
        aria-label="Disabled volume"
        defaultValue={[50]}
        disabled
        max={100}
        min={0}
      />
    </div>
  );
}
