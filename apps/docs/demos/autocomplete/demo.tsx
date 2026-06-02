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

const fruits = [
  "Apple",
  "Banana",
  "Blueberry",
  "Cherry",
  "Grape",
  "Kiwi",
  "Mango",
  "Orange",
  "Peach",
  "Strawberry",
];

export default function AutocompleteDemo() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label>Favorite fruit</Label>
      <Autocomplete items={fruits}>
        <AutocompleteInput placeholder="Search fruits…" />
        <AutocompleteContent>
          <AutocompleteEmpty>No fruits found.</AutocompleteEmpty>
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
