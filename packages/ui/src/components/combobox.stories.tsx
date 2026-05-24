import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./button";
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
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "./combobox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

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

/* ------------------------------------------------------------------ */
/* Groups + separators                                                 */
/* ------------------------------------------------------------------ */

type FruitCategory = { value: string; items: string[] };

const fruitCategories: FruitCategory[] = [
  {
    value: "Citrus",
    items: ["Grapefruit", "Lemon", "Lime", "Orange", "Tangerine"],
  },
  {
    value: "Berries",
    items: ["Blackberry", "Blueberry", "Raspberry", "Strawberry"],
  },
  { value: "Tropical", items: ["Coconut", "Mango", "Papaya", "Pineapple"] },
];

function GroupedWithSeparatorsCombobox() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="flex w-72 flex-col gap-1.5">
      <Label>Fruit category</Label>
      <Combobox items={fruitCategories} onValueChange={setValue} value={value}>
        <ComboboxInput
          placeholder="Search by category…"
          showClear={!!value}
          showTrigger
        />
        <ComboboxContent>
          <ComboboxList>
            {(category: FruitCategory, index: number) => (
              <>
                {index > 0 && (
                  <ComboboxSeparator key={`sep-${category.value}`} />
                )}
                <ComboboxGroup items={category.items} key={category.value}>
                  <ComboboxLabel>{category.value}</ComboboxLabel>
                  <ComboboxCollection>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              </>
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

/**
 * Multiple labelled groups separated by thin horizontal rules.
 * Use `ComboboxSeparator` between `ComboboxGroup`s to create
 * visual section breaks in long grouped lists.
 */
export const GroupedWithSeparators: Story = {
  render: () => <GroupedWithSeparatorsCombobox />,
  parameters: {
    docs: {
      description: {
        story: [
          "Demonstrates `ComboboxGroup`, `ComboboxLabel`, and `ComboboxSeparator` together.",
          "",
          "Place a `<ComboboxSeparator />` **between** `ComboboxGroup` elements (not inside them)",
          "to render a thin `1px` horizontal rule. The separator inherits the list's padding so",
          "it spans edge-to-edge inside the scroll container.",
          "",
          "In this example the items are mapped statically (no `Collection` API) since the",
          "total item count is small and no virtualisation is needed.",
        ].join("\n"),
      },
    },
  },
};

/* ------------------------------------------------------------------ */
/* Popover + Command recipe                                            */
/* ------------------------------------------------------------------ */

const programmingLanguages = [
  { value: "go", label: "Go" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "typescript", label: "TypeScript" },
  { value: "kotlin", label: "Kotlin" },
  { value: "swift", label: "Swift" },
  { value: "elixir", label: "Elixir" },
  { value: "haskell", label: "Haskell" },
];

/**
 * A select-style combobox assembled from the lower-level
 * `Popover` + `Command` primitives.
 *
 * This is a locally-defined recipe — it is **not** exported from
 * `combobox.tsx`. Copy and adapt it in your own application layer
 * when the built-in `Combobox` doesn't fit your needs.
 */
function PopoverCommandSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  const selectedLabel =
    programmingLanguages.find((lang) => lang.value === value)?.label ?? null;

  return (
    <div className="flex w-64 flex-col gap-1.5">
      <Label htmlFor="popover-command-trigger">Language</Label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger
          id="popover-command-trigger"
          render={
            <Button
              aria-expanded={open}
              aria-haspopup="listbox"
              className="w-full justify-between font-normal"
              variant="outline"
            />
          }
        >
          {selectedLabel ?? "Select a language…"}
          {/* down-chevron via a simple unicode so we avoid an extra icon import */}
          <span aria-hidden className="ml-auto opacity-50">
            ▾
          </span>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-64 p-0"
          side="bottom"
          sideOffset={4}
        >
          <Command>
            <CommandInput placeholder="Search languages…" />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {programmingLanguages.map((lang) => (
                  <CommandItem
                    data-checked={value === lang.value ? "true" : undefined}
                    key={lang.value}
                    onSelect={() => {
                      setValue(lang.value === value ? null : lang.value);
                      setOpen(false);
                    }}
                    value={lang.value}
                  >
                    {lang.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value && (
        <p className="text-muted-foreground text-sm">
          Selected: <code>{value}</code>
        </p>
      )}
    </div>
  );
}

/** Popover + Command assembled into a select-style combobox without the Base UI Combobox primitive. */
export const PopoverCommandRecipe: Story = {
  render: () => <PopoverCommandSelect />,
  parameters: {
    docs: {
      description: {
        story: [
          "## Popover + Command recipe",
          "",
          "This story demonstrates an alternative way to build a select-style combobox by",
          "composing the **`Popover`** and **`Command`** primitives directly, without using",
          "the Base UI `Combobox` component.",
          "",
          "### When to use this pattern",
          "",
          "| Scenario | Recommended component |",
          "|---|---|",
          "| Standard autocomplete / filterable select | `Combobox` (Base UI) |",
          "| Command palette (actions, not just data items) | `CommandDialog` |",
          "| Fully custom trigger (e.g. a Button, not a text input) that opens a searchable list | **Popover + Command** (this recipe) |",
          "| The list needs `CommandGroup`/`CommandSeparator` structure but the trigger should look like a select | **Popover + Command** |",
          "",
          "### How it works",
          "",
          "1. **`Popover`** manages open/close state and positions the floating panel.",
          "   `PopoverTrigger` wraps a `Button` (via the `render` prop) so the trigger",
          "   looks like a standard select control.",
          "2. **`PopoverContent`** hosts the `Command` tree with `p-0` padding so the",
          "   Command's own internal spacing applies cleanly.",
          "3. **`Command` + `CommandInput` + `CommandList`** provide keyboard navigation,",
          "   filtering, and the scrollable item list — identical to the command palette UX.",
          "4. Selecting a `CommandItem` closes the popover (`setOpen(false)`) and updates",
          "   local state; the trigger button re-renders to show the selected label.",
          "",
          "### Trade-offs vs Base UI `Combobox`",
          "",
          "- **No native `<input>` in the trigger** — the trigger is a button, so the user",
          "  can only filter after opening the popover. The Base UI `Combobox` embeds the",
          "  filter input in the trigger itself, enabling single-click typing.",
          "- **Simpler state** — no Base UI `items` array needed; filtering is handled by",
          "  `cmdk` internally via the `value` prop on `CommandItem`.",
          "- **More composable** — easy to add `CommandSeparator`, multi-group layouts,",
          "  icons, shortcuts, or arbitrary content inside the popover.",
        ].join("\n"),
      },
    },
  },
};
