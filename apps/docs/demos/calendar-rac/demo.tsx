"use client";

import { CalendarDate } from "@internationalized/date";
import { Calendar } from "@strait/ui/components/calendar-rac";
import { useState } from "react";
import type { DateValue } from "react-aria-components";

const FIXED = new CalendarDate(2025, 6, 15);

export default function CalendarRacDemo() {
  const [date, setDate] = useState<DateValue | null>(FIXED);

  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar
        aria-label="Select a date"
        onChange={(value) => setDate(value as DateValue)}
        value={date}
      />
      <p className="text-muted-foreground text-sm">
        {date ? date.toString() : "No date selected"}
      </p>
    </div>
  );
}
