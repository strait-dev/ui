"use client";

import { Label } from "@strait/ui/components/label";
import { NumberInputWithChevrons } from "@strait/ui/components/number-input-with-chevrons";
import { useState } from "react";

export default function NumberInputWithChevronsCurrency() {
  const [price, setPrice] = useState(9.99);

  return (
    <div className="flex w-48 flex-col gap-1.5">
      <Label>Price</Label>
      <NumberInputWithChevrons
        formatOptions={{ style: "currency", currency: "USD" }}
        label="Price"
        min={0}
        name="price"
        onChange={setPrice}
        step={0.01}
        value={price}
      />
      <p className="text-muted-foreground text-sm">Raw: {price}</p>
    </div>
  );
}
