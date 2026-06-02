"use client";

import { DatePickerWithMonthYear } from "@strait/ui/components/date-picker-with-month-year";
import { useState } from "react";

export default function DatePickerWithMonthYearDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 4, 15));

  return (
    <div className="w-64">
      <DatePickerWithMonthYear
        maxValue={new Date(2030, 11, 31)}
        minValue={new Date(2020, 0, 1)}
        onChange={setDate}
        placeholder="Select a date"
        value={date}
      />
      <p className="mt-2 text-muted-foreground text-sm">
        {date ? date.toDateString() : "No date selected"}
      </p>
    </div>
  );
}
