import { MetricCard } from "@strait/ui/components/metric-card";

export default function MetricCardWithSparklineDemo() {
  return (
    <div className="w-72">
      <MetricCard
        color="var(--chart-3)"
        data={[420, 380, 510, 470, 630, 590, 720, 849]}
        delta={{ value: 5.1, label: "vs last week" }}
        description="Across all marketing channels."
        title="Page Views"
        value="84,921"
      />
    </div>
  );
}
