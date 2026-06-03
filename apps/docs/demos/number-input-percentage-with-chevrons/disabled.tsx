import { Label } from "@strait/ui/components/label";
import { NumberInputPercentageWithChevrons } from "@strait/ui/components/number-input-percentage-with-chevrons";

export default function NumberInputPercentageWithChevronsDisabled() {
  return (
    <div className="flex w-48 flex-col gap-1.5">
      <Label>Tax rate (read-only)</Label>
      <NumberInputPercentageWithChevrons
        defaultValue={20}
        disabled
        label="Tax rate"
        name="tax-rate"
      />
    </div>
  );
}
