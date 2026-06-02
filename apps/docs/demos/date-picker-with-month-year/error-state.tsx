"use client";

import { DatePickerWithMonthYear } from "@strait/ui/components/date-picker-with-month-year";
import { useState } from "react";

export default function DatePickerWithMonthYearErrorState() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="w-64">
      <DatePickerWithMonthYear
        error
        onChange={setDate}
        placeholder="Selecione uma data"
        value={date}
      />
      <p className="mt-1.5 text-destructive text-sm">Date is required.</p>
    </div>
  );
}
