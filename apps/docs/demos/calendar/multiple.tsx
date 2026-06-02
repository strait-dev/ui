"use client";

import { Calendar } from "@strait/ui/components/calendar";
import { useState } from "react";

export default function CalendarMultiple() {
  const [dates, setDates] = useState<Date[] | undefined>([
    new Date(2025, 4, 5),
    new Date(2025, 4, 12),
    new Date(2025, 4, 19),
  ]);

  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar
        defaultMonth={new Date(2025, 4, 1)}
        mode="multiple"
        onSelect={setDates}
        selected={dates}
      />
      <p className="text-muted-foreground text-sm">
        {dates?.length ?? 0} date(s) selected
      </p>
    </div>
  );
}
