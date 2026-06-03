import { Label } from "@strait/ui/components/label";
import { NumberInputWithChevrons } from "@strait/ui/components/number-input-with-chevrons";

export default function NumberInputWithChevronsSizes() {
  return (
    <div className="flex w-48 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Small</Label>
        <NumberInputWithChevrons
          defaultValue={1}
          label="Small"
          min={0}
          name="chevron-sm"
          size="sm"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Default</Label>
        <NumberInputWithChevrons
          defaultValue={5}
          label="Default"
          min={0}
          name="chevron-default"
          size="default"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Large</Label>
        <NumberInputWithChevrons
          defaultValue={10}
          label="Large"
          min={0}
          name="chevron-lg"
          size="lg"
        />
      </div>
    </div>
  );
}
