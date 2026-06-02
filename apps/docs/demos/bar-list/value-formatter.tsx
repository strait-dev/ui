"use client";

import { BarList } from "@strait/ui/components/bar-list";

const revenue = [
  { name: "Enterprise", value: 128_500 },
  { name: "Pro", value: 64_200 },
  { name: "Starter", value: 21_800 },
  { name: "Free", value: 4100 },
];

export default function BarListValueFormatter() {
  return (
    <div className="max-w-md">
      <BarList
        data={revenue}
        valueFormatter={(v) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
          }).format(v)
        }
      />
    </div>
  );
}
