import {
  Archive02Icon,
  ArrowDown01Icon,
  Delete02Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnOrderState,
  type ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowPinningState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  DataGrid,
  DataGridColumnFilter,
  DataGridColumnHeader,
  DataGridColumnVisibility,
  DataGridContainer,
  DataGridPagination,
  DataGridSelectionBar,
  DataGridTable,
  DataGridTableDnd,
  DataGridTableDndRowHandle,
  DataGridTableDndRows,
  DataGridTableFootRow,
  DataGridTableFootRowCell,
  DataGridTableRowActions,
  DataGridTableRowPin,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
  DataGridTableVirtual,
} from "./data-grid";
import { DropdownMenuItem, DropdownMenuSeparator } from "./dropdown-menu";

/* ------------------------------------------------------------------ */
/* Mock data                                                          */
/* ------------------------------------------------------------------ */

type ProjectStatus = "Active" | "Paused" | "Completed" | "Archived";

type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  owner: string;
  budget: number;
  updatedAt: string;
  notes?: string;
};

const baseProjects: Project[] = [
  {
    id: "proj-1",
    name: "Design System",
    status: "Active",
    owner: "Alice Martin",
    budget: 12_000,
    updatedAt: "2025-05-01",
    notes: "Refining tokens and motion primitives.",
  },
  {
    id: "proj-2",
    name: "Marketing Site",
    status: "Completed",
    owner: "Bob Chen",
    budget: 8500,
    updatedAt: "2025-04-20",
    notes: "Shipped to production last quarter.",
  },
  {
    id: "proj-3",
    name: "Mobile App",
    status: "Active",
    owner: "Carol Singh",
    budget: 32_000,
    updatedAt: "2025-05-15",
    notes: "iOS first; Android in alpha.",
  },
  {
    id: "proj-4",
    name: "Analytics Pipeline",
    status: "Paused",
    owner: "Daniel Rivera",
    budget: 18_000,
    updatedAt: "2025-03-12",
    notes: "Waiting on data-platform v3.",
  },
  {
    id: "proj-5",
    name: "Onboarding Revamp",
    status: "Active",
    owner: "Eva Solis",
    budget: 6500,
    updatedAt: "2025-05-20",
    notes: "New welcome modal in A/B test.",
  },
  {
    id: "proj-6",
    name: "Internal CRM",
    status: "Archived",
    owner: "Frank Patel",
    budget: 4200,
    updatedAt: "2025-01-08",
    notes: "Replaced by 3rd-party tool.",
  },
  {
    id: "proj-7",
    name: "Search Service",
    status: "Active",
    owner: "Gina Wang",
    budget: 24_000,
    updatedAt: "2025-05-18",
    notes: "Indexing latency cut by 40%.",
  },
  {
    id: "proj-8",
    name: "Billing Migration",
    status: "Completed",
    owner: "Henry Ito",
    budget: 16_000,
    updatedAt: "2025-04-05",
    notes: "Stripe Tax fully integrated.",
  },
];

const statusVariant: Record<ProjectStatus, "outline" | "secondary"> = {
  Active: "secondary",
  Completed: "outline",
  Paused: "outline",
  Archived: "outline",
};

const baseColumns: ColumnDef<Project>[] = [
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
      const value = info.getValue() as ProjectStatus;
      return <Badge variant={statusVariant[value]}>{value}</Badge>;
    },
    filterFn: (row, columnId, filterValue: string[]) =>
      filterValue.length === 0 || filterValue.includes(row.getValue(columnId)),
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
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataGridColumnHeader column={column} title="Updated" />
    ),
    meta: { headerTitle: "Updated" },
  },
];

/**
 * Leading "select" column. Pinned to the start; opts out of sorting/hiding
 * and shrinks to a 40px box that matches the checkbox + indicator stripe.
 */
const selectColumn: ColumnDef<Project> = {
  id: "select",
  header: () => <DataGridTableRowSelectAll />,
  cell: ({ row }) => <DataGridTableRowSelect row={row} />,
  enableSorting: false,
  enableHiding: false,
  size: 40,
};

/**
 * Trailing "actions" column. Hosts the per-row ⋯ menu with demo handlers
 * that no-op in stories (real apps wire them to mutations).
 */
const actionsColumn: ColumnDef<Project> = {
  id: "actions",
  header: () => null,
  cell: ({ row }) => (
    <DataGridTableRowActions row={row}>
      <DropdownMenuItem>
        <HugeiconsIcon icon={Edit02Icon} />
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem>
        <HugeiconsIcon icon={Archive02Icon} />
        Archive
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <HugeiconsIcon icon={Delete02Icon} />
        Delete
      </DropdownMenuItem>
    </DataGridTableRowActions>
  ),
  enableSorting: false,
  enableHiding: false,
  size: 40,
};

/**
 * Default column composition used by every general-purpose story:
 * `[select, …project fields, actions]`. Feature-specific stories (DnD,
 * pinning, expansion) compose their own columns from `baseColumns`.
 */
const defaultColumns: ColumnDef<Project>[] = [
  selectColumn,
  ...baseColumns,
  actionsColumn,
];

/** Demo bulk actions wired into the default selection bar. */
const defaultBulkActions = [
  { label: "Archive", icon: Archive02Icon, onClick: () => {} },
  {
    label: "Delete",
    icon: Delete02Icon,
    variant: "destructive" as const,
    onClick: () => {},
  },
];

/* ------------------------------------------------------------------ */
/* Storybook meta                                                     */
/* ------------------------------------------------------------------ */

const meta: Meta<typeof DataGrid> = {
  title: "Data Display/DataGrid",
  component: DataGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "`DataGrid` is a TanStack Table-powered grid with sorting, filtering, column visibility, pagination, row selection, expansion, pinning, column/row drag-and-drop, and virtual + infinite scroll. Compose `DataGrid` with `DataGridContainer`, `DataGridTable`, and the auxiliary parts to assemble the layout you need.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DataGrid>;

/* ------------------------------------------------------------------ */
/* Stories                                                            */
/* ------------------------------------------------------------------ */

/** Default grid: sortable headers, pagination, no extra layout flags. */
export const Playground: Story = {
  render: () => {
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize: 5 } },
    });
    return (
      <DataGrid recordCount={baseProjects.length} table={table}>
        <DataGridContainer>
          <DataGridTable />
          <DataGridPagination />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Vertical cell borders between columns. */
export const CellBorder: Story = {
  render: () => {
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid
        recordCount={baseProjects.length}
        table={table}
        tableLayout={{ cellBorder: true }}
      >
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Tighter row height and padding for dense layouts. */
export const Dense: Story = {
  render: () => {
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid
        recordCount={baseProjects.length}
        table={table}
        tableLayout={{ dense: true }}
      >
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Striped (zebra) rows. */
export const Striped: Story = {
  render: () => {
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid
        recordCount={baseProjects.length}
        table={table}
        tableLayout={{ stripped: true, rowBorder: false }}
      >
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Columns size themselves to their content (no fixed layout). */
export const AutoWidth: Story = {
  render: () => {
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid
        recordCount={baseProjects.length}
        table={table}
        tableLayout={{ width: "auto" }}
      >
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Checkbox column + a per-row select indicator with a select-all header. */
export const RowSelection: Story = {
  render: () => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const columns = useMemo<ColumnDef<Project>[]>(
      () => [
        {
          id: "select",
          header: () => <DataGridTableRowSelectAll />,
          cell: ({ row }) => <DataGridTableRowSelect row={row} />,
          enableSorting: false,
          enableHiding: false,
          size: 40,
        },
        ...baseColumns,
      ],
      []
    );
    const table = useReactTable({
      data: baseProjects,
      columns,
      state: { rowSelection },
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid recordCount={baseProjects.length} table={table}>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
      </DataGrid>
    );
  },
};

/** Rows can expand to reveal extra content via `meta.expandedContent`. */
export const ExpandableRows: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const columns = useMemo<ColumnDef<Project>[]>(
      () => [
        {
          id: "expander",
          header: () => null,
          cell: ({ row }) => (
            <Button
              aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
              onClick={() => row.toggleExpanded()}
              size="icon-sm"
              variant="ghost"
            >
              <HugeiconsIcon
                className={row.getIsExpanded() ? "rotate-180" : ""}
                icon={ArrowDown01Icon}
              />
            </Button>
          ),
          enableSorting: false,
          enableHiding: false,
          meta: {
            expandedContent: (row: Project) => (
              <div className="px-4 py-3 text-muted-foreground text-sm">
                {row.notes ?? "No notes."}
              </div>
            ),
            headerTitle: "",
          },
          size: 40,
        },
        ...baseColumns,
        actionsColumn,
      ],
      []
    );
    const table = useReactTable({
      data: baseProjects,
      columns,
      state: { expanded },
      onExpandedChange: setExpanded,
      enableRowSelection: true,
      getRowCanExpand: () => true,
      getCoreRowModel: getCoreRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
    });
    return (
      <DataGrid recordCount={baseProjects.length} table={table}>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Click a header to cycle through asc → desc → cleared sort. */
export const Sorting: Story = {
  render: () => {
    const [sorting, setSorting] = useState<SortingState>([
      { id: "budget", desc: true },
    ]);
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      state: { sorting },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });
    return (
      <DataGrid recordCount={baseProjects.length} table={table}>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Use the column-header menu to move columns left/right. */
export const ColumnMove: Story = {
  render: () => {
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([
      "name",
      "status",
      "owner",
      "budget",
      "updatedAt",
    ]);
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      state: { columnOrder },
      onColumnOrderChange: setColumnOrder,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid
        recordCount={baseProjects.length}
        table={table}
        tableLayout={{ columnsMovable: true }}
      >
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Drag column headers horizontally to reorder. */
export const ColumnDragging: Story = {
  render: () => {
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([
      "name",
      "status",
      "owner",
      "budget",
      "updatedAt",
    ]);
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      state: { columnOrder },
      onColumnOrderChange: setColumnOrder,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid
        recordCount={baseProjects.length}
        table={table}
        tableLayout={{ columnsDraggable: true }}
      >
        <DataGridContainer>
          <DataGridTableDnd
            handleDragEnd={(event) => {
              const { active, over } = event;
              if (!over || active.id === over.id) {
                return;
              }
              setColumnOrder((order) => {
                const from = order.indexOf(String(active.id));
                const to = order.indexOf(String(over.id));
                const next = [...order];
                const [moved] = next.splice(from, 1);
                if (moved !== undefined) {
                  next.splice(to, 0, moved);
                }
                return next;
              });
            }}
          />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Drag the resize handles between headers to resize columns. */
export const ColumnResizing: Story = {
  render: () => {
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      columnResizeMode: "onChange",
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid
        recordCount={baseProjects.length}
        table={table}
        tableLayout={{ columnsResizable: true }}
      >
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Pin a column to the left or right via the header menu. */
export const ColumnPinning: Story = {
  render: () => {
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      initialState: { columnPinning: { left: ["name"] } },
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid
        recordCount={baseProjects.length}
        table={table}
        tableLayout={{ columnsPinnable: true }}
      >
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Toggle column visibility via a standalone dropdown. */
export const ColumnVisibility: Story = {
  render: () => {
    const [visibility, setVisibility] = useState<VisibilityState>({});
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      state: { columnVisibility: visibility },
      onColumnVisibilityChange: setVisibility,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid recordCount={baseProjects.length} table={table}>
        <div className="flex justify-end pb-2">
          <DataGridColumnVisibility
            table={table}
            trigger={
              <Button size="sm" variant="outline">
                Columns
                <HugeiconsIcon className="ms-2 size-4" icon={ArrowDown01Icon} />
              </Button>
            }
          />
        </div>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Sticky header keeps column labels visible while scrolling the body. */
export const StickyHeader: Story = {
  render: () => {
    const data = useMemo(
      () =>
        Array.from({ length: 40 }, (_, i) => ({
          ...baseProjects[i % baseProjects.length]!,
          id: `row-${i}`,
        })),
      []
    );
    const table = useReactTable({
      data,
      columns: defaultColumns,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid
        recordCount={data.length}
        table={table}
        tableLayout={{ headerSticky: true }}
      >
        <DataGridContainer>
          <div className="max-h-80 overflow-auto">
            <DataGridTable />
          </div>
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Faceted column filter rendered inside the header's filter slot. */
export const ColumnFilter: Story = {
  render: () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const columns = useMemo<ColumnDef<Project>[]>(() => {
      const next: ColumnDef<Project>[] = [...defaultColumns];
      next[2] = {
        accessorKey: "status",
        meta: { headerTitle: "Status" },
        cell: (info) => {
          const value = info.getValue() as ProjectStatus;
          return <Badge variant={statusVariant[value]}>{value}</Badge>;
        },
        filterFn: (row, columnId, filterValue: string[]) =>
          filterValue.length === 0 ||
          filterValue.includes(row.getValue(columnId)),
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            filter={
              <DataGridColumnFilter
                column={column}
                options={[
                  { label: "Active", value: "Active" },
                  { label: "Paused", value: "Paused" },
                  { label: "Completed", value: "Completed" },
                  { label: "Archived", value: "Archived" },
                ]}
                title="Status"
              />
            }
            title="Status"
          />
        ),
      };
      return next;
    }, []);
    const table = useReactTable({
      data: baseProjects,
      columns,
      state: { columnFilters },
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
    });
    return (
      <DataGrid recordCount={baseProjects.length} table={table}>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Standalone `DataGridPagination` rendered outside the {@link DataGridContainer}. */
export const Pagination: Story = {
  render: () => {
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      state: { pagination },
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });
    return (
      <DataGrid recordCount={baseProjects.length} table={table}>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridPagination sizes={[5, 10, 25]} />
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Render a footer with computed totals. */
export const FooterTotals: Story = {
  render: () => {
    const total = baseProjects.reduce((sum, p) => sum + p.budget, 0);
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid recordCount={baseProjects.length} table={table}>
        <DataGridContainer>
          <DataGridTable
            footerContent={
              <DataGridTableFootRow>
                <DataGridTableFootRowCell colSpan={3}>
                  Total budget
                </DataGridTableFootRowCell>
                <DataGridTableFootRowCell colSpan={2}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(total)}
                </DataGridTableFootRowCell>
              </DataGridTableFootRow>
            }
          />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Pin a row to the top of the grid via a per-row pin button. */
export const RowPinning: Story = {
  render: () => {
    const columns = useMemo<ColumnDef<Project>[]>(
      () => [
        {
          id: "pin",
          header: () => null,
          cell: ({ row }) => <DataGridTableRowPin row={row} />,
          enableSorting: false,
          enableHiding: false,
          size: 40,
        },
        ...baseColumns,
        actionsColumn,
      ],
      []
    );
    const [rowPinning, setRowPinning] = useState<RowPinningState>({
      top: [],
      bottom: [],
    });
    const table = useReactTable({
      data: baseProjects,
      columns,
      state: { rowPinning },
      onRowPinningChange: setRowPinning,
      enableRowPinning: true,
      enableRowSelection: true,
      keepPinnedRows: true,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid
        recordCount={baseProjects.length}
        table={table}
        tableLayout={{ rowsPinnable: true }}
      >
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Drag rows vertically to reorder them. */
export const RowDragging: Story = {
  render: () => {
    const [data, setData] = useState(baseProjects);
    const columns = useMemo<ColumnDef<Project>[]>(
      () => [
        {
          id: "drag",
          header: () => null,
          cell: () => <DataGridTableDndRowHandle />,
          enableSorting: false,
          enableHiding: false,
          size: 40,
        },
        ...baseColumns,
        actionsColumn,
      ],
      []
    );
    const table = useReactTable({
      data,
      columns,
      enableRowSelection: true,
      getRowId: (row) => row.id,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid
        recordCount={data.length}
        table={table}
        tableLayout={{ rowsDraggable: true }}
      >
        <DataGridContainer>
          <DataGridTableDndRows
            dataIds={data.map((d) => d.id)}
            handleDragEnd={(event) => {
              const { active, over } = event;
              if (!over || active.id === over.id) {
                return;
              }
              setData((rows) => {
                const from = rows.findIndex((r) => r.id === active.id);
                const to = rows.findIndex((r) => r.id === over.id);
                const next = [...rows];
                const [moved] = next.splice(from, 1);
                if (moved !== undefined) {
                  next.splice(to, 0, moved);
                }
                return next;
              });
            }}
          />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Skeleton rows while data is loading. */
export const LoadingSkeleton: Story = {
  render: () => {
    const table = useReactTable({
      data: [],
      columns: defaultColumns,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
      initialState: { pagination: { pageSize: 6, pageIndex: 0 } },
    });
    return (
      <DataGrid isLoading loadingMode="skeleton" recordCount={0} table={table}>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** The card container wraps the grid in a bordered rounded box. */
export const CardContainer: Story = {
  render: () => {
    const table = useReactTable({
      data: baseProjects,
      columns: defaultColumns,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid recordCount={baseProjects.length} table={table}>
        <DataGridContainer>
          <div className="flex items-center justify-between border-border border-b px-4 py-3">
            <h3 className="font-medium">Projects</h3>
            <Button size="sm" variant="outline">
              Add project
            </Button>
          </div>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/** Virtual scrolling for large datasets. */
export const VirtualScroll: Story = {
  render: () => {
    const data = useMemo(
      () =>
        Array.from({ length: 1000 }, (_, i) => ({
          ...baseProjects[i % baseProjects.length]!,
          id: `row-${i}`,
        })),
      []
    );
    const table = useReactTable({
      data,
      columns: defaultColumns,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid recordCount={data.length} table={table}>
        <DataGridContainer>
          <DataGridTableVirtual estimateSize={44} height={400} />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};

/**
 * Per-row actions column powered by `DataGridTableRowActions`. The trailing
 * column hosts an ellipsis trigger that opens a dropdown with consumer-defined
 * Edit / Delete items.
 */
export const RowActions: Story = {
  render: () => {
    const [items, setItems] = useState(baseProjects);
    const columns = useMemo<ColumnDef<Project>[]>(
      () => [
        ...baseColumns,
        {
          id: "actions",
          header: () => null,
          cell: ({ row }) => (
            <DataGridTableRowActions row={row}>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Edit02Icon} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon icon={Archive02Icon} />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  setItems((prev) =>
                    prev.filter((p) => p.id !== row.original.id)
                  )
                }
                variant="destructive"
              >
                <HugeiconsIcon icon={Delete02Icon} />
                Delete
              </DropdownMenuItem>
            </DataGridTableRowActions>
          ),
          meta: { cellClassName: "w-10 text-end" },
        },
      ],
      []
    );
    const table = useReactTable({
      data: items,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid recordCount={items.length} table={table}>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
      </DataGrid>
    );
  },
};

/**
 * Floating bulk-action bar driven by row selection. `DataGridSelectionBar`
 * reads the selection from DataGrid context and renders a fixed-position
 * toolbar whenever one or more rows are selected.
 */
export const SelectionBar: Story = {
  render: () => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [items, setItems] = useState(baseProjects);
    const columns = useMemo<ColumnDef<Project>[]>(
      () => [
        {
          id: "select",
          header: () => <DataGridTableRowSelectAll />,
          cell: ({ row }) => <DataGridTableRowSelect row={row} />,
          enableSorting: false,
          enableHiding: false,
          size: 40,
        },
        ...baseColumns,
      ],
      []
    );
    const table = useReactTable({
      data: items,
      columns,
      state: { rowSelection },
      onRowSelectionChange: setRowSelection,
      enableRowSelection: true,
      getRowId: (row) => row.id,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid recordCount={items.length} table={table}>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar
          actions={[
            {
              label: "Archive",
              icon: Archive02Icon,
              onClick: () => table.resetRowSelection(),
            },
            {
              label: "Delete",
              icon: Delete02Icon,
              variant: "destructive",
              onClick: () => {
                const ids = new Set(Object.keys(rowSelection));
                setItems((prev) => prev.filter((p) => !ids.has(p.id)));
                table.resetRowSelection();
              },
            },
          ]}
        />
      </DataGrid>
    );
  },
};

/** Simulated remote pagination via `onFetchMore`. */
export const InfiniteScroll: Story = {
  render: () => {
    const [items, setItems] = useState(() =>
      Array.from({ length: 50 }, (_, i) => ({
        ...baseProjects[i % baseProjects.length]!,
        id: `row-${i}`,
      }))
    );
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const table = useReactTable({
      data: items,
      columns: defaultColumns,
      enableRowSelection: true,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid recordCount={items.length} table={table}>
        <DataGridContainer>
          <DataGridTableVirtual
            estimateSize={44}
            fetchMoreOffset={5}
            hasMore={hasMore}
            height={400}
            isFetchingMore={isFetching}
            onFetchMore={() => {
              if (isFetching || !hasMore) {
                return;
              }
              setIsFetching(true);
              window.setTimeout(() => {
                setItems((prev) => {
                  const next = [
                    ...prev,
                    ...Array.from({ length: 25 }, (_, i) => ({
                      ...baseProjects[i % baseProjects.length]!,
                      id: `row-${prev.length + i}`,
                    })),
                  ];
                  if (next.length >= 150) {
                    setHasMore(false);
                  }
                  return next;
                });
                setIsFetching(false);
              }, 400);
            }}
          />
        </DataGridContainer>
        <DataGridSelectionBar actions={defaultBulkActions} />
      </DataGrid>
    );
  },
};
