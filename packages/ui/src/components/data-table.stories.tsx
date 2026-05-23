import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "./badge";
import {
  createSelectColumn,
  DataTable,
  DataTableRowActions,
} from "./data-table";

/* ------------------------------------------------------------------ */
/* Mock data                                                           */
/* ------------------------------------------------------------------ */

type ProjectStatus = "Active" | "Paused" | "Completed" | "Archived";

type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  owner: string;
  budget: number;
  updatedAt: string;
};

const projects: Project[] = [
  {
    id: "proj-1",
    name: "Design System",
    status: "Active",
    owner: "Alice Martin",
    budget: 12000,
    updatedAt: "2025-05-01",
  },
  {
    id: "proj-2",
    name: "Marketing Site",
    status: "Completed",
    owner: "Bob Chen",
    budget: 8500,
    updatedAt: "2025-04-20",
  },
  {
    id: "proj-3",
    name: "Mobile App",
    status: "Active",
    owner: "Carol Singh",
    budget: 32000,
    updatedAt: "2025-05-15",
  },
  {
    id: "proj-4",
    name: "API Gateway",
    status: "Paused",
    owner: "Dave Lee",
    budget: 9000,
    updatedAt: "2025-03-10",
  },
  {
    id: "proj-5",
    name: "Analytics Dashboard",
    status: "Active",
    owner: "Eva Kim",
    budget: 15000,
    updatedAt: "2025-05-12",
  },
  {
    id: "proj-6",
    name: "Billing Integration",
    status: "Archived",
    owner: "Frank Brown",
    budget: 4500,
    updatedAt: "2025-01-05",
  },
  {
    id: "proj-7",
    name: "Auth Service",
    status: "Completed",
    owner: "Grace Wu",
    budget: 6000,
    updatedAt: "2025-02-28",
  },
];

const statusVariant: Record<
  ProjectStatus,
  "success-light" | "info-light" | "warning-light" | "secondary-light"
> = {
  Active: "success-light",
  Completed: "info-light",
  Paused: "warning-light",
  Archived: "secondary-light",
};

const projectColumns: ColumnDef<Project>[] = [
  createSelectColumn<Project>(),
  {
    accessorKey: "name",
    header: "Project",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<ProjectStatus>("status");
      return <Badge variant={statusVariant[status]}>{status}</Badge>;
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => `$${(row.getValue<number>("budget")).toLocaleString()}`,
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DataTableRowActions
        row={row.original}
        actions={[
          { label: "View details", onClick: () => {} },
          { label: "Edit", onClick: () => {} },
          { label: "Archive", onClick: () => {} },
        ]}
      />
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Meta                                                                */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof DataTable> = {
  title: "Data Display/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "Full-featured data table built on **TanStack Table** v8.",
          "Provides sorting, column filtering, column visibility toggle,",
          "row selection via checkboxes, and pagination — all out of the box.",
          "",
          "Props: `columns` (TanStack `ColumnDef[]`), `data`, `searchKey`,",
          "`searchPlaceholder`, `showColumnVisibility`, `showPagination`, `pageSize`.",
          "",
          "Helper exports: `createSelectColumn<TData>()` for checkbox selection,",
          "`DataTableRowActions` for per-row action menus.",
        ].join("\n"),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/** Full-featured table with search, column visibility, selection, and pagination. */
export const Playground: Story = {
  render: () => (
    <DataTable
      columns={projectColumns}
      data={projects}
      searchKey="name"
      searchPlaceholder="Filter projects…"
    />
  ),
};

/** Pagination disabled — all rows shown at once. */
export const WithoutPagination: Story = {
  render: () => (
    <DataTable
      columns={projectColumns}
      data={projects}
      showPagination={false}
      searchKey="name"
      searchPlaceholder="Filter projects…"
    />
  ),
};

/** Column visibility toggle hidden — cleaner toolbar. */
export const WithoutColumnVisibility: Story = {
  render: () => (
    <DataTable
      columns={projectColumns}
      data={projects}
      showColumnVisibility={false}
      searchKey="name"
    />
  ),
};

/** Small page size to showcase pagination controls. */
export const SmallPageSize: Story = {
  render: () => (
    <DataTable
      columns={projectColumns}
      data={projects}
      pageSize={3}
      searchKey="name"
      searchPlaceholder="Filter projects…"
    />
  ),
};

/** Empty state — `DataTable` renders a "No results." cell. */
export const EmptyState: Story = {
  render: () => (
    <DataTable
      columns={projectColumns}
      data={[]}
      searchKey="name"
      searchPlaceholder="Filter projects…"
    />
  ),
};
