"use client";

import { CircleIcon, Flag01Icon } from "@hugeicons/core-free-icons";
import {
  type Filter,
  type FilterFieldConfig,
  Filters,
} from "@strait/ui/components/filters";
import { useState } from "react";

const fields: FilterFieldConfig[] = [
  {
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
  },
  {
    key: "priority",
    label: "Priority",
    type: "select",
    icon: Flag01Icon,
    options: [
      { value: "urgent", label: "Urgent" },
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
  },
];

export default function FiltersMultiselect() {
  const [filters, setFilters] = useState<Filter[]>([
    {
      id: "r1",
      field: "labels",
      operator: "is_any_of",
      values: ["bug", "feature"],
    },
  ]);

  return <Filters fields={fields} filters={filters} onChange={setFilters} />;
}
