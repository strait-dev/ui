import { Label } from "@strait/ui/components/label";
import { Switch } from "@strait/ui/components/switch";

export default function SwitchStates() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch id="sw-off" />
        <Label htmlFor="sw-off">Off (unchecked)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch defaultChecked id="sw-on" />
        <Label htmlFor="sw-on">On (checked)</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch disabled id="sw-disabled-off" />
        <Label htmlFor="sw-disabled-off">Disabled off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch defaultChecked disabled id="sw-disabled-on" />
        <Label htmlFor="sw-disabled-on">Disabled on</Label>
      </div>
    </div>
  );
}
