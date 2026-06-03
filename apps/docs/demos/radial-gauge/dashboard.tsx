import { RadialGauge } from "@strait/ui/components/radial-gauge";

const metrics = [
  { label: "CPU", value: 62 },
  { label: "Memory", value: 81 },
  { label: "Disk", value: 94 },
  { label: "Network", value: 38 },
];

export default function RadialGaugeDashboardDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {metrics.map(({ label, value }) => (
        <div className="flex flex-col items-center gap-1" key={label}>
          <div className="size-28">
            <RadialGauge label={label} value={value} />
          </div>
        </div>
      ))}
    </div>
  );
}
