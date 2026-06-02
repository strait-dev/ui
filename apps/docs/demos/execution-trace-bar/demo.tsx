"use client";

import { ExecutionTraceBar } from "@strait/ui/components/execution-trace-bar";

export default function ExecutionTraceBarDemo() {
  return (
    <div className="w-full max-w-xl">
      <ExecutionTraceBar
        formatValue={(n) => `${n}ms`}
        segments={[
          { label: "Queue wait", value: 18 },
          { label: "Execution", value: 412 },
          { label: "Serialization", value: 34 },
          { label: "Network", value: 56 },
        ]}
      />
    </div>
  );
}
