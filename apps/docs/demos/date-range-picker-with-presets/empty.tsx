"use client";

import { DateRangePickerWithPresets } from "@strait/ui/components/date-range-picker-with-presets";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

export default function DateRangePickerWithPresetsEmpty() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  return (
    <div className="w-80">
      <DateRangePickerWithPresets
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
