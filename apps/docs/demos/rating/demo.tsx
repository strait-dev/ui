"use client";

import { Rating } from "@strait/ui/components/rating";
import { useState } from "react";

export default function RatingDemo() {
  const [value, setValue] = useState(3);

  return (
    <div className="flex flex-col gap-2">
      <Rating
        aria-label="Product rating"
        max={5}
        onValueChange={setValue}
        value={value}
      />
      <p className="text-muted-foreground text-sm">Rating: {value} / 5</p>
    </div>
  );
}
