"use client";

import { Badge } from "@strait/ui/components/badge";
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridContainer,
  DataGridPagination,
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@strait/ui/components/data-grid";
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Status = "Active" | "Paused" | "Completed" | "Archived";

type Project = {
  id: string;
  name: string;
  status: Status;
  owner: string;
  budget: number;
};

const data: Project[] = [
  {
    id: "1",
    name: "Design System",
    status: "Active",
    owner: "Alice Martin",
    budget: 12_000,
  },
  {
    id: "2",
    name: "Marketing Site",
    status: "Completed",
    owner: "Bob Chen",
    budget: 8500,
  },
  {
    id: "3",
    name: "Mobile App",
    status: "Active",
    owner: "Carol Singh",
    budget: 32_000,
  },
  {
    id: "4",
    name: "Analytics Pipeline",
    status: "Paused",
    owner: "Daniel Rivera",
    budget: 18_000,
  },
  {
    id: "5",
    name: "Onboarding Revamp",
    status: "Active",
    owner: "Eva Solis",
    budget: 6500,
  },
  {
    id: "6",
    name: "Internal CRM",
    status: "Archived",
    owner: "Frank Patel",
    budget: 4200,
  },
];

const variantMap: Record<Status, "outline" | "secondary"> = {
  Active: "secondary",
  Completed: "outline",
  Paused: "outline",
  Archived: "outline",
};

const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: () => <DataGridTableRowSelectAll />,
    cell: ({ row }) => <DataGridTableRowSelect row={row} />,
    enableSorting: false,
    enableHiding: false,
    meta: { cellClassName: "text-center", enableColumnOrdering: false },
    size: 40,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataGridColumnHeader column={column} title="Project" />
    ),
    cell: (info) => (
      <span className="font-medium">{String(info.getValue())}</span>
    ),
    meta: { headerTitle: "Project" },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataGridColumnHeader column={column} title="Status" />
    ),
    cell: (info) => {
      const value = info.getValue() as Status;
      return <Badge variant={variantMap[value]}>{value}</Badge>;
    },
    meta: { headerTitle: "Status" },
  },
  {
    accessorKey: "owner",
    header: ({ column }) => (
      <DataGridColumnHeader column={column} title="Owner" />
    ),
    meta: { headerTitle: "Owner" },
  },
  {
    accessorKey: "budget",
    header: ({ column }) => (
      <DataGridColumnHeader column={column} title="Budget" />
    ),
    cell: (info) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(info.getValue() as number),
    meta: { headerTitle: "Budget" },
  },
];

export default function DataGridBasic() {
  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <DataGrid recordCount={data.length} table={table}>
      <DataGridContainer>
        <DataGridTable />
        <DataGridPagination />
      </DataGridContainer>
    </DataGrid>
  );
}
