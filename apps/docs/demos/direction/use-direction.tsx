"use client";

import {
  DirectionProvider,
  useDirection,
} from "@strait/ui/components/direction";

function FlowIndicator() {
  const dir = useDirection();
  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex items-center gap-2 rounded-md border bg-muted/40 px-4 py-2 text-sm"
        dir={dir}
      >
        <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-primary text-xs">
          {dir === "rtl" ? "←" : "→"}
        </span>
        <span>
          Text flows {dir === "rtl" ? "right-to-left" : "left-to-right"}
        </span>
      </div>
    </div>
  );
}

export default function DirectionUseDirection() {
  return (
    <div className="w-80 space-y-4">
      <DirectionProvider direction="ltr">
        <FlowIndicator />
      </DirectionProvider>
      <DirectionProvider direction="rtl">
        <FlowIndicator />
      </DirectionProvider>
    </div>
  );
}
