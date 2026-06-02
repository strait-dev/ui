"use client";

import {
  DateSelector,
  type DateSelectorValue,
} from "@strait/ui/components/date-selector";
import { useState } from "react";

export default function DateSelectorDemo() {
  const [value, setValue] = useState<DateSelectorValue | undefined>();

  return <DateSelector onChange={setValue} value={value} />;
}
