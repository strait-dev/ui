"use client";

import type { ChartConfig } from "@strait/ui/components/chart";
import { AreaChart } from "@strait/ui/components/charts";

const data = [
  { month: "Jan", revenue: 4200, expenses: 2400 },
  { month: "Feb", revenue: 3800, expenses: 1980 },
  { month: "Mar", revenue: 5100, expenses: 2800 },
  { month: "Apr", revenue: 4700, expenses: 2200 },
  { month: "May", revenue: 6300, expenses: 3100 },
  { month: "Jun", revenue: 5900, expenses: 2900 },
];

const config = {
  revenue: { label: "Revenue", color: "chart-1" },
  expenses: { label: "Expenses", color: "chart-2" },
} satisfies ChartConfig;

export default function ChartsArea() {
  return (
    <div className="w-full max-w-2xl">
      <AreaChart
        config={config}
        data={data}
        dataKey="month"
        valueFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
      />
    </div>
  );
}
