"use client";

import { SelectWithSearchAndButton } from "@strait/ui/components/select-with-search-and-button";
import { useState } from "react";

const CATEGORIES = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "improvement", label: "Improvement" },
  { value: "docs", label: "Documentation" },
];

export default function SelectWithSearchAndButtonError() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-64 flex-col gap-1">
      <SelectWithSearchAndButton
        buttonText="Add category"
        error={!value}
        label="Category"
        onButtonClick={() => undefined}
        onValueChange={setValue}
        options={CATEGORIES}
        placeholder="Select a category"
        required
        value={value}
      />
      {!value && (
        <p className="text-destructive text-sm">Please select a category.</p>
      )}
    </div>
  );
}
