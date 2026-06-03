import { Input } from "@strait/ui/components/input";
import { Label } from "@strait/ui/components/label";

export default function LabelDemo() {
  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="full-name" required>
        Full name
      </Label>
      <Input id="full-name" placeholder="Jane Doe" type="text" />
    </div>
  );
}
