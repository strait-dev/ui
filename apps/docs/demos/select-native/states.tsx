import { Label } from "@strait/ui/components/label";
import { SelectNative } from "@strait/ui/components/select-native";

export default function SelectNativeStates() {
  return (
    <div className="flex w-56 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Default</Label>
        <SelectNative>
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </SelectNative>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Disabled</Label>
        <SelectNative disabled>
          <option value="a">Option A</option>
        </SelectNative>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Invalid</Label>
        <SelectNative aria-invalid>
          <option disabled value="">
            Select one…
          </option>
          <option value="a">Option A</option>
        </SelectNative>
        <p className="text-destructive text-sm">Please make a selection.</p>
      </div>
    </div>
  );
}
