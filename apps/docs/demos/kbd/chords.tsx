import { Kbd, KbdGroup } from "@strait/ui/components/kbd";

export default function KbdChords() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⌃</Kbd>
        <Kbd>`</Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>⌥</Kbd>
        <Kbd>I</Kbd>
      </KbdGroup>
    </div>
  );
}
