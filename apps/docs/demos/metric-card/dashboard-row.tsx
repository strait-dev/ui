import {
  Activity01Icon,
  ChartIncreaseIcon,
  MoneyBag01Icon,
  UserCircle02Icon,
} from "@hugeicons/core-free-icons";
import { MetricCard } from "@strait/ui/components/metric-card";

export default function MetricCardDashboardRowDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <MetricCard
        color="var(--chart-1)"
        data={[320, 450, 410, 530, 490, 600]}
        delta={{ value: 12, label: "vs last month" }}
        icon={MoneyBag01Icon}
        title="Revenue"
        value="$48,295"
      />
      <MetricCard
        color="var(--chart-2)"
        data={[800, 920, 860, 1020, 1100, 1284]}
        delta={{ value: 5.2, label: "vs last week" }}
        icon={UserCircle02Icon}
        title="Active Users"
        value="1,284"
      />
      <MetricCard
        color="var(--chart-3)"
        data={[42, 38, 51, 47, 63, 59]}
        delta={{ value: -2.1, label: "vs yesterday" }}
        icon={Activity01Icon}
        title="Error Rate"
        value="0.42%"
      />
      <MetricCard
        color="var(--chart-4)"
        data={[3.8, 4.1, 3.9, 4.4, 4.2, 4.6]}
        delta={{ value: 0.4, label: "vs last month" }}
        icon={ChartIncreaseIcon}
        title="Conversion"
        value="4.6%"
      />
    </div>
  );
}
