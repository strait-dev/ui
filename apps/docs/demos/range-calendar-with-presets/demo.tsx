"use client";

import { RangeCalendarWithPresets } from "@strait/ui/components/range-calendar-with-presets";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

export default function RangeCalendarWithPresetsDemo() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2025, 4, 5),
    to: new Date(2025, 4, 15),
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <RangeCalendarWithPresets
        numberOfMonths={2}
        onReset={() => setRange(undefined)}
        onSelect={setRange}
        selected={range}
        showFooter
      />
      <p className="text-muted-foreground text-sm">
        {range?.from ? range.from.toDateString() : "—"} →{" "}
        {range?.to ? range.to.toDateString() : "—"}
      </p>
    </div>
  );
}
