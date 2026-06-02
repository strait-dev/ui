"use client";

import {
  DateSelector,
  type DateSelectorValue,
} from "@strait/ui/components/date-selector";
import { useState } from "react";

export default function DateSelectorLimitedPeriods() {
  const [value, setValue] = useState<DateSelectorValue>();

  return (
    <DateSelector
      defaultPeriodType="month"
      onChange={setValue}
      periodTypes={["month", "quarter", "year"]}
      value={value}
    />
  );
}
