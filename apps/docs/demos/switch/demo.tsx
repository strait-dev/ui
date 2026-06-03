import { Label } from "@strait/ui/components/label";
import { Switch } from "@strait/ui/components/switch";

export default function SwitchDemo() {
  return (
    <div className="flex items-center gap-2">
      <Switch defaultChecked id="notifications" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  );
}
