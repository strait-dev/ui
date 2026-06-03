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

type Project = {
  id: string;
  name: string;
  status: "Active" | "Paused" | "Completed";
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
];

const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: () => <DataGridTableRowSelectAll />,
    cell: ({ row }) => <DataGridTableRowSelect row={row} />,
    enableSorting: false,
    enableHiding: false,
    size: 40,
    meta: { cellClassName: "text-center", enableColumnOrdering: false },
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
      const v = info.getValue() as string;
      return (
        <Badge variant={v === "Active" ? "secondary" : "outline"}>{v}</Badge>
      );
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

export default function DataGridDemo() {
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
