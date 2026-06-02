import { Tracker } from "@strait/ui/components/tracker";

const data = [
  { color: "bg-success", tooltip: "Day 1: Operational" },
  { color: "bg-success", tooltip: "Day 2: Operational" },
  { color: "bg-warning", tooltip: "Day 3: Degraded performance" },
  { color: "bg-success", tooltip: "Day 4: Operational" },
  { color: "bg-destructive", tooltip: "Day 5: Major outage" },
  { color: "bg-success", tooltip: "Day 6: Operational" },
  { color: "bg-success", tooltip: "Day 7: Operational" },
];

export default function TrackerFewBlocksDemo() {
  return (
    <div className="max-w-md">
      <Tracker data={data} />
    </div>
  );
}
