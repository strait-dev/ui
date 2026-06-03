"use client";

import { Calendar } from "@strait/ui/components/calendar";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

export default function CalendarDemo() {
  const [selected, setSelected] = useState<DateRange | undefined>();

  return <Calendar mode="range" onSelect={setSelected} selected={selected} />;
}
