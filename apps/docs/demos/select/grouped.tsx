import { Label } from "@strait/ui/components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@strait/ui/components/select";

export default function SelectGrouped() {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="timezone-select">Timezone</Label>
      <Select defaultValue="est">
        <SelectTrigger className="w-56" id="timezone-select">
          <SelectValue placeholder="Pick a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern (EST)</SelectItem>
            <SelectItem value="cst">Central (CST)</SelectItem>
            <SelectItem value="pst">Pacific (PST)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="gmt">London (GMT)</SelectItem>
            <SelectItem value="cet">Berlin (CET)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Asia</SelectLabel>
            <SelectItem value="jst">Tokyo (JST)</SelectItem>
            <SelectItem value="ist">Mumbai (IST)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
