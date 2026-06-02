"use client";

import { CalendarDate } from "@internationalized/date";
import { RangeCalendar } from "@strait/ui/components/calendar-rac";
import { useState } from "react";
import type { DateValue } from "react-aria-components";

type DateRange = { start: DateValue; end: DateValue };

export default function CalendarRacRangeSelect() {
  const [range, setRange] = useState<DateRange | null>({
    start: new CalendarDate(2025, 6, 5),
    end: new CalendarDate(2025, 6, 20),
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <RangeCalendar
        aria-label="Select date range"
        onChange={(value) => setRange(value)}
        value={range}
      />
      <p className="text-muted-foreground text-sm">
        {range
          ? `${range.start.toString()} to ${range.end.toString()}`
          : "No range selected"}
      </p>
    </div>
  );
}
