import { Label } from "@strait/ui/components/label";
import { Textarea } from "@strait/ui/components/textarea";

export default function TextareaStates() {
  return (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ta-default">Default</Label>
        <Textarea id="ta-default" placeholder="Enter your message" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ta-disabled">Disabled</Label>
        <Textarea
          defaultValue="This text cannot be edited."
          disabled
          id="ta-disabled"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ta-invalid">Invalid</Label>
        <Textarea
          aria-invalid
          id="ta-invalid"
          placeholder="Enter your message"
        />
        <p className="text-destructive text-sm">Message cannot be empty.</p>
      </div>
    </div>
  );
}
