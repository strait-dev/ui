"use client";

import { SelectWithSearchAndButton } from "@strait/ui/components/select-with-search-and-button";
import { useState } from "react";

const FRAMEWORKS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

export default function SelectWithSearchAndButtonDisabled() {
  const [value] = useState("react");

  return (
    <div className="w-64">
      <SelectWithSearchAndButton
        disabled
        label="Framework (disabled)"
        onValueChange={() => undefined}
        options={FRAMEWORKS}
        placeholder="Select a framework"
        value={value}
      />
    </div>
  );
}
