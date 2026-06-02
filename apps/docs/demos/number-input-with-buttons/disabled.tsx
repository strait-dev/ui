import { Label } from "@strait/ui/components/label";
import { NumberInputWithButtons } from "@strait/ui/components/number-input-with-buttons";

export default function NumberInputWithButtonsDisabled() {
  return (
    <div className="flex w-48 flex-col gap-1.5">
      <Label>Stock (read-only)</Label>
      <NumberInputWithButtons
        defaultValue={42}
        disabled
        label="Stock"
        min={0}
        name="stock"
      />
    </div>
  );
}
