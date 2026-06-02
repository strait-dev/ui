"use client";

import {
  CircleIcon,
  Flag01Icon,
  Tag01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import {
  type Filter,
  type FilterFieldConfig,
  Filters,
} from "@strait/ui/components/filters";
import { useState } from "react";

const fields: FilterFieldConfig[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    icon: Tag01Icon,
    options: [
      { value: "active", label: "Active" },
      { value: "archived", label: "Archived" },
      { value: "draft", label: "Draft" },
    ],
  },
  {
    key: "labels",
    label: "Labels",
    type: "multiselect",
    icon: CircleIcon,
    options: [
      { value: "bug", label: "Bug" },
      { value: "feature", label: "Feature" },
      { value: "docs", label: "Docs" },
    ],
  },
  {
    key: "priority",
    label: "Priority",
    type: "select",
    icon: Flag01Icon,
    options: [
      { value: "urgent", label: "Urgent" },
      { value: "high", label: "High" },
      { value: "low", label: "Low" },
    ],
  },
  {
    key: "assignee",
    label: "Assignee",
    type: "text",
    icon: UserIcon,
    placeholder: "Name…",
  },
];

export default function FiltersEmpty() {
  const [filters, setFilters] = useState<Filter[]>([]);

  return <Filters fields={fields} filters={filters} onChange={setFilters} />;
}
