"use client";

import { DateInput } from "@strait/ui/components/date-input";
import { useState } from "react";

export default function DateInputWithPreset() {
  const [date, setDate] = useState<Date>(new Date(2024, 0, 1));

  return (
    <div className="flex flex-col items-center gap-3">
      <DateInput onChange={setDate} value={date} />
      <p className="text-muted-foreground text-sm">
        Selected: {date.toDateString()}
      </p>
    </div>
  );
}
