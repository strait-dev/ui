import { Kbd, KbdGroup } from "@strait/ui/components/kbd";

export default function KbdSizes() {
  return (
    <div className="flex flex-col gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div className="flex items-center gap-3" key={size}>
          <span className="w-16 text-muted-foreground text-xs">{size}</span>
          <KbdGroup>
            <Kbd size={size}>⌘</Kbd>
            <Kbd size={size}>K</Kbd>
          </KbdGroup>
        </div>
      ))}
    </div>
  );
}
