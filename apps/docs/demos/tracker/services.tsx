import { Tracker, type TrackerBlockProps } from "@strait/ui/components/tracker";

const services: { name: string; data: TrackerBlockProps[] }[] = [
  {
    name: "API",
    data: Array.from({ length: 30 }, (_, i) => ({
      color: i === 12 ? "bg-destructive" : "bg-success",
      tooltip: i === 12 ? "Day 13: Outage" : `Day ${i + 1}: Operational`,
    })),
  },
  {
    name: "Dashboard",
    data: Array.from({ length: 30 }, (_, i) => ({
      color: i === 6 ? "bg-warning" : "bg-success",
      tooltip: i === 6 ? "Day 7: Degraded" : `Day ${i + 1}: Operational`,
    })),
  },
  {
    name: "Webhooks",
    data: Array.from({ length: 30 }, () => ({
      color: "bg-success",
      tooltip: "Operational",
    })),
  },
];

export default function TrackerServicesDemo() {
  return (
    <div className="max-w-2xl space-y-3">
      {services.map(({ name, data }) => (
        <div className="space-y-1" key={name}>
          <span className="font-medium text-sm">{name}</span>
          <Tracker data={data} />
        </div>
      ))}
    </div>
  );
}
