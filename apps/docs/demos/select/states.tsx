import { Label } from "@strait/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@strait/ui/components/select";

export default function SelectStates() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Default (no selection)</Label>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Choose an option…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one">Option One</SelectItem>
            <SelectItem value="two">Option Two</SelectItem>
            <SelectItem value="three">Option Three</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>With default value</Label>
        <Select defaultValue="two">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one">Option One</SelectItem>
            <SelectItem value="two">Option Two</SelectItem>
            <SelectItem value="three">Option Three</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Disabled</Label>
        <Select disabled>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Unavailable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="x">X</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
