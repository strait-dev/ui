"use client";

import { SelectWithSearch } from "@strait/ui/components/select-with-search";
import { useState } from "react";

const FRAMEWORKS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
];

export default function SelectWithSearchError() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-64 flex-col gap-1">
      <SelectWithSearch
        error
        label="Framework"
        onValueChange={setValue}
        options={FRAMEWORKS}
        placeholder="Select a framework"
        required
        value={value}
      />
      {!value && (
        <p className="text-destructive text-sm">This field is required.</p>
      )}
    </div>
  );
}
