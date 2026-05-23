import {
  Calendar01Icon,
  Tag01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import type { FilterFieldDef } from "./filter";
import { Filter, type FilterRule } from "./filter";

// ---------------------------------------------------------------------------
// Field definitions reused across stories
// ---------------------------------------------------------------------------

const statusField: FilterFieldDef = {
  id: "status",
  label: "Status",
  type: "select",
  options: [
    { label: "Active", value: "active" },
    { label: "Archived", value: "archived" },
    { label: "Draft", value: "draft" },
    { label: "Pending", value: "pending" },
  ],
  icon: Tag01Icon,
};

const assigneeField: FilterFieldDef = {
  id: "assignee",
  label: "Assignee",
  type: "text",
  icon: UserIcon,
};

const priorityField: FilterFieldDef = {
  id: "priority",
  label: "Priority",
  type: "select",
  options: [
    { label: "Urgent", value: "urgent" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
    { label: "No priority", value: "no_priority" },
  ],
};

const estimateField: FilterFieldDef = {
  id: "estimate",
  label: "Estimate",
  type: "number",
};

const dueDateField: FilterFieldDef = {
  id: "due_date",
  label: "Due date",
  type: "date",
  icon: Calendar01Icon,
};

const allFields: FilterFieldDef[] = [
  statusField,
  assigneeField,
  priorityField,
  estimateField,
  dueDateField,
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Filter> = {
  title: "Data Display/Filter",
  component: Filter,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "A faceted filter builder inspired by Linear and corr.sh.",
          "",
          "Active filter rules render as removable **Badge** chips. An **Add filter**",
          "Popover + Command flow builds new rules in three steps: pick field →",
          "pick operator → enter value.",
          "",
          "Supports **controlled** (`value` + `onChange`) and **uncontrolled**",
          "(`defaultValue`) patterns. Use `maxFilters` to cap the number of",
          "simultaneous active rules.",
        ].join("\n"),
      },
    },
  },
  args: {
    fields: allFields,
  },
};

export default meta;
type Story = StoryObj<typeof Filter>;

// ---------------------------------------------------------------------------
// Playground (default, uncontrolled)
// ---------------------------------------------------------------------------

/**
 * Mixed field types: text, number, select, and date. All in uncontrolled mode
 * with a default rule pre-populated.
 */
export const Playground: Story = {
  args: {
    fields: allFields,
    defaultValue: [
      { id: "r1", field: "status", operator: "is", value: "active" },
      { id: "r2", field: "assignee", operator: "contains", value: "Alice" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Empty (no pre-populated rules)
// ---------------------------------------------------------------------------

export const Empty: Story = {
  args: {
    fields: allFields,
  },
};

// ---------------------------------------------------------------------------
// Controlled
// ---------------------------------------------------------------------------

/**
 * Controlled example: parent state drives `value`. A summary of active rules
 * is shown below the filter row.
 */
export const Controlled: Story = {
  render: (args) => {
    const [rules, setRules] = useState<FilterRule[]>([
      { id: "r1", field: "status", operator: "is_not", value: "archived" },
    ]);

    return (
      <div className="flex flex-col gap-4">
        <Filter {...args} onChange={setRules} value={rules} />
        <pre className="rounded-lg bg-muted p-3 text-xs">
          {JSON.stringify(rules, null, 2)}
        </pre>
      </div>
    );
  },
  args: {
    fields: allFields,
  },
};

// ---------------------------------------------------------------------------
// MaxFilters
// ---------------------------------------------------------------------------

/**
 * The "Add filter" trigger is hidden once two rules are active.
 */
export const MaxFilters: Story = {
  args: {
    fields: allFields,
    maxFilters: 2,
    defaultValue: [
      { id: "r1", field: "status", operator: "is", value: "active" },
      { id: "r2", field: "estimate", operator: "lte", value: "5" },
    ],
  },
};

// ---------------------------------------------------------------------------
// SelectOnly
// ---------------------------------------------------------------------------

/**
 * Only select-type fields — exercises the Command-list value editor path.
 */
export const SelectOnly: Story = {
  args: {
    fields: [statusField, priorityField],
    defaultValue: [
      { id: "r1", field: "priority", operator: "is", value: "high" },
    ],
  },
};

// ---------------------------------------------------------------------------
// WithDates
// ---------------------------------------------------------------------------

/**
 * Date field included. Values are stored as ISO `yyyy-MM-dd` and displayed
 * as locale dates in chips.
 */
export const WithDates: Story = {
  args: {
    fields: [dueDateField, assigneeField],
    defaultValue: [
      { id: "r1", field: "due_date", operator: "before", value: "2025-12-31" },
    ],
  },
};
