import { Label } from "@strait/ui/components/label";
import { Slider } from "@strait/ui/components/slider";

export default function SliderSizes() {
  return (
    <div className="flex w-72 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label>Small</Label>
        <Slider aria-label="Volume small" defaultValue={[40]} size="sm" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Default</Label>
        <Slider
          aria-label="Volume default"
          defaultValue={[40]}
          size="default"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Large</Label>
        <Slider aria-label="Volume large" defaultValue={[40]} size="lg" />
      </div>
    </div>
  );
}
