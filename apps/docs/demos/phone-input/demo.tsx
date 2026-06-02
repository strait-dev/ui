"use client";

import { Label } from "@strait/ui/components/label";
import { PhoneInput } from "@strait/ui/components/phone-input";
import { useState } from "react";
import type { Value } from "react-phone-number-input";

export default function PhoneInputDemo() {
  const [value, setValue] = useState<Value>("" as Value);

  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="phone-demo">Phone number</Label>
      <PhoneInput
        defaultCountry="US"
        id="phone-demo"
        onChange={(v) => setValue(v)}
        placeholder="Phone number"
        value={value}
      />
      {value ? (
        <p className="text-muted-foreground text-xs">E.164: {value}</p>
      ) : null}
    </div>
  );
}
