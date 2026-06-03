"use client";

import { CalendarWithPresets } from "@strait/ui/components/calendar-with-presets";
import { useState } from "react";

const FIXED_DATE = new Date(2025, 4, 15);

export default function CalendarWithPresetsFutureDatesEnabled() {
  const [date, setDate] = useState<Date | undefined>(FIXED_DATE);

  return (
    <div className="flex flex-col items-center gap-3">
      <CalendarWithPresets
        disableFutureDates={false}
        mode="single"
        onSelect={(d: Date | undefined) => setDate(d)}
        selected={date}
      />
      <p className="text-muted-foreground text-sm">
        {date ? date.toDateString() : "No date selected"}
      </p>
    </div>
  );
}
