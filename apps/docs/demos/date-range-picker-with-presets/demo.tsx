"use client";

import { DateRangePickerWithPresets } from "@strait/ui/components/date-range-picker-with-presets";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

export default function DateRangePickerWithPresetsDemo() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2025, 4, 1),
    to: new Date(2025, 4, 31),
  });

  return (
    <div className="w-80">
      <DateRangePickerWithPresets
        label="Reporting period"
        onChange={setRange}
        value={range}
      />
      <p className="mt-2 text-muted-foreground text-sm">
        {range?.from ? range.from.toDateString() : "—"} →{" "}
        {range?.to ? range.to.toDateString() : "—"}
      </p>
    </div>
  );
}
