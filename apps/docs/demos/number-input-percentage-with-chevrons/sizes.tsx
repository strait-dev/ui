import { Label } from "@strait/ui/components/label";
import { NumberInputPercentageWithChevrons } from "@strait/ui/components/number-input-percentage-with-chevrons";

export default function NumberInputPercentageWithChevronsSizes() {
  return (
    <div className="flex w-48 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Small</Label>
        <NumberInputPercentageWithChevrons
          defaultValue={10}
          label="Small percentage"
          name="percent-sm"
          size="sm"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Default</Label>
        <NumberInputPercentageWithChevrons
          defaultValue={50}
          label="Default percentage"
          name="percent-default"
          size="default"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Large</Label>
        <NumberInputPercentageWithChevrons
          defaultValue={75}
          label="Large percentage"
          name="percent-lg"
          size="lg"
        />
      </div>
    </div>
  );
}
