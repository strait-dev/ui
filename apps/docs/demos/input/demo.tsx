import { Input } from "@strait/ui/components/input";
import { Label } from "@strait/ui/components/label";

export default function InputDemo() {
  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="email">Email address</Label>
      <Input id="email" placeholder="you@example.com" type="email" />
    </div>
  );
}
