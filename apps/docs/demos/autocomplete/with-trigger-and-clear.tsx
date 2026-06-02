"use client";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@strait/ui/components/autocomplete";
import { Label } from "@strait/ui/components/label";

const languages = [
  "C",
  "C++",
  "C#",
  "Go",
  "Java",
  "JavaScript",
  "Kotlin",
  "Python",
  "Rust",
  "Swift",
  "TypeScript",
];

export default function AutocompleteWithTriggerAndClear() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="ac-tc">Favorite language</Label>
      <Autocomplete items={languages}>
        <AutocompleteInput
          id="ac-tc"
          placeholder="Search languages…"
          showClear
          showTrigger
        />
        <AutocompleteContent>
          <AutocompleteEmpty>No languages found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item: string) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  );
}
