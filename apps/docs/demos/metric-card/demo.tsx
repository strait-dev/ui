import { ChartIncreaseIcon } from "@hugeicons/core-free-icons";
import { MetricCard } from "@strait/ui/components/metric-card";

export default function MetricCardDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-4">
      <MetricCard
        data={[4200, 3800, 5100, 4700, 6300, 5900, 6800]}
        delta={{ value: 12, label: "vs last month" }}
        icon={ChartIncreaseIcon}
        title="Total Revenue"
        value="$48,295"
      />
      <MetricCard
        data={[900, 1100, 980, 1200, 870, 1050, 920]}
        delta={{ value: -3, label: "vs last week" }}
        title="Active Users"
        value="2,847"
      />
    </div>
  );
}
