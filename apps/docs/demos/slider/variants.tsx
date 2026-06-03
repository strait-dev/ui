import { Label } from "@strait/ui/components/label";
import { Slider } from "@strait/ui/components/slider";

export default function SliderVariants() {
  return (
    <div className="flex w-72 flex-col gap-6">
      {(["default", "success", "warning", "info", "destructive"] as const).map(
        (variant) => (
          <div className="flex flex-col gap-2" key={variant}>
            <Label className="capitalize">{variant}</Label>
            <Slider
              aria-label={`${variant} slider`}
              defaultValue={[60]}
              variant={variant}
            />
          </div>
        )
      )}
    </div>
  );
}
