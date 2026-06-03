"use client";

import { CalendarDate } from "@internationalized/date";
import { Calendar } from "@strait/ui/components/calendar-rac";

const FIXED = new CalendarDate(2025, 6, 15);

export default function CalendarRacDisabled() {
  return <Calendar aria-label="Disabled calendar" isDisabled value={FIXED} />;
}
