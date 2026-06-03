import { Label } from "@strait/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@strait/ui/components/radio-group";

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="email">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="rg-email" value="email" />
        <Label htmlFor="rg-email">Email</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="rg-sms" value="sms" />
        <Label htmlFor="rg-sms">SMS</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="rg-push" value="push" />
        <Label htmlFor="rg-push">Push notification</Label>
      </div>
    </RadioGroup>
  );
}
