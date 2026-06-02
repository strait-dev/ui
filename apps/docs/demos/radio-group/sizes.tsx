import { Label } from "@strait/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@strait/ui/components/radio-group";

export default function RadioGroupSizes() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size}>
          <p className="mb-2 font-medium text-muted-foreground text-xs capitalize">
            {size}
          </p>
          <RadioGroup defaultValue="email" size={size}>
            <div className="flex items-center gap-2">
              <RadioGroupItem id={`sz-${size}-email`} value="email" />
              <Label htmlFor={`sz-${size}-email`}>Email</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id={`sz-${size}-sms`} value="sms" />
              <Label htmlFor={`sz-${size}-sms`}>SMS</Label>
            </div>
          </RadioGroup>
        </div>
      ))}
    </div>
  );
}
