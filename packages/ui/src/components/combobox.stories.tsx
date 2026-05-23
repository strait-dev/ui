import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "./combobox";
import { Label } from "./label";

const meta = {
  title: "Forms/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "An accessible combobox (autocomplete) built on the Base UI `Combobox` primitive.",
          "",
          "Pass the data set to the root via `items`; the `ComboboxList` renders a",
          "function child once per filtered item, so filtering is handled for you.",
          "",
          "**Basic usage** — wrap `ComboboxInput` (the trigger + text field) and",
          "`ComboboxContent` (the floating list) inside a `<Combobox>` root.",
          "",
          "**Grouped** — pass an array of `{ value, items }` groups; render each",
          "with `ComboboxGroup` + `ComboboxLabel` and an inner `ComboboxCollection`.",
          "",
          "**Multi-select (chips)** — set `multiple`, render selected values as",
          "`ComboboxChip`s inside a `ComboboxValue` render function, and pass the",
          "`ComboboxChips` ref as `anchor` to `ComboboxContent`.",
        ].join("\n"),
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;

type Story = StoryObj<typeof meta>;

const fruits = [
  "Apple",
  "Apricot",
  "Banana",
  "Blueberry",
  "Cherry",
  "Grape",
  "Kiwi",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
  "Pineapple",
  "Strawberry",
  "Watermelon",
];

/* ------------------------------------------------------------------ */
/* Playground — basic single-select                                    */
/* ------------------------------------------------------------------ */

function BasicCombobox() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="basic-combobox">Favorite fruit</Label>
      <Combobox items={fruits} onValueChange={setValue} value={value}>
        <ComboboxInput
          id="basic-combobox"
          placeholder="Search fruits…"
          showClear={!!value}
          showTrigger
        />
        <ComboboxContent>
          <ComboboxList>
            {(fruit: string) => (
              <ComboboxItem key={fruit} value={fruit}>
                {fruit}
              </ComboboxItem>
            )}
          </ComboboxList>
          <ComboboxEmpty>No fruits found.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
      {value && (
        <p className="text-muted-foreground text-sm">
          Selected: <code>{value}</code>
        </p>
      )}
    </div>
  );
}

/** Basic single-select combobox with filtering. */
export const Playground: Story = {
  render: () => <BasicCombobox />,
};

/* ------------------------------------------------------------------ */
/* Grouped items                                                       */
/* ------------------------------------------------------------------ */

const vegetables = ["Broccoli", "Carrot", "Celery", "Corn", "Lettuce", "Pea"];

type FoodGroup = { value: string; items: string[] };

const foodGroups: FoodGroup[] = [
  { value: "Fruits", items: fruits.slice(0, 5) },
  { value: "Vegetables", items: vegetables },
];

function GroupedCombobox() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Label>Food item</Label>
      <Combobox items={foodGroups} onValueChange={setValue} value={value}>
        <ComboboxInput placeholder="Search…" showTrigger />
        <ComboboxContent>
          <ComboboxList>
            {(group: FoodGroup) => (
              <ComboboxGroup items={group.items} key={group.value}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
          <ComboboxEmpty>Nothing found.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

/** Items organised into labelled groups. */
export const Grouped: Story = {
  render: () => <GroupedCombobox />,
};

/* ------------------------------------------------------------------ */
/* Multi-select (chips)                                                */
/* ------------------------------------------------------------------ */

function ChipsCombobox() {
  const [selected, setSelected] = useState<string[]>(["Apple", "Mango"]);
  const anchor = useComboboxAnchor();

  return (
    <div className="flex w-80 flex-col gap-1.5">
      <Label>Favorites</Label>
      <Combobox
        items={fruits}
        multiple
        onValueChange={setSelected}
        value={selected}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) =>
              values.map((v) => <ComboboxChip key={v}>{v}</ComboboxChip>)
            }
          </ComboboxValue>
          <ComboboxChipsInput placeholder="Add fruit…" />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxList>
            {(fruit: string) => (
              <ComboboxItem key={fruit} value={fruit}>
                {fruit}
              </ComboboxItem>
            )}
          </ComboboxList>
          <ComboboxEmpty>No fruits found.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

/** Multi-select variant using chip tokens for each selected value. */
export const WithChips: Story = {
  render: () => <ChipsCombobox />,
};

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

function EmptyCombobox() {
  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Label>Country</Label>
      <Combobox items={[]}>
        <ComboboxInput placeholder="Type to search…" showTrigger />
        <ComboboxContent>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
          <ComboboxEmpty>No countries matched your search.</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

/** Shows the empty state message when no items match. */
export const Empty: Story = {
  render: () => <EmptyCombobox />,
};
