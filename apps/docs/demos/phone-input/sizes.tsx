"use client";

import { Label } from "@strait/ui/components/label";
import { PhoneInput } from "@strait/ui/components/phone-input";
import { useState } from "react";
import type { Value } from "react-phone-number-input";

export default function PhoneInputSizes() {
  const [sm, setSm] = useState<Value>("" as Value);
  const [md, setMd] = useState<Value>("" as Value);
  const [lg, setLg] = useState<Value>("" as Value);

  return (
    <div className="flex w-72 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone-size-sm">Small</Label>
        <PhoneInput
          defaultCountry="US"
          id="phone-size-sm"
          onChange={setSm}
          placeholder="Phone number"
          value={sm}
          variant="sm"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone-size-md">Default</Label>
        <PhoneInput
          defaultCountry="US"
          id="phone-size-md"
          onChange={setMd}
          placeholder="Phone number"
          value={md}
          variant="default"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone-size-lg">Large</Label>
        <PhoneInput
          defaultCountry="US"
          id="phone-size-lg"
          onChange={setLg}
          placeholder="Phone number"
          value={lg}
          variant="lg"
        />
      </div>
    </div>
  );
}
