"use client";

import { CalendarDate } from "@internationalized/date";
import { DateField, DateInput } from "@strait/ui/components/datefield-rac";

const FIXED = new CalendarDate(2025, 6, 15);

export default function DatefieldRacDisabled() {
  return (
    <DateField aria-label="Disabled date" defaultValue={FIXED} isDisabled>
      <DateInput />
    </DateField>
  );
}
