import { Label } from "@strait/ui/components/label";
import { Textarea } from "@strait/ui/components/textarea";

export default function TextareaDemo() {
  return (
    <div className="flex w-80 flex-col gap-1.5">
      <Label htmlFor="bio">Bio</Label>
      <Textarea
        id="bio"
        placeholder="Tell us a little about yourself…"
        rows={4}
      />
    </div>
  );
}
