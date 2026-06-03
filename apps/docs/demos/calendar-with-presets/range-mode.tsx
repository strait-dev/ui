"use client";

import { CalendarWithPresets } from "@strait/ui/components/calendar-with-presets";
import { subDays } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

const FIXED_DATE = new Date(2025, 4, 15);

export default function CalendarWithPresetsRangeMode() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(FIXED_DATE, 6),
    to: FIXED_DATE,
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <CalendarWithPresets
        mode="range"
        onSelect={(r: DateRange | undefined) => setRange(r)}
        selected={range}
      />
      <p className="text-muted-foreground text-sm">
        {range?.from ? range.from.toDateString() : "—"} &rarr;{" "}
        {range?.to ? range.to.toDateString() : "—"}
      </p>
    </div>
  );
}
