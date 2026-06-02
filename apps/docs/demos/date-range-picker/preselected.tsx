"use client";

import { DateRangePicker } from "@strait/ui/components/date-range-picker";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

const FIXED_FROM = new Date(2025, 4, 5);
const FIXED_TO = new Date(2025, 4, 20);

export default function DateRangePickerPreselected() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: FIXED_FROM,
    to: FIXED_TO,
  });

  return (
    <div className="w-80">
      <DateRangePicker
        label="Billing period"
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
