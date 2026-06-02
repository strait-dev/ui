import { Tracker, type TrackerBlockProps } from "@strait/ui/components/tracker";

function dayStatus(index: number): { color: string; label: string } {
  if (index % 13 === 0) {
    return { color: "bg-destructive", label: "Outage" };
  }
  if (index % 7 === 0) {
    return { color: "bg-warning", label: "Degraded" };
  }
  return { color: "bg-success", label: "Operational" };
}

const data: TrackerBlockProps[] = Array.from({ length: 40 }, (_, i) => {
  const { color, label } = dayStatus(i);
  return { color, tooltip: `Day ${i + 1}: ${label}` };
});

export default function TrackerUptimeDemo() {
  return (
    <div className="max-w-2xl space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">API uptime — last 40 days</span>
        <span className="text-muted-foreground text-xs">
          Hover a block for details
        </span>
      </div>
      <Tracker data={data} />
    </div>
  );
}
