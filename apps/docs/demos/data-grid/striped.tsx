"use client";

import {
  DataGrid,
  DataGridColumnHeader,
  DataGridContainer,
  DataGridTable,
} from "@strait/ui/components/data-grid";
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
};

const data: Employee[] = [
  {
    id: "1",
    name: "Alice Martin",
    role: "Senior Engineer",
    department: "Platform",
  },
  { id: "2", name: "Bob Chen", role: "Product Designer", department: "Design" },
  {
    id: "3",
    name: "Carol Singh",
    role: "Engineering Manager",
    department: "Mobile",
  },
  {
    id: "4",
    name: "Daniel Rivera",
    role: "Data Engineer",
    department: "Analytics",
  },
  { id: "5", name: "Eva Solis", role: "Growth Lead", department: "Marketing" },
];

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataGridColumnHeader column={column} title="Name" />
    ),
    cell: (info) => (
      <span className="font-medium">{String(info.getValue())}</span>
    ),
    meta: { headerTitle: "Name" },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataGridColumnHeader column={column} title="Role" />
    ),
    meta: { headerTitle: "Role" },
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataGridColumnHeader column={column} title="Department" />
    ),
    meta: { headerTitle: "Department" },
  },
];

export default function DataGridStriped() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataGrid
      recordCount={data.length}
      table={table}
      tableLayout={{ stripped: true, rowBorder: false }}
    >
      <DataGridContainer>
        <DataGridTable />
      </DataGridContainer>
    </DataGrid>
  );
}
