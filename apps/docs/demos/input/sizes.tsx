import { Input } from "@strait/ui/components/input";
import { Label } from "@strait/ui/components/label";

export default function InputSizes() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="input-sm">Small</Label>
        <Input id="input-sm" placeholder="size=&quot;sm&quot;" size="sm" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="input-default">Default</Label>
        <Input
          id="input-default"
          placeholder="size=&quot;default&quot;"
          size="default"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="input-lg">Large</Label>
        <Input id="input-lg" placeholder="size=&quot;lg&quot;" size="lg" />
      </div>
    </div>
  );
}
