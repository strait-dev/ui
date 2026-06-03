"use client";

import { DateRangePicker } from "@strait/ui/components/date-range-picker";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

export default function DateRangePickerEmpty() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  return (
    <div className="w-80">
      <DateRangePicker
        label="Select period"
        onChange={setRange}
        value={range}
      />
      <p className="mt-2 text-muted-foreground text-sm">
        {range?.from ? range.from.toDateString() : "—"} &rarr;{" "}
        {range?.to ? range.to.toDateString() : "—"}
      </p>
    </div>
  );
}
