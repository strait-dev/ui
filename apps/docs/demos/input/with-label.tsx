import { Input } from "@strait/ui/components/input";
import { Label } from "@strait/ui/components/label";

export default function InputWithLabel() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="full-name">Full name</Label>
      <Input id="full-name" placeholder="Jane Doe" type="text" />
      <p className="text-muted-foreground text-sm">
        This is how your name will appear on your profile.
      </p>
    </div>
  );
}
