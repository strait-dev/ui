"use client";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@strait/ui/components/autocomplete";

const cities = [
  "Amsterdam",
  "Berlin",
  "Chicago",
  "Dublin",
  "London",
  "Madrid",
  "New York",
  "Paris",
  "Tokyo",
];

export default function AutocompleteSizes() {
  return (
    <div className="flex w-72 flex-col gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Autocomplete items={cities} key={size}>
          <AutocompleteInput
            placeholder={`Size: ${size}`}
            showClear
            size={size}
          />
          <AutocompleteContent>
            <AutocompleteEmpty>No cities found.</AutocompleteEmpty>
            <AutocompleteList>
              {(item: string) => (
                <AutocompleteItem key={item} value={item}>
                  {item}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
      ))}
    </div>
  );
}
