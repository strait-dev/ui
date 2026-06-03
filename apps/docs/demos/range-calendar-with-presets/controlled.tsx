"use client";

import { RangeCalendarWithPresets } from "@strait/ui/components/range-calendar-with-presets";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

export default function RangeCalendarWithPresetsControlled() {
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <div className="flex flex-col items-center gap-3">
      <RangeCalendarWithPresets
        numberOfMonths={2}
        onSelect={setRange}
        selected={range}
      />
      <p className="text-muted-foreground text-sm">
        {range?.from ? range.from.toDateString() : "—"} &rarr;{" "}
        {range?.to ? range.to.toDateString() : "—"}
      </p>
    </div>
  );
}
