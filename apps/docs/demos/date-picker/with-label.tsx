"use client";

import { DatePicker } from "@strait/ui/components/date-picker";
import { useState } from "react";

export default function DatePickerWithLabel() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div className="w-64">
      <DatePicker label="Due date" onChange={setDate} required value={date} />
      <p className="mt-2 text-muted-foreground text-sm">
        {date ? date.toDateString() : "No date selected"}
      </p>
    </div>
  );
}
