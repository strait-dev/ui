"use client";

import { Calendar } from "@strait/ui/components/calendar";
import { useState } from "react";

export default function CalendarWithDropdown() {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 4, 15));

  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar
        captionLayout="dropdown"
        defaultMonth={new Date(2025, 4, 1)}
        endMonth={new Date(2030, 11)}
        mode="single"
        onSelect={setDate}
        selected={date}
        startMonth={new Date(2020, 0)}
      />
      <p className="text-muted-foreground text-sm">
        {date ? date.toDateString() : "No date selected"}
      </p>
    </div>
  );
}
