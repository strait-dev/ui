"use client";

import {
  ArrowDown01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { useState } from "react";
import { cn } from "../utils/index";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Input } from "./input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

/**
 * Props for {@link DataTable}.
 *
 * @typeParam TData - The shape of a single row record.
 * @typeParam TValue - The inferred cell value type used by TanStack Table.
 */
export type DataTableProps<TData, TValue> = {
  /** TanStack Table column definitions for the table. */
  columns: ColumnDef<TData, TValue>[];
  /** Array of row records to display. */
  data: TData[];
  /**
   * Column `id` to use for the global search input. When omitted the
   * search bar is hidden.
   */
  searchKey?: string;
  /** Placeholder text shown inside the search input. */
  searchPlaceholder?: string;
  /** Whether to render the column-visibility dropdown. */
  showColumnVisibility?: boolean;
  /** Whether to render the Previous / Next pagination controls. */
  showPagination?: boolean;
  /** Number of rows per page when pagination is enabled. */
  pageSize?: number;
  /** Additional class names merged onto the outermost table wrapper div. */
  className?: string;
};

/**
 * A fully-featured data table built on TanStack Table v8.
 *
 * Wraps `useReactTable` with client-side sorting, filtering, column
 * visibility, row selection, and optional pagination. All table state is
 * managed internally; for external control pass your own `ColumnDef` array
 * and `data` and handle side effects in column definitions.
 *
 * @remarks
 * - Pass `searchKey` to show a text input that filters the named column.
 * - Set `showColumnVisibility={false}` to remove the Columns dropdown.
 * - Set `showPagination={false}` to display all rows at once (no page model
 *   is registered, which avoids unnecessary row slicing).
 * - Use {@link createSelectColumn} to prepend a checkbox column for bulk
 *   row selection; pair it with {@link DataTableRowActions} in each row.
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<Payment>[] = [
 *   createSelectColumn(),
 *   { accessorKey: "amount", header: "Amount" },
 * ];
 *
 * <DataTable
 *   columns={columns}
 *   data={payments}
 *   searchKey="amount"
 *   pageSize={20}
 * />
 * ```
 */
export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  showColumnVisibility = true,
  showPagination = true,
  pageSize = 10,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // Only register the pagination model when the prop is enabled to avoid
    // slicing rows unnecessarily when all rows should be visible.
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className={cn("w-full", className)} data-slot="data-table">
      <div className="flex items-center py-4">
        {searchKey ? (
          <Input
            className="max-w-sm"
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
          />
        ) : null}
        {showColumnVisibility ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button className="ml-auto" variant="outline" />}
            >
              Columns{" "}
              <HugeiconsIcon className="ml-2 size-4" icon={ArrowDown01Icon} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    checked={column.getIsVisible()}
                    className="capitalize"
                    key={column.id}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination ? (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              size="sm"
              variant="outline"
            >
              Previous
            </Button>
            <Button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              size="sm"
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Note: DataTableColumnHeader is removed as it needs Column instance, not ColumnDef
// Use column.header directly or create header functions inline

/** Props for {@link DataTableRowActions}. */
export type DataTableRowActionsProps<TData> = {
  /** The typed row record passed to each action's `onClick` callback. */
  row: TData;
  /** List of menu items to render in the row-actions dropdown. */
  actions?: {
    label: string;
    onClick: (row: TData) => void;
    icon?: React.ReactNode;
  }[];
};

/**
 * A three-dot overflow menu rendered inside a {@link DataTable} row.
 *
 * Renders a ghost icon button that opens a dropdown listing the provided
 * `actions`. Intended to be used as a cell renderer in a TanStack Table
 * column definition alongside {@link DataTable}.
 *
 * @example
 * ```tsx
 * {
 *   id: "actions",
 *   cell: ({ row }) => (
 *     <DataTableRowActions
 *       row={row.original}
 *       actions={[
 *         { label: "Edit", onClick: (r) => openEditor(r) },
 *         { label: "Delete", onClick: (r) => deleteRow(r) },
 *       ]}
 *     />
 *   ),
 * }
 * ```
 */
export function DataTableRowActions<TData>({
  row,
  actions = [],
}: DataTableRowActionsProps<TData>) {
  return (
    <div data-slot="data-table-row-actions">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button className="h-8 w-8 p-0" variant="ghost" />}
        >
          <span className="sr-only">Open menu</span>
          <HugeiconsIcon className="size-4" icon={MoreHorizontalIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuGroup>
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.label}
              onClick={() => action.onClick(row)}
            >
              {action.icon ? <span className="mr-2">{action.icon}</span> : null}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/**
 * Factory that returns a TanStack Table `ColumnDef` for bulk row selection.
 *
 * The header cell renders a "select all on page" checkbox; each row cell
 * renders an individual row checkbox. Sorting and hiding are disabled so
 * the column always appears first and cannot be toggled off via the Columns
 * dropdown in {@link DataTable}.
 *
 * @example
 * ```tsx
 * const columns = [createSelectColumn<Payment>(), ...otherCols];
 * ```
 */
export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}
