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

export default function SelectWithSearchAndButtonWithAction() {
  const [value, setValue] = useState("");
  const [teams, setTeams] = useState(TEAMS);
  const [counter, setCounter] = useState(teams.length + 1);

  const handleAddTeam = () => {
    const newTeam = { value: `team-${counter}`, label: `Team ${counter}` };
    setTeams((prev) => [...prev, newTeam]);
    setCounter((c) => c + 1);
  };

  return (
    <div className="w-64">
      <SelectWithSearchAndButton
        buttonText="Create team"
        label="Team"
        onButtonClick={handleAddTeam}
        onValueChange={setValue}
        options={teams}
        placeholder="Select a team"
        value={value}
      />
      <p className="mt-2 text-muted-foreground text-sm">
        {value
          ? teams.find((t) => t.value === value)?.label
          : "Nothing selected"}
      </p>
    </div>
  );
}
