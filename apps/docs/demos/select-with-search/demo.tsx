"use client";

import { SelectWithSearch } from "@strait/ui/components/select-with-search";
import { useState } from "react";

const FRAMEWORKS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "SolidJS" },
  { value: "qwik", label: "Qwik" },
  { value: "astro", label: "Astro" },
  { value: "remix", label: "Remix" },
];

export default function SelectWithSearchDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="w-64">
      <SelectWithSearch
        label="Framework"
        onValueChange={setValue}
        options={FRAMEWORKS}
        placeholder="Select a framework"
        searchPlaceholder="Search frameworks..."
        value={value}
      />
    </div>
  );
}
