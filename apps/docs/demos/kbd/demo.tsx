import { Kbd } from "@strait/ui/components/kbd";

export default function KbdDemo() {
  return (
    <div className="flex items-center gap-1">
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>P</Kbd>
    </div>
  );
}
