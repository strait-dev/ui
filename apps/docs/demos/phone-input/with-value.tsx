"use client";

import { Label } from "@strait/ui/components/label";
import { PhoneInput } from "@strait/ui/components/phone-input";
import { useState } from "react";
import type { Value } from "react-phone-number-input";

export default function PhoneInputWithValue() {
  const [value, setValue] = useState<Value>("+14155552671" as Value);

  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="phone-prefilled">Phone number</Label>
      <PhoneInput
        id="phone-prefilled"
        onChange={setValue}
        placeholder="Phone number"
        value={value}
      />
    </div>
  );
}
