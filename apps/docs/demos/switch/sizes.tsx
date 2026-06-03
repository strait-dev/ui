import { Label } from "@strait/ui/components/label";
import { Switch } from "@strait/ui/components/switch";

export default function SwitchSizes() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch defaultChecked id="sw-sm" size="sm" />
        <Label htmlFor="sw-sm">Small (24 × 14 px)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch defaultChecked id="sw-default" size="default" />
        <Label htmlFor="sw-default">Default (32 × 18 px)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch defaultChecked id="sw-lg" size="lg" />
        <Label htmlFor="sw-lg">Large (44 × 24 px)</Label>
      </div>
    </div>
  );
}
