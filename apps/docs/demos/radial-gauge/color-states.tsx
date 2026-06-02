import { RadialGauge } from "@strait/ui/components/radial-gauge";

const gauges = [
  { value: 45, label: "Normal", note: "45% — normal" },
  { value: 78, label: "Warning", note: "78% — warning" },
  { value: 95, label: "Danger", note: "95% — danger" },
];

export default function RadialGaugeColorStatesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      {gauges.map(({ value, label, note }) => (
        <div className="flex flex-col items-center gap-2" key={label}>
          <div className="size-36">
            <RadialGauge label={label} value={value} />
          </div>
          <span className="text-muted-foreground text-xs">{note}</span>
        </div>
      ))}
    </div>
  );
}
