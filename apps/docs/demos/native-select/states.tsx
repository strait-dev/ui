import { Label } from "@strait/ui/components/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@strait/ui/components/native-select";

export default function NativeSelectStates() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Default</Label>
        <NativeSelect>
          <NativeSelectOption value="">Select a country…</NativeSelectOption>
          <NativeSelectOption value="us">United States</NativeSelectOption>
          <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Disabled</Label>
        <NativeSelect disabled>
          <NativeSelectOption value="us">United States</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Invalid</Label>
        <NativeSelect aria-invalid>
          <NativeSelectOption value="">Select a country…</NativeSelectOption>
          <NativeSelectOption value="us">United States</NativeSelectOption>
        </NativeSelect>
        <p className="text-destructive text-sm">Please select a country.</p>
      </div>
    </div>
  );
}
