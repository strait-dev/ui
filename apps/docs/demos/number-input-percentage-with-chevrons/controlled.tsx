"use client";

import { Label } from "@strait/ui/components/label";
import { NumberInputPercentageWithChevrons } from "@strait/ui/components/number-input-percentage-with-chevrons";
import { useState } from "react";

export default function NumberInputPercentageWithChevronsControlled() {
  const [discount, setDiscount] = useState(25);

  return (
    <div className="flex w-48 flex-col gap-1.5">
      <Label htmlFor="percent-controlled">Discount</Label>
      <NumberInputPercentageWithChevrons
        label="Discount"
        name="discount"
        onChange={setDiscount}
        value={discount}
      />
      <p className="text-muted-foreground text-sm">Value: {discount}%</p>
    </div>
  );
}
