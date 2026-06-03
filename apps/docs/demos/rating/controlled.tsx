"use client";

import { Rating } from "@strait/ui/components/rating";
import { useState } from "react";

export default function RatingControlled() {
  const [value, setValue] = useState(2);

  return (
    <div className="flex flex-col gap-3">
      <Rating
        aria-label="Controlled rating"
        max={5}
        onValueChange={setValue}
        value={value}
      />
      <p className="text-muted-foreground text-sm">Selected: {value} / 5</p>
    </div>
  );
}
