"use client";

import { CalendarWithPresets } from "@strait/ui/components/calendar-with-presets";
import { useState } from "react";

export default function CalendarWithPresetsDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 4, 15));

  return (
    <div className="flex flex-col items-center gap-3">
      <CalendarWithPresets
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
