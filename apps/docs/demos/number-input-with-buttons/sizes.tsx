import { Label } from "@strait/ui/components/label";
import { NumberInputWithButtons } from "@strait/ui/components/number-input-with-buttons";

export default function NumberInputWithButtonsSizes() {
  return (
    <div className="flex w-48 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Small</Label>
        <NumberInputWithButtons
          defaultValue={1}
          label="Small"
          min={0}
          name="buttons-sm"
          size="sm"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Default</Label>
        <NumberInputWithButtons
          defaultValue={5}
          label="Default"
          min={0}
          name="buttons-default"
          size="default"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Large</Label>
        <NumberInputWithButtons
          defaultValue={10}
          label="Large"
          min={0}
          name="buttons-lg"
          size="lg"
        />
      </div>
    </div>
  );
}
