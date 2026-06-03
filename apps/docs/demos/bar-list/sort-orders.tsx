"use client";

import { BarList } from "@strait/ui/components/bar-list";

const pages = [
  { name: "/home", value: 4200 },
  { name: "/pricing", value: 3100 },
  { name: "/docs", value: 1800 },
  { name: "/blog", value: 950 },
  { name: "/about", value: 420 },
];

export default function BarListSortOrders() {
  return (
    <div className="flex max-w-md flex-col gap-8">
      <div>
        <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Descending (default)
        </p>
        <BarList
          data={pages}
          sortOrder="descending"
          valueFormatter={(v) => v.toLocaleString()}
        />
      </div>
      <div>
        <p className="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Ascending
        </p>
        <BarList
          data={pages}
          sortOrder="ascending"
          valueFormatter={(v) => v.toLocaleString()}
        />
      </div>
    </div>
  );
}
