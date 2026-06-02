"use client";

import { BarList } from "@strait/ui/components/bar-list";

const data = [
  { name: "/home", value: 4200 },
  { name: "/pricing", value: 3100, href: "/pricing" },
  { name: "/docs", value: 2700 },
  { name: "/blog", value: 1950 },
  { name: "/about", value: 1100 },
];

export default function BarListDemo() {
  return (
    <div className="w-96">
      <BarList data={data} valueFormatter={(v) => v.toLocaleString()} />
    </div>
  );
}
