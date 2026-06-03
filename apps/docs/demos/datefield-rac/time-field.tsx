"use client";

import { Time } from "@internationalized/date";
import { DateInput, TimeField } from "@strait/ui/components/datefield-rac";

export default function DatefieldRacTimeField() {
  return (
    <TimeField aria-label="Meeting time" defaultValue={new Time(14, 30)}>
      <DateInput />
    </TimeField>
  );
}
