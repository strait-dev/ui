import { Label } from "@strait/ui/components/label";
import { Textarea } from "@strait/ui/components/textarea";

export default function TextareaWithLabel() {
  return (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="bio-field">Bio</Label>
      <Textarea
        id="bio-field"
        placeholder="Tell us a little about yourself…"
        rows={4}
      />
      <p className="text-muted-foreground text-sm">Max 500 characters.</p>
    </div>
  );
}
