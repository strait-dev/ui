import { Input } from "@strait/ui/components/input";
import { Label } from "@strait/ui/components/label";

export default function LabelRequired() {
  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="name-input" required>
        Full name
      </Label>
      <Input id="name-input" placeholder="Jane Doe" required type="text" />
    </div>
  );
}
