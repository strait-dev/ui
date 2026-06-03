import { Label } from "@strait/ui/components/label";
import { Textarea } from "@strait/ui/components/textarea";

export default function TextareaResize() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>No resize</Label>
        <Textarea placeholder="Cannot be resized." resize="none" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Vertical (default)</Label>
        <Textarea
          placeholder="Drag the corner to resize vertically."
          resize="vertical"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Free resize</Label>
        <Textarea
          placeholder="Drag the corner freely in both directions."
          resize="auto"
        />
      </div>
    </div>
  );
}
