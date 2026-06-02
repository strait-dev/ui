"use client";

import { Flag01Icon, Tag01Icon, UserIcon } from "@hugeicons/core-free-icons";
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
      { value: "pending", label: "Pending" },
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
  {
    key: "assignee",
    label: "Assignee",
    type: "text",
    icon: UserIcon,
    placeholder: "Name…",
  },
];

export default function FiltersBasic() {
  const [filters, setFilters] = useState<Filter[]>([
    { id: "r1", field: "status", operator: "is", values: ["active"] },
  ]);

  return <Filters fields={fields} filters={filters} onChange={setFilters} />;
}
