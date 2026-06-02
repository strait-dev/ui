"use client";

import { BarList } from "@strait/ui/components/bar-list";

const referrers = [
  { name: "google.com", value: 8420, href: "https://google.com" },
  { name: "github.com", value: 5210, href: "https://github.com" },
  { name: "twitter.com", value: 3180, href: "https://twitter.com" },
  { name: "producthunt.com", value: 1640, href: "https://producthunt.com" },
  { name: "direct", value: 920 },
];

export default function BarListWithLinks() {
  return (
    <div className="max-w-md">
      <BarList data={referrers} valueFormatter={(v) => v.toLocaleString()} />
    </div>
  );
}
