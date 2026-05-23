import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Label } from "./label";
import MultipleSelector, { type Option } from "./multiselect";

const meta = {
  title: "Forms/MultiSelect",
  component: MultipleSelector,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "A searchable, multi-select input built on `cmdk`. Each selected item",
          "is rendered as a badge with a remove button.",
          "",
          "Pass options via `defaultOptions` (static) or `options` (controlled).",
          "For async search, provide an `onSearch` callback that returns a",
          "`Promise<Option[]>`. Use `onSearchSync` for synchronous filtering.",
          "",
          "### Size axis (`sm | default`)",
          "Controls the minimum height of the control and the height/text of",
          "selected chips:",
          "",
          "| Value | Control min-height | Chip height | Chip text |",
          "|-------|--------------------|-------------|-----------|",
          "| `sm` | `min-h-8` | `h-6` | `text-xs` |",
          "| `default` | `min-h-[42px]` | `h-8` | `text-sm` |",
          "",
          "Notable props:",
          "- `maxSelected` — caps the number of selections.",
          "- `creatable` — allows the user to create new options.",
          "- `groupBy` — groups options by a key in the `Option` object.",
          "- `hideClearAllButton` — hides the 'clear all' ✕ button.",
        ].join("\n"),
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text shown in the input.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the entire component.",
    },
    creatable: {
      control: "boolean",
      description: "Allow creating new options when no match is found.",
    },
    maxSelected: {
      control: { type: "number", min: 1 },
      description: "Maximum number of items that can be selected.",
    },
    hideClearAllButton: {
      control: "boolean",
      description: "Hides the clear-all button.",
    },
    size: {
      control: "select",
      options: ["sm", "default"],
      description: "Size axis controlling control height and chip size.",
    },
  },
  args: {
    placeholder: "Select skills…",
    disabled: false,
    creatable: false,
    hideClearAllButton: false,
    size: "default",
  },
} satisfies Meta<typeof MultipleSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

const skillOptions: Option[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "typescript", label: "TypeScript" },
  { value: "node", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
];

/* ------------------------------------------------------------------ */
/* Playground                                                          */
/* ------------------------------------------------------------------ */

/** Interactive playground — select from the list or type to search. */
export const Playground: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label>Skills</Label>
      <MultipleSelector
        {...args}
        defaultOptions={skillOptions}
        emptyIndicator={
          <p className="text-center text-muted-foreground text-sm">
            No results found.
          </p>
        }
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Sizes                                                               */
/* ------------------------------------------------------------------ */

/**
 * Both `size` values shown side-by-side.
 *
 * - `default` — `min-h-[42px]` control, `h-8` chips, `text-sm`
 * - `sm` — `min-h-8` control, `h-6` chips, `text-xs`
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Default size</Label>
        <MultipleSelector
          defaultOptions={skillOptions}
          emptyIndicator={
            <p className="text-center text-muted-foreground text-sm">
              No results.
            </p>
          }
          placeholder="Select skills…"
          size="default"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Small size (sm)</Label>
        <MultipleSelector
          defaultOptions={skillOptions}
          emptyIndicator={
            <p className="text-center text-muted-foreground text-xs">
              No results.
            </p>
          }
          placeholder="Select skills…"
          size="sm"
        />
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* With default selections                                             */
/* ------------------------------------------------------------------ */

function PreSelectedMultiSelect() {
  const [value, setValue] = useState<Option[]>([
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
        onChange={setValue}
        placeholder="Add technologies…"
        value={value}
      />
      <p className="text-muted-foreground text-sm">
        Selected: {value.map((o) => o.label).join(", ") || "none"}
      </p>
    </div>
  );
}

/** Pre-selected items, controlled via state. */
export const WithDefaults: Story = {
  render: () => <PreSelectedMultiSelect />,
};

/* ------------------------------------------------------------------ */
/* Max selected                                                        */
/* ------------------------------------------------------------------ */

/** Caps selection at 3 items; shows an alert when the limit is reached. */
export const MaxSelected: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label>Favorite frameworks (max 3)</Label>
      <MultipleSelector
        defaultOptions={skillOptions}
        emptyIndicator={
          <p className="text-center text-muted-foreground text-sm">
            No options.
          </p>
        }
        maxSelected={3}
        onMaxSelected={(max) =>
          alert(`You can select a maximum of ${max} items.`)
        }
        placeholder="Pick up to 3…"
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Creatable                                                           */
/* ------------------------------------------------------------------ */

/** When no match found, a "Create …" item appears at the bottom. */
export const Creatable: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label>Tags</Label>
      <MultipleSelector
        creatable
        defaultOptions={[
          { value: "design", label: "Design" },
          { value: "frontend", label: "Frontend" },
          { value: "backend", label: "Backend" },
        ]}
        emptyIndicator={
          <p className="text-center text-muted-foreground text-sm">
            Type to create a tag.
          </p>
        }
        placeholder="Add tags…"
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Disabled                                                            */
/* ------------------------------------------------------------------ */

/** Disabled state — interaction is blocked. */
export const Disabled: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label>Roles</Label>
      <MultipleSelector
        defaultOptions={[
          { value: "admin", label: "Admin" },
          { value: "editor", label: "Editor" },
        ]}
        disabled
        placeholder="Cannot edit…"
        value={[{ value: "admin", label: "Admin" }]}
      />
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Grouped options                                                     */
/* ------------------------------------------------------------------ */

const groupedOptions: Option[] = [
  { value: "react", label: "React", category: "Frontend" },
  { value: "vue", label: "Vue", category: "Frontend" },
  { value: "svelte", label: "Svelte", category: "Frontend" },
  { value: "node", label: "Node.js", category: "Backend" },
  { value: "python", label: "Python", category: "Backend" },
  { value: "go", label: "Go", category: "Backend" },
];

/** Options grouped by the `category` key. */
export const Grouped: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-1.5">
      <Label>Technologies by area</Label>
      <MultipleSelector
        defaultOptions={groupedOptions}
        emptyIndicator={
          <p className="text-center text-muted-foreground text-sm">
            No options.
          </p>
        }
        groupBy="category"
        placeholder="Search technologies…"
      />
    </div>
  ),
};
