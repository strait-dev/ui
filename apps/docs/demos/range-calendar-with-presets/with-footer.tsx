"use client";

import { RangeCalendarWithPresets } from "@strait/ui/components/range-calendar-with-presets";
import { subDays } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

export default function RangeCalendarWithPresetsWithFooter() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  return (
    <RangeCalendarWithPresets
      numberOfMonths={2}
      onApply={() => undefined}
      onReset={() => setRange(undefined)}
      onSelect={setRange}
      selected={range}
      showFooter
    />
  );
}
