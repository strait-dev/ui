"use client";

import { IdCell } from "@strait/ui/components/id-cell";
import { TooltipProvider } from "@strait/ui/components/tooltip";

const SAMPLE_ID = "usr_01HZ8B3X9KFQW7MPNVE2TDCYS";

export default function IdCellLengthDemo() {
  const lengths: number[] = [4, 6, 10];

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-6">
        {lengths.map((len) => (
          <div className="flex flex-col items-start gap-1" key={len}>
            <span className="text-muted-foreground text-xs">length={len}</span>
            <IdCell id={SAMPLE_ID} length={len} />
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
