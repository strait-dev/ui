"use client";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useId, useMemo, useState } from "react";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "./autocomplete";
import { Button } from "./button";
import { Label } from "./label";

const fruits = [
  "Apple",
  "Apricot",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Cranberry",
  "Grape",
  "Grapefruit",
  "Kiwi",
  "Lemon",
  "Lime",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
  "Pineapple",
  "Raspberry",
  "Strawberry",
  "Watermelon",
];

type FruitGroup = { value: string; items: string[] };

const fruitGroups: FruitGroup[] = [
  {
    value: "Berries",
    items: ["Blackberry", "Blueberry", "Raspberry", "Strawberry"],
  },
  { value: "Citrus", items: ["Grapefruit", "Lemon", "Lime", "Orange"] },
  { value: "Tropical", items: ["Banana", "Kiwi", "Mango", "Pineapple"] },
];

const meta = {
  title: "Forms/Autocomplete",
  component: Autocomplete,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A free-text input with a filtered suggestion list, built on the Base UI",
          "`Autocomplete` primitive.",
          "",
          "Pass the data set to the root via `items`; `AutocompleteList` renders a",
          "function child once per filtered item, so filtering is handled for you.",
          "Use `value` / `onValueChange` to control the typed query string.",
          "",
          "**Buttons** — `AutocompleteInput` accepts `showTrigger` (a chevron that",
          "opens the list) and `showClear` (a button that clears the query).",
          "",
          "**Groups** — pass an array of `{ value, items }` and render each with",
          "`AutocompleteGroup` + `AutocompleteGroupLabel`.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Autocomplete>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Interactive playground — type to filter the suggestion list. */
export const Playground: Story = {
  render: () => (
    <Autocomplete items={fruits}>
      <AutocompleteInput className="w-72" placeholder="Search fruits…" />
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
  ),
};

/** Disabled — the input is non-interactive. */
export const Disabled: Story = {
  render: () => (
    <Autocomplete items={fruits}>
      <AutocompleteInput
        className="w-72"
        disabled
        placeholder="Search fruits…"
      />
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
  ),
};

/**
 * Auto-highlight — the first match is highlighted automatically so pressing
 * Enter selects it. Set `autoHighlight` on the root.
 */
export const AutoHighlight: Story = {
  render: () => (
    <Autocomplete autoHighlight items={fruits}>
      <AutocompleteInput className="w-72" placeholder="Search fruits…" />
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
  ),
};

/** With an associated `Label`. */
export const WithLabel: Story = {
  render: () => {
    function LabelledAutocomplete() {
      const id = useId();
      return (
        <div className="flex w-72 flex-col gap-1.5">
          <Label htmlFor={id}>Favourite fruit</Label>
          <Autocomplete items={fruits}>
            <AutocompleteInput id={id} placeholder="Search fruits…" />
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
    return <LabelledAutocomplete />;
  },
};

/** With a clear button — appears once there is a query to reset. */
export const WithClear: Story = {
  render: () => (
    <Autocomplete items={fruits}>
      <AutocompleteInput
        className="w-72"
        placeholder="Search fruits…"
        showClear
      />
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
  ),
};

/** With a trigger button — a chevron that opens the suggestion list. */
export const WithTrigger: Story = {
  render: () => (
    <Autocomplete items={fruits}>
      <AutocompleteInput
        className="w-72"
        placeholder="Search fruits…"
        showTrigger
      />
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
  ),
};

/**
 * With both buttons — the clear button replaces the trigger once the field has
 * a value.
 */
export const WithTriggerAndClear: Story = {
  render: () => (
    <Autocomplete items={fruits}>
      <AutocompleteInput
        className="w-72"
        placeholder="Search fruits…"
        showClear
        showTrigger
      />
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
  ),
};

/** Grouped suggestions with section headings. */
export const Groups: Story = {
  render: () => (
    <Autocomplete items={fruitGroups}>
      <AutocompleteInput className="w-72" placeholder="Search fruits…" />
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
  ),
};

/**
 * Async search — items are fetched as the user types. A status line announces
 * the loading state. `mode` stays `list`, but the data set is updated
 * externally to simulate a server round-trip.
 */
export const AsyncSearch: Story = {
  render: () => {
    function AsyncAutocomplete() {
      const [query, setQuery] = useState("");
      const [results, setResults] = useState<string[]>([]);
      const [loading, setLoading] = useState(false);

      useEffect(() => {
        if (query.trim() === "") {
          setResults([]);
          setLoading(false);
          return;
        }
        setLoading(true);
        const handle = setTimeout(() => {
          setResults(
            fruits.filter((f) =>
              f.toLowerCase().includes(query.toLowerCase().trim())
            )
          );
          setLoading(false);
        }, 500);
        return () => clearTimeout(handle);
      }, [query]);

      return (
        <Autocomplete items={results} onValueChange={setQuery} value={query}>
          <AutocompleteInput className="w-72" placeholder="Search fruits…" />
          <AutocompleteContent>
            <AutocompleteStatus>
              {loading ? "Searching…" : null}
            </AutocompleteStatus>
            {!loading && (
              <AutocompleteEmpty>
                {query ? "No fruits found." : "Type to search."}
              </AutocompleteEmpty>
            )}
            <AutocompleteList>
              {(item: string) => (
                <AutocompleteItem key={item} value={item}>
                  {item}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
      );
    }
    return <AsyncAutocomplete />;
  },
};

/** All three height variants — `sm`, `default`, and `lg`. */
export const Sizes: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Autocomplete items={fruits} key={size}>
          <AutocompleteInput
            placeholder={`Size: ${size}`}
            showClear
            size={size}
          />
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
      ))}
    </div>
  ),
};

/**
 * Form integration — the selected value is submitted under the `name` set on
 * the root. Submitting reads it back from `FormData`.
 */
export const Form: Story = {
  render: () => {
    function FormAutocomplete() {
      const [submitted, setSubmitted] = useState<string | null>(null);
      const options = useMemo(() => fruits, []);
      return (
        <form
          className="flex w-72 flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setSubmitted(String(data.get("fruit") ?? ""));
          }}
        >
          <Autocomplete items={options} name="fruit">
            <AutocompleteInput placeholder="Pick a fruit…" showClear />
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
          <Button size="sm" type="submit">
            Submit
          </Button>
          {submitted ? (
            <p className="text-muted-foreground text-xs">
              Submitted: {submitted || "(empty)"}
            </p>
          ) : null}
        </form>
      );
    }
    return <FormAutocomplete />;
  },
};
