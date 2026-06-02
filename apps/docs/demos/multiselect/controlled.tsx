"use client";

import { Label } from "@strait/ui/components/label";
import MultipleSelector, {
  type Option,
} from "@strait/ui/components/multiselect";
import { useState } from "react";

const skillOptions: Option[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "typescript", label: "TypeScript" },
  { value: "node", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
];

export default function MultiselectControlled() {
  const [selected, setSelected] = useState<Option[]>([
    { value: "react", label: "React" },
    { value: "typescript", label: "TypeScript" },
  ]);

  return (
    <div className="flex w-80 flex-col gap-2">
      <Label>Tech stack</Label>
      <MultipleSelector
        defaultOptions={skillOptions}
        emptyIndicator={
          <p className="text-center text-muted-foreground text-sm">
            No options.
          </p>
        }
        onChange={setSelected}
        placeholder="Add technologies…"
        value={selected}
      />
      <p className="text-muted-foreground text-sm">
        Selected: {selected.map((o) => o.label).join(", ") || "none"}
      </p>
    </div>
  );
}
