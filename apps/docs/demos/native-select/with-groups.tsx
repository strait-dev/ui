import { Label } from "@strait/ui/components/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@strait/ui/components/native-select";

export default function NativeSelectWithGroups() {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="native-grouped">Timezone</Label>
      <NativeSelect id="native-grouped">
        <NativeSelectOption value="">Pick a timezone…</NativeSelectOption>
        <NativeSelectOptGroup label="Americas">
          <NativeSelectOption value="est">Eastern (EST)</NativeSelectOption>
          <NativeSelectOption value="pst">Pacific (PST)</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Europe">
          <NativeSelectOption value="gmt">London (GMT)</NativeSelectOption>
          <NativeSelectOption value="cet">Berlin (CET)</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Asia">
          <NativeSelectOption value="jst">Tokyo (JST)</NativeSelectOption>
          <NativeSelectOption value="ist">Mumbai (IST)</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </div>
  );
}
