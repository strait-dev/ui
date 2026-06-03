import { Label } from "@strait/ui/components/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@strait/ui/components/native-select";

export default function NativeSelectSizes() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Small</Label>
        <NativeSelect size="sm">
          <NativeSelectOption value="a">Option A</NativeSelectOption>
          <NativeSelectOption value="b">Option B</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Default</Label>
        <NativeSelect size="default">
          <NativeSelectOption value="a">Option A</NativeSelectOption>
          <NativeSelectOption value="b">Option B</NativeSelectOption>
        </NativeSelect>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Large</Label>
        <NativeSelect size="lg">
          <NativeSelectOption value="a">Option A</NativeSelectOption>
          <NativeSelectOption value="b">Option B</NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  );
}
