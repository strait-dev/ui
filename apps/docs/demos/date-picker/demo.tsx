"use client";

import { DatePicker } from "@strait/ui/components/date-picker";
import { useState } from "react";

export default function DatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 4, 15));

  return (
    <div className="w-64">
      <DatePicker label="Due date" onChange={setDate} value={date} />
      <p className="mt-2 text-muted-foreground text-sm">
        {date ? date.toDateString() : "No date selected"}
      </p>
    </div>
  );
}
