import { MetricCard } from "@strait/ui/components/metric-card";

export default function MetricCardDeltaDirectionsDemo() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard
        delta={{ value: 8, label: "vs last week", direction: "up" }}
        title="Sessions"
        value="1,024"
      />
      <MetricCard
        delta={{ value: -4, label: "vs last week", direction: "down" }}
        title="Bounce Rate"
        value="38.5%"
      />
      <MetricCard
        delta={{ value: 0, label: "no change", direction: "neutral" }}
        title="Avg Duration"
        value="2m 14s"
      />
    </div>
  );
}
