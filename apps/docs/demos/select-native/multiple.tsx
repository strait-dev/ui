import { Label } from "@strait/ui/components/label";
import { SelectNative } from "@strait/ui/components/select-native";

export default function SelectNativeMultiple() {
  return (
    <div className="flex w-56 flex-col gap-1.5">
      <Label htmlFor="sn-multi">Skills (hold Ctrl/Cmd for multiple)</Label>
      <SelectNative id="sn-multi" multiple>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="js">JavaScript</option>
        <option value="ts">TypeScript</option>
        <option value="react">React</option>
      </SelectNative>
    </div>
  );
}
