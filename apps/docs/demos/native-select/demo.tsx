import { Label } from "@strait/ui/components/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@strait/ui/components/native-select";

export default function NativeSelectDemo() {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="country">Country</Label>
      <NativeSelect id="country">
        <NativeSelectOption value="">Select a country…</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
        <NativeSelectOption value="gb">United Kingdom</NativeSelectOption>
        <NativeSelectOption value="ca">Canada</NativeSelectOption>
        <NativeSelectOption value="au">Australia</NativeSelectOption>
      </NativeSelect>
    </div>
  );
}
