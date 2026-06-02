"use client";

import type { ChartConfig } from "@strait/ui/components/chart";
import { DonutChart } from "@strait/ui/components/charts";

const data = [
  { name: "Product A", value: 400 },
  { name: "Product B", value: 300 },
  { name: "Product C", value: 200 },
  { name: "Product D", value: 100 },
];

const config = {
  "Product A": { label: "Product A", color: "chart-1" },
  "Product B": { label: "Product B", color: "chart-2" },
  "Product C": { label: "Product C", color: "chart-3" },
  "Product D": { label: "Product D", color: "chart-4" },
} satisfies ChartConfig;

export default function ChartDonut() {
  return (
    <div className="w-full max-w-xl">
      <DonutChart config={config} data={data} dataKey="value" nameKey="name" />
    </div>
  );
}
