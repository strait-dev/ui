"use client";

import { DateRangePicker } from "@strait/ui/components/date-range-picker";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

export default function DateRangePickerDemo() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2025, 4, 5),
    to: new Date(2025, 4, 20),
  });

  return (
    <div className="w-80">
      <DateRangePicker label="Date range" onChange={setRange} value={range} />
      <p className="mt-2 text-muted-foreground text-sm">
        {range?.from ? range.from.toDateString() : "—"} →{" "}
        {range?.to ? range.to.toDateString() : "—"}
      </p>
    </div>
  );
}
