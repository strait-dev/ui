"use client";

import { Label } from "@strait/ui/components/label";
import { Slider } from "@strait/ui/components/slider";
import { useState } from "react";

export default function SliderDemo() {
  const [value, setValue] = useState([60]);

  return (
    <div className="flex w-72 flex-col gap-3">
      <Label>Volume: {value[0]}</Label>
      <Slider
        aria-label="Volume"
        defaultValue={value}
        max={100}
        min={0}
        onValueChange={(v) => setValue(v as number[])}
      />
    </div>
  );
}
