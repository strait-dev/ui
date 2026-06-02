import { Input } from "@strait/ui/components/input";
import { Label } from "@strait/ui/components/label";

export default function InputStates() {
  return (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="input-default-state">Default</Label>
        <Input id="input-default-state" placeholder="Enter a value" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="input-disabled">Disabled</Label>
        <Input defaultValue="Cannot edit this" disabled id="input-disabled" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="input-invalid">Invalid</Label>
        <Input
          aria-invalid
          id="input-invalid"
          placeholder="you@example.com"
          type="email"
        />
        <p className="text-destructive text-sm">Please enter a valid email.</p>
      </div>
    </div>
  );
}
