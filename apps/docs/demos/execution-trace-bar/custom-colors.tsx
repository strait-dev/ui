"use client";

import { ExecutionTraceBar } from "@strait/ui/components/execution-trace-bar";

export default function ExecutionTraceBarCustomColors() {
  return (
    <div className="max-w-xl">
      <ExecutionTraceBar
        formatValue={(n) => `${n}ms`}
        segments={[
          { label: "Cold start", value: 60, color: "#6366f1" },
          { label: "DB query", value: 200, color: "#f59e0b" },
          { label: "Render", value: 90, color: "#10b981" },
          { label: "Transfer", value: 50, color: "#ef4444" },
        ]}
      />
    </div>
  );
}
