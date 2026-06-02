import { Label } from "@strait/ui/components/label";
import { Textarea } from "@strait/ui/components/textarea";

export default function TextareaSizes() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Small</Label>
        <Textarea placeholder="Compact textarea…" size="sm" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Default</Label>
        <Textarea placeholder="Standard textarea…" size="default" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Large</Label>
        <Textarea placeholder="Tall textarea…" size="lg" />
      </div>
    </div>
  );
}
