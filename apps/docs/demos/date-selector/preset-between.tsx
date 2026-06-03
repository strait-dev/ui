"use client";

import {
  DateSelector,
  type DateSelectorValue,
} from "@strait/ui/components/date-selector";
import { useState } from "react";

export default function DateSelectorPresetBetween() {
  const [value, setValue] = useState<DateSelectorValue>();

  return (
    <DateSelector
      label="Created"
      onChange={setValue}
      presetMode="between"
      value={value}
    />
  );
}
