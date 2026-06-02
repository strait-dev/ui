import { Tracker, type TrackerBlockProps } from "@strait/ui/components/tracker";

const uptime: TrackerBlockProps[] = [
  ...Array.from({ length: 25 }, (_, i) => ({
    color: "bg-success",
    tooltip: `Day ${i + 1}: Operational`,
  })),
  { color: "bg-warning", tooltip: "Day 26: Degraded performance" },
  ...Array.from({ length: 3 }, (_, i) => ({
    color: "bg-success",
    tooltip: `Day ${i + 27}: Operational`,
  })),
  { color: "bg-destructive", tooltip: "Day 30: Outage" },
];

export default function TrackerDemo() {
  return (
    <div className="w-full max-w-xl space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">API Gateway</span>
        <span className="text-muted-foreground">30 days</span>
      </div>
      <Tracker data={uptime} />
    </div>
  );
}
