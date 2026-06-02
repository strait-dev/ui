"use client";

import type { ChartConfig } from "@strait/ui/components/chart";
import { LineChart } from "@strait/ui/components/charts";

const data = [
  { month: "Jan", users: 820, sessions: 1400 },
  { month: "Feb", users: 932, sessions: 1600 },
  { month: "Mar", users: 901, sessions: 1550 },
  { month: "Apr", users: 1134, sessions: 1900 },
  { month: "May", users: 1290, sessions: 2100 },
  { month: "Jun", users: 1430, sessions: 2400 },
];

const config = {
  users: { label: "Users", color: "chart-1" },
  sessions: { label: "Sessions", color: "chart-2" },
} satisfies ChartConfig;

export default function ChartLine() {
  return (
    <div className="w-full max-w-xl">
      <LineChart
        config={config}
        data={data}
        dataKey="month"
        valueFormatter={(v) => v.toLocaleString()}
      />
    </div>
  );
}
