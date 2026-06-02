"use client";

import { SelectWithSearch } from "@strait/ui/components/select-with-search";
import { useState } from "react";

const COUNTRIES = [
  { value: "br", label: "Brazil" },
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "cn", label: "China" },
  { value: "in", label: "India" },
  { value: "au", label: "Australia" },
  { value: "ca", label: "Canada" },
  { value: "mx", label: "Mexico" },
];

export default function SelectWithSearchPreselected() {
  const [value, setValue] = useState("br");

  return (
    <div className="w-64">
      <SelectWithSearch
        label="Country"
        onValueChange={setValue}
        options={COUNTRIES}
        placeholder="Select a country"
        searchPlaceholder="Search countries..."
        value={value}
      />
      <p className="mt-2 text-muted-foreground text-sm">
        Selected: {COUNTRIES.find((c) => c.value === value)?.label ?? "—"}
      </p>
    </div>
  );
}
