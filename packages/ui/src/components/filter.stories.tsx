import {
  Calendar01Icon,
  CircleIcon,
  Flag01Icon,
  Tag01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge } from "./badge";
import {
  type Filter,
  type FilterFieldConfig,
  Filters,
  FiltersContent,
  type FiltersProps,
} from "./filter";

// ---------------------------------------------------------------------------
// Field definitions reused across stories
// ---------------------------------------------------------------------------

const statusField: FilterFieldConfig = {
  key: "status",
  label: "Status",
  type: "select",
  icon: Tag01Icon,
  options: [
    { value: "active", label: "Active" },
    { value: "archived", label: "Archived" },
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
  ],
};

const priorityField: FilterFieldConfig = {
  key: "priority",
  label: "Priority",
  type: "select",
  icon: Flag01Icon,
  options: [
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
    { value: "no_priority", label: "No priority" },
  ],
};

const labelsField: FilterFieldConfig = {
  key: "labels",
  label: "Labels",
  type: "multiselect",
  icon: CircleIcon,
  options: [
    { value: "bug", label: "Bug" },
    { value: "feature", label: "Feature" },
    { value: "docs", label: "Docs" },
    { value: "chore", label: "Chore" },
  ],
};

const assigneeField: FilterFieldConfig = {
  key: "assignee",
  label: "Assignee",
  type: "text",
  icon: UserIcon,
  placeholder: "Name…",
};

const dueDateField: FilterFieldConfig = {
  key: "due_date",
  label: "Due date",
  type: "text",
  icon: Calendar01Icon,
  prefix: "📅",
  pattern: "^\\d{4}-\\d{2}-\\d{2}$",
  placeholder: "YYYY-MM-DD",
};

const allFields: FilterFieldConfig[] = [
  statusField,
  priorityField,
  labelsField,
  assigneeField,
  dueDateField,
];

// ---------------------------------------------------------------------------
// Controlled demo wrapper — `Filters` is controlled-only, so each story owns
// its state. `filters` from args seeds the initial value.
// ---------------------------------------------------------------------------

function FiltersDemo({ filters: seed = [], ...props }: Partial<FiltersProps>) {
  const [filters, setFilters] = useState<Filter[]>(seed);
  return (
    <Filters
      {...(props as FiltersProps)}
      filters={filters}
      onChange={setFilters}
    />
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Filters> = {
  title: "Data Display/Filter",
  component: Filters,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A faceted filter builder modelled on corr.sh's Filters.",
          "",
          "Each active filter renders as a fused **ButtonGroup** chip with four",
          "segments — field label, an operator dropdown, a value selector, and a",
          "remove button. An **Add filter** trigger opens a searchable field",
          "picker; `select` / `multiselect` fields drill into a searchable option",
          "list so a value can be chosen as the filter is created.",
          "",
          "`Filters` is **controlled** — drive it with `filters` + `onChange` and",
          "generate ids for new filters with `createFilter`.",
        ].join("\n"),
      },
    },
  },
  render: (args) => <FiltersDemo {...args} />,
  args: {
    fields: allFields,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

/**
 * Mixed field types — `select`, `multiselect`, and `text` — seeded with two
 * active filters. Click **Filter** to add more.
 */
export const Playground: Story = {
  args: {
    fields: allFields,
    filters: [
      { id: "r1", field: "status", operator: "is", values: ["active"] },
      { id: "r2", field: "assignee", operator: "contains", values: ["Alice"] },
    ],
  },
};

// ---------------------------------------------------------------------------
// Empty
// ---------------------------------------------------------------------------

/**
 * No active filters — only the **Add filter** trigger shows.
 */
export const Empty: Story = {
  args: {
    fields: allFields,
  },
};

// ---------------------------------------------------------------------------
// Multiselect
// ---------------------------------------------------------------------------

/**
 * A `multiselect` field accumulates several values; the chip's value selector
 * stays open while toggling and reads "N selected".
 */
export const Multiselect: Story = {
  args: {
    fields: [labelsField, statusField],
    filters: [
      {
        id: "r1",
        field: "labels",
        operator: "is_any_of",
        values: ["bug", "feature"],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Text fields
// ---------------------------------------------------------------------------

/**
 * `text` fields render an inline input. `due_date` adds a `prefix` addon and a
 * `pattern` that surfaces a validation tooltip on blur when the format is off.
 */
export const TextFields: Story = {
  args: {
    fields: [assigneeField, dueDateField],
    filters: [
      { id: "r1", field: "assignee", operator: "contains", values: ["Bob"] },
      {
        id: "r2",
        field: "due_date",
        operator: "is",
        values: ["2025-12-31"],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Sizes
// ---------------------------------------------------------------------------

/**
 * `size` controls the density of every chip segment and the add trigger.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <FiltersDemo {...args} size="sm" />
      <FiltersDemo {...args} size="default" />
      <FiltersDemo {...args} size="lg" />
    </div>
  ),
  args: {
    fields: allFields,
    filters: [
      { id: "r1", field: "status", operator: "is", values: ["active"] },
      {
        id: "r2",
        field: "labels",
        operator: "is_any_of",
        values: ["bug", "docs"],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Radius (pill)
// ---------------------------------------------------------------------------

/**
 * `radius="full"` rounds each chip's outer corners into a pill.
 */
export const Pill: Story = {
  args: {
    fields: allFields,
    radius: "full",
    filters: [
      { id: "r1", field: "status", operator: "is", values: ["active"] },
      {
        id: "r2",
        field: "priority",
        operator: "is_not",
        values: ["low"],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Grouped fields
// ---------------------------------------------------------------------------

/**
 * Fields can be supplied as labelled groups; the picker renders each group as a
 * headed section.
 */
export const Grouped: Story = {
  args: {
    fields: [
      { group: "Tracking", fields: [statusField, priorityField] },
      { group: "People", fields: [assigneeField] },
      { group: "Metadata", fields: [labelsField, dueDateField] },
    ],
  },
};

// ---------------------------------------------------------------------------
// Disallow multiple
// ---------------------------------------------------------------------------

/**
 * With `allowMultiple={false}`, a field disappears from the picker once it is
 * already in use, and the trigger hides when every field is filtered.
 */
export const SingleUsePerField: Story = {
  args: {
    fields: [statusField, priorityField],
    allowMultiple: false,
    filters: [
      { id: "r1", field: "status", operator: "is", values: ["active"] },
    ],
  },
};

// ---------------------------------------------------------------------------
// Keyboard shortcut
// ---------------------------------------------------------------------------

/**
 * `enableShortcut` binds a key (default `f`) that opens the add-filter menu;
 * the bound key is shown as a `Kbd` hint in the trigger.
 */
export const KeyboardShortcut: Story = {
  args: {
    fields: allFields,
    enableShortcut: true,
    shortcutKey: "f",
    shortcutLabel: "F",
  },
};

// ---------------------------------------------------------------------------
// i18n
// ---------------------------------------------------------------------------

/**
 * All user-facing strings are overridable via `i18n` (partial, deep-merged
 * over the English defaults). Here the UI is localised to Spanish.
 */
export const Localized: Story = {
  args: {
    fields: allFields,
    i18n: {
      addFilter: "Filtrar",
      searchFields: "Buscar campo…",
      noFieldsFound: "Sin campos.",
      noResultsFound: "Sin resultados.",
      select: "Seleccionar…",
      selectedCount: "seleccionados",
      operators: {
        is: "es",
        isNot: "no es",
        isAnyOf: "es alguno de",
        contains: "contiene",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Controlled (with state read-back)
// ---------------------------------------------------------------------------

/**
 * `Filters` is controlled: the parent owns the `filters` array. Below the row
 * is a live JSON read-back of the current state.
 */
export const Controlled: Story = {
  render: (args) => {
    const [filters, setFilters] = useState<Filter[]>([
      { id: "r1", field: "status", operator: "is_not", values: ["archived"] },
    ]);
    return (
      <div className="flex flex-col gap-4">
        <Filters {...args} filters={filters} onChange={setFilters} />
        <pre className="rounded-lg bg-muted p-3 text-xs">
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    );
  },
  args: {
    fields: allFields,
  },
};

// ---------------------------------------------------------------------------
// Custom trigger
// ---------------------------------------------------------------------------

/**
 * Replace the default "Add filter" button with any element via `trigger`.
 */
export const CustomTrigger: Story = {
  args: {
    fields: allFields,
    trigger: <Badge className="cursor-pointer">+ Add a filter</Badge>,
  },
};

// ---------------------------------------------------------------------------
// FiltersContent (chips only)
// ---------------------------------------------------------------------------

/**
 * `FiltersContent` renders just the active chips (no add trigger) so the
 * builder control can live elsewhere in your layout.
 */
export const ChipsOnly: Story = {
  render: (args) => {
    const [filters, setFilters] = useState<Filter[]>([
      { id: "r1", field: "status", operator: "is", values: ["active"] },
      {
        id: "r2",
        field: "labels",
        operator: "is_any_of",
        values: ["bug", "feature"],
      },
    ]);
    return (
      <FiltersContent
        fields={args.fields}
        filters={filters}
        onChange={setFilters}
      />
    );
  },
  args: {
    fields: allFields,
  },
};
