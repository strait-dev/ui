"use client";

import { Label } from "@strait/ui/components/label";
import { NumberInputWithButtons } from "@strait/ui/components/number-input-with-buttons";
import { useState } from "react";

export default function NumberInputWithButtonsDemo() {
  const [val, setVal] = useState(1);

  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="nb-demo">Quantity</Label>
      <NumberInputWithButtons
        max={99}
        min={1}
        name="quantity"
        onChange={setVal}
        value={val}
      />
      <p className="text-muted-foreground text-xs">Value: {val}</p>
    </div>
  );
}
