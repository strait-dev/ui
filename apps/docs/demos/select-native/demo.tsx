import { Label } from "@strait/ui/components/label";
import { SelectNative } from "@strait/ui/components/select-native";

export default function SelectNativeDemo() {
  return (
    <div className="flex w-56 flex-col gap-1.5">
      <Label htmlFor="fruit">Favorite fruit</Label>
      <SelectNative defaultValue="" id="fruit">
        <option disabled value="">
          Pick a fruit…
        </option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cherry">Cherry</option>
        <option value="mango">Mango</option>
      </SelectNative>
    </div>
  );
}
