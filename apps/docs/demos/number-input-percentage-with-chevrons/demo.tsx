"use client";

import { Label } from "@strait/ui/components/label";
import { NumberInputPercentageWithChevrons } from "@strait/ui/components/number-input-percentage-with-chevrons";
import { useState } from "react";

export default function NumberInputPercentageWithChevronsDemo() {
  const [pct, setPct] = useState(25);

  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="pct-demo">Discount</Label>
      <NumberInputPercentageWithChevrons
        name="discount"
        onChange={setPct}
        value={pct}
      />
      <p className="text-muted-foreground text-xs">Value: {pct}%</p>
    </div>
  );
}
