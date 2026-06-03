"use client";

import { SelectWithSearchAndButton } from "@strait/ui/components/select-with-search-and-button";
import { useState } from "react";

const TEAMS = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
];

export default function SelectWithSearchAndButtonDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="w-64">
      <SelectWithSearchAndButton
        buttonText="Create team"
        label="Team"
        onValueChange={setValue}
        options={TEAMS}
        placeholder="Select a team"
        value={value}
      />
    </div>
  );
}
