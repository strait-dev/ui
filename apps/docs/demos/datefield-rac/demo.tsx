"use client";

import { CalendarDate } from "@internationalized/date";
import { DateField, DateInput } from "@strait/ui/components/datefield-rac";

const FIXED = new CalendarDate(2025, 6, 15);

export default function DatefieldRacDemo() {
  return (
    <DateField aria-label="Date" defaultValue={FIXED}>
      <DateInput />
    </DateField>
  );
}
