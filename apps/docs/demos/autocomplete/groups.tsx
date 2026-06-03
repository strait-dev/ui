"use client";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@strait/ui/components/autocomplete";
import { Label } from "@strait/ui/components/label";

type FruitGroup = { value: string; items: string[] };

const fruitGroups: FruitGroup[] = [
  {
    value: "Berries",
    items: ["Blackberry", "Blueberry", "Raspberry", "Strawberry"],
  },
  { value: "Citrus", items: ["Grapefruit", "Lemon", "Lime", "Orange"] },
  { value: "Tropical", items: ["Banana", "Kiwi", "Mango", "Pineapple"] },
];

export default function AutocompleteGroups() {
  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label htmlFor="ac-groups">Favorite fruit</Label>
      <Autocomplete items={fruitGroups}>
        <AutocompleteInput id="ac-groups" placeholder="Search fruits…" />
        <AutocompleteContent>
          <AutocompleteEmpty>No fruits found.</AutocompleteEmpty>
          <AutocompleteList>
            {(group: FruitGroup) => (
              <AutocompleteGroup items={group.items} key={group.value}>
                <AutocompleteGroupLabel>{group.value}</AutocompleteGroupLabel>
                {group.items.map((item) => (
                  <AutocompleteItem key={item} value={item}>
                    {item}
                  </AutocompleteItem>
                ))}
              </AutocompleteGroup>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  );
}
