import { Label } from "@strait/ui/components/label";
import { NumberInputWithChevrons } from "@strait/ui/components/number-input-with-chevrons";

export default function NumberInputWithChevronsDisabled() {
  return (
    <div className="flex w-48 flex-col gap-1.5">
      <Label>Rating (read-only)</Label>
      <NumberInputWithChevrons
        defaultValue={4}
        disabled
        label="Rating"
        max={5}
        min={1}
        name="rating"
      />
    </div>
  );
}
