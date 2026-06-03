"use client";

import { Label } from "@strait/ui/components/label";
import { NumberInputWithChevrons } from "@strait/ui/components/number-input-with-chevrons";
import { useState } from "react";

export default function NumberInputWithChevronsDemo() {
  const [price, setPrice] = useState(9.99);

  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="chevrons-demo">Price</Label>
      <NumberInputWithChevrons
        formatOptions={{ style: "currency", currency: "USD" }}
        min={0}
        name="price"
        onChange={setPrice}
        step={0.01}
        value={price}
      />
      <p className="text-muted-foreground text-xs">Value: {price}</p>
    </div>
  );
}
