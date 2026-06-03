import { Button } from "@strait/ui/components/button";
import { Kbd } from "@strait/ui/components/kbd";

export default function KbdInButton() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline">
        Search
        <Kbd>⌘K</Kbd>
      </Button>
      <Button variant="default">
        Save
        <Kbd>⌘S</Kbd>
      </Button>
      <Button variant="ghost">
        Open terminal
        <Kbd>⌃`</Kbd>
      </Button>
    </div>
  );
}
