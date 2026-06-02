"use client";

import { Label } from "@strait/ui/components/label";
import { Slider } from "@strait/ui/components/slider";
import { useState } from "react";

export default function SliderRange() {
  const [range, setRange] = useState([20, 80]);

  return (
    <div className="flex w-72 flex-col gap-3">
      <Label>
        Price range: ${range[0]} – ${range[1]}
      </Label>
      <Slider
        aria-label="Price range"
        defaultValue={range}
        max={200}
        min={0}
        onValueChange={(v) => setRange(v as number[])}
        step={5}
      />
    </div>
  );
}
