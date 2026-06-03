import { MetricCard } from "@strait/ui/components/metric-card";

export default function DashboardBlock() {
  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
      <MetricCard
        data={[4200, 3800, 5100, 4700, 6300, 5900, 6800]}
        delta={{ value: 12, label: "vs last month" }}
        title="Revenue"
        value="$48,295"
      />
      <MetricCard
        data={[900, 1100, 980, 1200, 870, 1050, 920]}
        delta={{ value: 4, label: "vs last week" }}
        title="Active users"
        value="2,847"
      />
      <MetricCard
        data={[12, 9, 11, 8, 7, 6, 5]}
        delta={{ value: -2, label: "vs last month" }}
        title="Churn rate"
        value="2.4%"
      />
    </div>
  );
}
