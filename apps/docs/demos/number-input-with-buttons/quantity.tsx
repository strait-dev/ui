"use client";

import { Label } from "@strait/ui/components/label";
import { NumberInputWithButtons } from "@strait/ui/components/number-input-with-buttons";
import { useState } from "react";

export default function NumberInputWithButtonsQuantity() {
  const [qty, setQty] = useState(1);

  return (
    <div className="flex w-48 flex-col gap-1.5">
      <Label>Quantity</Label>
      <NumberInputWithButtons
        label="Quantity"
        max={99}
        min={1}
        name="quantity"
        onChange={setQty}
        value={qty}
      />
      <p className="text-muted-foreground text-sm">Selected: {qty}</p>
    </div>
  );
}
