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

type LogEntry = {
  id: string;
  timestamp: string;
  level: string;
  message: string;
};

const data: LogEntry[] = [
  {
    id: "1",
    timestamp: "2025-06-02 10:42:01",
    level: "INFO",
    message: "Server started on port 3000",
  },
  {
    id: "2",
    timestamp: "2025-06-02 10:42:03",
    level: "INFO",
    message: "Database connection established",
  },
  {
    id: "3",
    timestamp: "2025-06-02 10:42:15",
    level: "WARN",
    message: "Rate limit threshold at 80%",
  },
  {
    id: "4",
    timestamp: "2025-06-02 10:43:02",
    level: "ERROR",
    message: "Failed to reach upstream service",
  },
  {
    id: "5",
    timestamp: "2025-06-02 10:43:10",
    level: "INFO",
    message: "Retry succeeded",
  },
  {
    id: "6",
    timestamp: "2025-06-02 10:44:00",
    level: "INFO",
    message: "Health check passed",
  },
];

const columns: ColumnDef<LogEntry>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <DataGridColumnHeader column={column} title="Time" />
    ),
    cell: (info) => (
      <span className="font-mono text-xs">{String(info.getValue())}</span>
    ),
    meta: { headerTitle: "Time" },
  },
  {
    accessorKey: "level",
    header: ({ column }) => (
      <DataGridColumnHeader column={column} title="Level" />
    ),
    cell: (info) => {
      const level = String(info.getValue());
      const levelColors: Record<string, string> = {
        ERROR: "text-destructive",
        WARN: "text-warning",
      };
      const color = levelColors[level] ?? "text-muted-foreground";
      return (
        <span className={`font-medium font-mono text-xs ${color}`}>
          {level}
        </span>
      );
    },
    meta: { headerTitle: "Level" },
    size: 80,
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataGridColumnHeader column={column} title="Message" />
    ),
    meta: { headerTitle: "Message" },
  },
];

export default function DataGridDense() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DataGrid
      recordCount={data.length}
      table={table}
      tableLayout={{ dense: true }}
    >
      <DataGridContainer>
        <DataGridTable />
      </DataGridContainer>
    </DataGrid>
  );
}
