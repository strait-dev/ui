"use client";

import { DatePicker } from "@strait/ui/components/date-picker";
import { useState } from "react";

export default function DatePickerWithError() {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div className="flex w-64 flex-col gap-6">
      <DatePicker error label="Expiry date" onChange={setDate} value={date} />
      <DatePicker
        disabled
        label="Start date (disabled)"
        onChange={setDate}
        value={new Date(2025, 4, 15)}
      />
    </div>
  );
}
