"use client";

import { DateInput } from "@strait/ui/components/date-input";
import { useState } from "react";

export default function DateInputDemo() {
  const [date, setDate] = useState<Date>(new Date(2025, 4, 15));

  return (
    <div className="flex flex-col items-center gap-3">
      <DateInput onChange={setDate} value={date} />
      <p className="text-muted-foreground text-sm">{date.toDateString()}</p>
    </div>
  );
}
