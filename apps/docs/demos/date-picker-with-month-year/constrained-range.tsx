"use client";

import { DatePickerWithMonthYear } from "@strait/ui/components/date-picker-with-month-year";
import { useState } from "react";

const FIXED_DATE = new Date(2025, 4, 15);

export default function DatePickerWithMonthYearConstrainedRange() {
  const [date, setDate] = useState<Date | undefined>(FIXED_DATE);

  return (
    <div className="w-64">
      <DatePickerWithMonthYear
        maxValue={new Date(2027, 11)}
        minValue={new Date(2023, 0)}
        onChange={setDate}
        placeholder="Pick a date"
        value={date}
      />
      <p className="mt-2 text-muted-foreground text-sm">
        {date ? date.toDateString() : "No date selected"}
      </p>
    </div>
  );
}
