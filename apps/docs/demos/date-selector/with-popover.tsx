"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@strait/ui/components/button";
import {
  DateSelector,
  type DateSelectorValue,
  formatDateValue,
} from "@strait/ui/components/date-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@strait/ui/components/popover";
import { useState } from "react";

export default function DateSelectorWithPopover() {
  const [value, setValue] = useState<DateSelectorValue>();
  const label = value ? formatDateValue(value) : "Pick a date";

  return (
    <Popover>
      <PopoverTrigger
        render={<Button className="w-56 justify-start" variant="outline" />}
      >
        <HugeiconsIcon
          className="size-4"
          icon={Calendar03Icon}
          strokeWidth={2}
        />
        {label}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <DateSelector onChange={setValue} value={value} />
      </PopoverContent>
    </Popover>
  );
}
