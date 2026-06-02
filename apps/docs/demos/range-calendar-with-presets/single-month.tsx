"use client";

import { RangeCalendarWithPresets } from "@strait/ui/components/range-calendar-with-presets";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

export default function RangeCalendarWithPresetsSingleMonth() {
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <RangeCalendarWithPresets
      numberOfMonths={1}
      onSelect={setRange}
      selected={range}
    />
  );
}
