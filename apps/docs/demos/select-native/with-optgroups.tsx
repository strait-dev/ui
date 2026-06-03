import { Label } from "@strait/ui/components/label";
import { SelectNative } from "@strait/ui/components/select-native";

export default function SelectNativeWithOptGroups() {
  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="sn-groups">Vehicle type</Label>
      <SelectNative id="sn-groups">
        <option disabled value="">
          Select…
        </option>
        <optgroup label="Land">
          <option value="car">Car</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="truck">Truck</option>
        </optgroup>
        <optgroup label="Sea">
          <option value="boat">Boat</option>
          <option value="yacht">Yacht</option>
        </optgroup>
        <optgroup label="Air">
          <option value="plane">Airplane</option>
          <option value="helicopter">Helicopter</option>
        </optgroup>
      </SelectNative>
    </div>
  );
}
