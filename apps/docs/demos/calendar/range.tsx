"use client";

import { Calendar } from "@strait/ui/components/calendar";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

export default function CalendarRange() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2025, 4, 10),
    to: new Date(2025, 4, 20),
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar
        defaultMonth={new Date(2025, 4, 1)}
        mode="range"
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
