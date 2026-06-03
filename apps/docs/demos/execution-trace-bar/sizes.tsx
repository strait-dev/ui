"use client";

import { ExecutionTraceBar } from "@strait/ui/components/execution-trace-bar";

const segments = [
  { label: "Queue", value: 18 },
  { label: "Execution", value: 412 },
  { label: "Serialization", value: 34 },
  { label: "Network", value: 56 },
];

export default function ExecutionTraceBarSizes() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div className="flex flex-col gap-1" key={size}>
          <span className="text-muted-foreground text-xs">
            size=&quot;{size}&quot;
          </span>
          <ExecutionTraceBar
            formatValue={(n) => `${n}ms`}
            segments={segments}
            showLegend={size === "lg"}
            size={size}
          />
        </div>
      ))}
    </div>
  );
}
