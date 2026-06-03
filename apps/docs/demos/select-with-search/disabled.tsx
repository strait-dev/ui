"use client";

import { SelectWithSearch } from "@strait/ui/components/select-with-search";
import { useState } from "react";

const COUNTRIES = [
  { value: "br", label: "Brazil" },
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
];

export default function SelectWithSearchDisabled() {
  const [value] = useState("us");

  return (
    <div className="w-64">
      <SelectWithSearch
        disabled
        label="Country (disabled)"
        onValueChange={() => undefined}
        options={COUNTRIES}
        placeholder="Select a country"
        value={value}
      />
    </div>
  );
}
