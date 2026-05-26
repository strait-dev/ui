"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  type Modifier,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AddCircleIcon,
  ArrowDataTransferVerticalIcon,
  ArrowDown02Icon,
  ArrowLeft02Icon,
  ArrowLeft03Icon,
  ArrowRight02Icon,
  ArrowRight03Icon,
  ArrowUp02Icon,
  DragDropHorizontalIcon,
  DragDropVerticalIcon,
  MoreHorizontalIcon,
  PinIcon,
  PinOffIcon,
  SlidersHorizontalIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  type Cell,
  type Column,
  type ColumnFiltersState,
  flexRender,
  type Header,
  type HeaderGroup,
  type Row,
  type RowData,
  type SortingState,
  type Table,
} from "@tanstack/react-table";
import {
  useVirtualizer,
  type VirtualItem,
  type VirtualizerOptions,
} from "@tanstack/react-virtual";
import { cva } from "class-variance-authority";
import * as React from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/index";
import { Badge } from "./badge";
import { type BulkAction, BulkActionBar } from "./bulk-action-bar";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";

// ---------------------------------------------------------------------------
// TanStack column-meta augmentation
// ---------------------------------------------------------------------------

declare module "@tanstack/react-table" {
  // TValue is required for declaration merging with TanStack's ColumnMeta —
  // none of our extension members reference it.
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Extra class names merged onto body `<td>` elements. */
    cellClassName?: string;
    /**
     * When `false`, hides the column-reorder drag handle inside
     * {@link DataGridTableDnd} and the "Move left / right" menu items inside
     * {@link DataGridColumnHeader}. Use for anchored columns (selection,
     * row actions) that should never leave their slot.
     */
    enableColumnOrdering?: boolean;
    /** Renders an expanded row beneath this row when the row is expanded. */
    expandedContent?: (row: TData) => React.ReactNode;
    /** Extra class names merged onto the header `<th>` element. */
    headerClassName?: string;
    /** Override the display label shown in headers and column-visibility menus. */
    headerTitle?: string;
    /** Skeleton node rendered inside skeleton cells during loading. */
    skeleton?: React.ReactNode;
  }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Resolves the display label for a column.
 *
 * Checks `meta.headerTitle`, then `columnDef.header` (if it is a string),
 * then falls back to `column.id`.
 */
export function getColumnHeaderLabel<TData, TValue>(
  column: Column<TData, TValue>
): string {
  const meta = column.columnDef.meta as { headerTitle?: string } | undefined;
  if (typeof meta?.headerTitle === "string") {
    return meta.headerTitle;
  }
  const defHeader = column.columnDef.header;
  if (typeof defHeader === "string") {
    return defHeader;
  }
  return String(column.id);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Parameters passed to a server-side data fetch callback.
 */
export type DataGridApiFetchParams = {
  /** Zero-based page index. */
  pageIndex: number;
  /** Number of rows per page. */
  pageSize: number;
  /** Current sort descriptors. */
  sorting?: SortingState;
  /** Current column filter state. */
  filters?: ColumnFiltersState;
  /** Free-text search query. */
  searchQuery?: string;
};

/**
 * Standardised response shape returned by a remote data endpoint.
 *
 * @typeParam T - The shape of a single row record.
 */
export type DataGridApiResponse<T> = {
  /** The page of records. */
  data: T[];
  /** `true` when the result set is empty. */
  empty: boolean;
  /** Pagination metadata. */
  pagination: {
    /** Total number of records across all pages. */
    total: number;
    /** Current page (1-based). */
    page: number;
  };
};

/**
 * Subset of fetch parameters that control server-driven pagination.
 */
export type DataGridRequestParams = {
  /** Zero-based page index. */
  pageIndex: number;
  /** Number of rows per page. */
  pageSize: number;
  /** Current sort descriptors. */
  sorting?: SortingState;
  /** Current column filter state. */
  columnFilters?: ColumnFiltersState;
};

/**
 * Named type for the `tableLayout` feature-flag bag inside {@link DataGridProps}.
 *
 * Every member is optional; unset members receive the defaults applied by
 * `DataGrid` before passing into context.
 */
export type DataGridTableLayout = {
  /** Reduces cell padding to the `dense` variant. */
  dense?: boolean;
  /** Renders a right border on every non-last cell. */
  cellBorder?: boolean;
  /** Renders a bottom border between body rows. */
  rowBorder?: boolean;
  /** Rounds the first and last cell in every body row (theme-specific). */
  rowRounded?: boolean;
  /** Applies alternating background to odd rows. */
  stripped?: boolean;
  /** Shows the header background. Default `true`. */
  headerBackground?: boolean;
  /** Renders a bottom border beneath the header row. */
  headerBorder?: boolean;
  /** Makes the header row sticky within a scrolling viewport. */
  headerSticky?: boolean;
  /** Column width algorithm: `"auto"` or `"fixed"` (default). */
  width?: "auto" | "fixed";
  /** Enables the column-visibility dropdown (requires passing `visibility` on {@link DataGridColumnHeader}). */
  columnsVisibility?: boolean;
  /** Enables column resize handles. */
  columnsResizable?: boolean;
  /** Controls when column sizes are committed: `"onChange"` (live) or `"onEnd"` (mouse-up). */
  columnsResizeMode?: "onChange" | "onEnd";
  /** Enables column pin actions in the column-header menu. */
  columnsPinnable?: boolean;
  /** Enables move-left / move-right actions in the column-header menu. */
  columnsMovable?: boolean;
  /** Enables column drag-to-reorder (use {@link DataGridTableDnd}). */
  columnsDraggable?: boolean;
  /** Enables row drag-to-reorder (use {@link DataGridTableDndRows}). */
  rowsDraggable?: boolean;
  /** Enables row pin actions (renders {@link DataGridTableRowPin} in cells). */
  rowsPinnable?: boolean;
};

/**
 * Named type for the `tableClassNames` overrides bag inside {@link DataGridProps}.
 *
 * Each member is an optional extra class string merged onto the corresponding
 * element; all are optional and default to `""`.
 */
export type DataGridTableClassNames = {
  /** Extra classes on the `<table>` element. */
  base?: string;
  /** Extra classes on the `<thead>` element. */
  header?: string;
  /** Extra classes on the header `<tr>` element. */
  headerRow?: string;
  /** Classes applied when `headerSticky` is on. */
  headerSticky?: string;
  /** Extra classes on the `<tbody>` element. */
  body?: string;
  /** Extra classes on body `<tr>` elements. */
  bodyRow?: string;
  /** Extra classes on the `<tfoot>` element. */
  footer?: string;
  /** Extra classes on edge (pinned-boundary) cells. */
  edgeCell?: string;
};

/**
 * Context value exposed to all DataGrid sub-components via {@link useDataGrid}.
 *
 * @typeParam TData - The shape of a single row record.
 */
export interface DataGridContextProps<TData extends object> {
  /** Whether the grid is in a loading state. */
  isLoading: boolean;
  /** The resolved merged props passed to {@link DataGrid}. */
  props: DataGridProps<TData>;
  /** Total record count (drives pagination info and empty-state checks). */
  recordCount: number;
  /** The TanStack Table instance. */
  table: Table<TData>;
}

/**
 * Props for {@link DataGrid}.
 *
 * @typeParam TData - The shape of a single row record.
 */
export interface DataGridProps<TData extends object> {
  /** Message shown in the virtual infinite-scroll footer once all rows are loaded. */
  allRowsLoadedMessage?: React.ReactNode | string;
  /** Content rendered inside the provider (all sub-components). */
  children?: React.ReactNode;
  /** Extra class names on the outermost container (when using {@link DataGridContainer}). */
  className?: string;
  /** Message shown in the empty-state row when there is no data. */
  emptyMessage?: React.ReactNode | string;
  /** Message shown in the virtual infinite-scroll footer while fetching more rows. */
  fetchingMoreMessage?: React.ReactNode | string;
  /** When `true`, the grid is in a loading state. */
  isLoading?: boolean;
  /** Custom content shown in the spinner overlay. */
  loadingMessage?: React.ReactNode | string;
  /** Controls whether loading renders skeleton rows (`"skeleton"`) or a centred spinner (`"spinner"`). */
  loadingMode?: "skeleton" | "spinner";
  /** Called when a body row is clicked. */
  onRowClick?: (row: TData) => void;
  /** Total number of records — used by pagination and empty-state checks. */
  recordCount: number;
  /** The TanStack Table instance created by `useReactTable`. */
  table?: Table<TData>;
  /** Class-name overrides for individual structural elements. */
  tableClassNames?: DataGridTableClassNames;
  /** Feature-flag bag that controls layout and interactive column/row features. */
  tableLayout?: DataGridTableLayout;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

// Not exported — gates ban exported context values.
const DataGridContext = createContext<
  // biome-ignore lint/suspicious/noExplicitAny: generic context
  DataGridContextProps<any> | undefined
>(undefined);

/**
 * Returns the current {@link DataGridContextProps} from the nearest
 * {@link DataGridProvider}. Throws if called outside one.
 */
export function useDataGrid<
  TData extends object = object,
>(): DataGridContextProps<TData> {
  const ctx = useContext(DataGridContext);
  if (!ctx) {
    throw new Error("useDataGrid must be used within a DataGridProvider");
  }
  return ctx as DataGridContextProps<TData>;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/**
 * Provides DataGrid context to all sub-components.
 *
 * Normally you don't need to render this directly — {@link DataGrid} wraps it
 * automatically. Use it only when you need manual context control.
 */
export function DataGridProvider<TData extends object>({
  children,
  table,
  ...props
}: DataGridProps<TData> & { table: Table<TData> }) {
  const tableState = table.getState();

  if (props.tableLayout?.columnsResizable) {
    table.options.columnResizeMode =
      props.tableLayout.columnsResizeMode ?? "onChange";
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional granular deps to avoid re-renders during column resize
  const value = useMemo(
    () => ({
      props,
      table,
      recordCount: props.recordCount,
      isLoading: props.isLoading ?? false,
    }),
    [
      table,
      props.recordCount,
      props.isLoading,
      props.loadingMode,
      props.loadingMessage,
      props.fetchingMoreMessage,
      props.allRowsLoadedMessage,
      props.emptyMessage,
      props.onRowClick,
      props.className,
      tableState.sorting,
      tableState.pagination,
      tableState.columnFilters,
      tableState.rowSelection,
      tableState.expanded,
      tableState.columnVisibility,
      tableState.columnOrder,
      tableState.columnPinning,
      tableState.globalFilter,
    ]
  );

  return (
    <DataGridContext.Provider value={value}>
      {children}
    </DataGridContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// DataGrid root
// ---------------------------------------------------------------------------

/**
 * Root component for the DataGrid system.
 *
 * Merges default props, validates the `table` prop, and renders a
 * {@link DataGridProvider} that threads context to all sub-components.
 *
 * @example
 * ```tsx
 * <DataGrid table={table} recordCount={total}>
 *   <DataGridContainer>
 *     <DataGridScrollArea>
 *       <DataGridTable />
 *     </DataGridScrollArea>
 *     <DataGridPagination />
 *   </DataGridContainer>
 * </DataGrid>
 * ```
 */
export function DataGrid<TData extends object>({
  children,
  table,
  ...props
}: DataGridProps<TData>) {
  const defaultLayout: DataGridTableLayout = {
    dense: false,
    cellBorder: false,
    rowBorder: true,
    rowRounded: false,
    stripped: false,
    headerSticky: false,
    headerBackground: true,
    headerBorder: true,
    width: "fixed",
    columnsVisibility: false,
    columnsResizable: false,
    columnsResizeMode: "onChange",
    columnsPinnable: false,
    columnsMovable: false,
    columnsDraggable: false,
    rowsDraggable: false,
    rowsPinnable: false,
  };

  const defaultClassNames: DataGridTableClassNames = {
    base: "",
    header: "",
    headerRow: "",
    headerSticky: "sticky top-0 z-15 bg-muted",
    body: "",
    bodyRow: "",
    footer: "",
    edgeCell: "",
  };

  const mergedProps: DataGridProps<TData> = {
    loadingMode: "skeleton",
    ...props,
    tableLayout: { ...defaultLayout, ...(props.tableLayout ?? {}) },
    tableClassNames: { ...defaultClassNames, ...(props.tableClassNames ?? {}) },
  };

  if (!table) {
    throw new Error('DataGrid requires a "table" prop');
  }

  return (
    <DataGridProvider table={table} {...mergedProps}>
      {children}
    </DataGridProvider>
  );
}

// ---------------------------------------------------------------------------
// DataGridContainer
// ---------------------------------------------------------------------------

/**
 * Optional outer wrapper that adds a rounded border around the DataGrid.
 *
 * Wrap {@link DataGridScrollArea}, the table, and {@link DataGridPagination}
 * inside this to get a card-style container.
 */
export function DataGridContainer({
  children,
  className,
  border = true,
}: {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden",
        border && "rounded-lg border border-border",
        // Draw a top border on a sibling pagination so the table and the
        // pagination chrome share one bordered card.
        "[&>[data-slot=data-grid-pagination]]:border-border [&>[data-slot=data-grid-pagination]]:border-t",
        className
      )}
      data-slot="data-grid"
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal CVA spacing variants
// ---------------------------------------------------------------------------

const headerCellSpacingVariants = cva("h-9 px-3", {
  variants: {
    dense: { true: "h-7 px-2", false: "h-9 px-3" },
  },
  defaultVariants: { dense: false },
});

const bodyCellSpacingVariants = cva("px-3 py-2", {
  variants: {
    dense: { true: "px-2 py-1", false: "px-3 py-2" },
  },
  defaultVariants: { dense: false },
});

const footerCellSpacingVariants = cva("px-3 py-2", {
  variants: {
    dense: { true: "px-2 py-1", false: "px-3 py-2" },
  },
  defaultVariants: { dense: false },
});

// ---------------------------------------------------------------------------
// Pinning helpers
// ---------------------------------------------------------------------------

function getPinningStyles<TData>(
  column: Column<TData, unknown>
): React.CSSProperties {
  const isPinned = column.getIsPinned();
  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (!ref) {
    return;
  }
  if (typeof ref === "function") {
    ref(value);
  } else {
    (ref as React.RefObject<T>).current = value;
  }
}

// ---------------------------------------------------------------------------
// Row section helpers
// ---------------------------------------------------------------------------

/** Pinned row boundary marker for shadow rendering. */
type DataGridTablePinnedBoundary = "top" | "bottom";

function getDataGridTableRowSections<TData>(
  table: Table<TData>,
  rowsPinnable?: boolean
) {
  if (!rowsPinnable) {
    return {
      topRows: [] as Row<TData>[],
      centerRows: table.getRowModel().rows,
      bottomRows: [] as Row<TData>[],
    };
  }
  return {
    topRows: table.getTopRows(),
    centerRows: table.getCenterRows(),
    bottomRows: table.getBottomRows(),
  };
}

function getDataGridTableResolvedRows<TData>(
  table: Table<TData>,
  rowsPinnable?: boolean
): { row: Row<TData>; pinnedBoundary?: DataGridTablePinnedBoundary }[] {
  const { topRows, centerRows, bottomRows } = getDataGridTableRowSections(
    table,
    rowsPinnable
  );

  const result: {
    row: Row<TData>;
    pinnedBoundary?: DataGridTablePinnedBoundary;
  }[] = [];

  for (let i = 0; i < topRows.length; i++) {
    const row = topRows[i];
    if (row) {
      result.push({
        row,
        pinnedBoundary: i === topRows.length - 1 ? "top" : undefined,
      });
    }
  }
  for (const row of centerRows) {
    result.push({ row });
  }
  for (let i = 0; i < bottomRows.length; i++) {
    const row = bottomRows[i];
    if (row) {
      result.push({
        row,
        pinnedBoundary: i === 0 ? "bottom" : undefined,
      });
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Internal fill-cell helpers (only rendered when columnsResizable)
// ---------------------------------------------------------------------------

function DataGridTableFillCol() {
  return <col style={{ width: "var(--data-grid-fill-size, 0px)" }} />;
}

function DataGridTableFillHeadCell() {
  return (
    <th
      aria-hidden
      className="p-0"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
    />
  );
}

function DataGridTableFillBodyCell() {
  return (
    <td
      aria-hidden
      className="p-0"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
    />
  );
}

function DataGridTableFillFootCell() {
  return (
    <td
      aria-hidden
      className="border-t p-0"
      style={{ width: "var(--data-grid-fill-size, 0px)" }}
    />
  );
}

// ---------------------------------------------------------------------------
// DataGridTableViewport
// ---------------------------------------------------------------------------

function DataGridTableViewport({
  children,
  className,
  viewportRef,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  viewportRef?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
}) {
  const { props, table } = useDataGrid();
  const columnsResizable = props.tableLayout?.columnsResizable;
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewportElement, setViewportElement] = useState<HTMLDivElement | null>(
    null
  );

  const handleViewportRef = useCallback(
    (el: HTMLDivElement | null) => {
      setViewportElement(el);
      assignRef(viewportRef, el);
    },
    [viewportRef]
  );

  useEffect(() => {
    if (!viewportElement) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    const parent = viewportElement.parentElement ?? viewportElement;
    observer.observe(parent);
    return () => observer.disconnect();
  }, [viewportElement]);

  const fillSize = columnsResizable
    ? Math.max(0, containerWidth - table.getTotalSize())
    : 0;

  return (
    <div
      className={cn("relative min-w-full align-top", className)}
      data-slot="data-grid-table-viewport"
      ref={handleViewportRef}
      style={{
        ...style,
        ...(columnsResizable
          ? ({
              "--data-grid-fill-size": `${fillSize}px`,
            } as React.CSSProperties)
          : {}),
      }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DataGridTableBase
// ---------------------------------------------------------------------------

function getTableWidthClass(widthMode: "auto" | "fixed" | undefined) {
  if (widthMode === "auto") {
    return "w-full min-w-full table-auto";
  }
  return "w-full min-w-full table-fixed";
}

function DataGridTableBase({ children }: { children: React.ReactNode }) {
  const { props, table } = useDataGrid();
  const { tableLayout, tableClassNames } = props;
  const columnsResizable = tableLayout?.columnsResizable;
  const widthMode = tableLayout?.width ?? "fixed";

  const visibleColumns = table.getVisibleLeafColumns();
  const flatHeaders = table.getFlatHeaders();

  const columnSizeVars = useMemo(() => {
    const vars: Record<string, number> = {};
    for (const header of flatHeaders) {
      vars[`--header-${header.id}-size`] = header.getSize();
      vars[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return vars;
  }, [flatHeaders]);

  return (
    <table
      className={cn(
        "caption-bottom text-left align-middle font-normal text-foreground text-sm rtl:text-right",
        columnsResizable ? "min-w-0" : getTableWidthClass(widthMode),
        !tableLayout?.columnsDraggable && "border-separate border-spacing-0",
        tableClassNames?.base
      )}
      data-slot="data-grid-table"
      style={
        columnsResizable ? (columnSizeVars as React.CSSProperties) : undefined
      }
    >
      <colgroup>
        {visibleColumns.map((col) => (
          <col
            key={col.id}
            style={
              columnsResizable
                ? {
                    width: `calc(var(--col-${col.id}-size) * 1px)`,
                  }
                : undefined
            }
          />
        ))}
        {columnsResizable && <DataGridTableFillCol />}
      </colgroup>
      {children}
    </table>
  );
}

// ---------------------------------------------------------------------------
// Head components
// ---------------------------------------------------------------------------

function DataGridTableHead({ children }: { children: React.ReactNode }) {
  const { props } = useDataGrid();
  return (
    <thead
      className={cn(props.tableClassNames?.header)}
      data-slot="data-grid-table-head"
    >
      {children}
    </thead>
  );
}

function DataGridTableHeadRow<TData>({
  children,
  headerGroup,
}: {
  children: React.ReactNode;
  headerGroup: HeaderGroup<TData>;
}) {
  const { props } = useDataGrid();
  const { tableLayout, tableClassNames } = props;
  const isStripped = tableLayout?.stripped;
  const headerBg = tableLayout?.headerBackground !== false;

  return (
    <tr
      className={cn(
        "bg-muted/50",
        tableLayout?.headerBorder && "[&>th]:border-border [&>th]:border-b",
        tableLayout?.cellBorder && "*:last:border-e-0",
        (isStripped || !headerBg) && "bg-transparent",
        tableClassNames?.headerRow
      )}
      data-slot="data-grid-table-head-row"
      key={headerGroup.id}
    >
      {children}
    </tr>
  );
}

function DataGridTableHeadRowCell<TData>({
  children,
  header,
  dndRef,
  dndStyle,
}: {
  children: React.ReactNode;
  header: Header<TData, unknown>;
  dndRef?: React.Ref<HTMLTableCellElement>;
  dndStyle?: React.CSSProperties;
}) {
  const { props } = useDataGrid();
  const { tableLayout, tableClassNames } = props;
  const column = header.column;
  const isPinned = column.getIsPinned();
  const isResizable = tableLayout?.columnsResizable && column.getCanResize();
  const dense = tableLayout?.dense;

  const lastVisibleColumn = (() => {
    const allVisible = props.table?.getVisibleLeafColumns() ?? [];
    return allVisible.at(-1)?.id === column.id;
  })();

  const pinStyle = getPinningStyles(column);
  const pinData = isPinned
    ? {
        "data-pinned": isPinned,
        "data-last-col": lastVisibleColumn ? isPinned : undefined,
      }
    : {};

  return (
    <th
      className={cn(
        "relative whitespace-nowrap text-left align-middle font-medium text-foreground rtl:text-right [&:has([role=checkbox])]:pe-0",
        headerCellSpacingVariants({ dense: dense ?? false }),
        tableLayout?.cellBorder && "border-border border-e",
        isResizable && "overflow-visible",
        isResizable && lastVisibleColumn && "pe-8",
        isPinned &&
          "data-pinned:bg-muted [&[data-pinned][data-last-col]]:border-border",
        isPinned === "left" &&
          "[&[data-pinned=left][data-last-col=left]]:border-e!",
        isPinned === "right" &&
          "[&[data-pinned=right][data-last-col=right]]:border-s!",
        tableClassNames?.edgeCell,
        column.columnDef.meta?.headerClassName,
        tableLayout?.headerSticky && tableClassNames?.headerSticky
      )}
      data-slot="data-grid-table-head-cell"
      ref={dndRef}
      style={{ ...pinStyle, ...dndStyle }}
      {...pinData}
    >
      {children}
    </th>
  );
}

/**
 * Resize handle rendered inside a header cell when `columnsResizable` is on.
 */
export function DataGridTableHeadRowCellResize<TData>({
  header,
}: {
  header: Header<TData, unknown>;
}) {
  const { props } = useDataGrid();
  const column = header.column;
  const isResizingThis = props.table
    ? props.table.getState().columnSizingInfo.isResizingColumn === column.id
    : false;

  const allVisible = props.table?.getVisibleLeafColumns() ?? [];
  const isLastVisible = allVisible.at(-1)?.id === column.id;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: resize handle is a visual affordance, not an interactive element for AT
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: intentional resize-handle pattern
    <div
      className={cn(
        "absolute top-0 z-10 flex h-full cursor-col-resize touch-none select-none",
        isLastVisible
          ? "end-0 w-5 justify-end before:hidden"
          : "-end-2 w-5 justify-center before:absolute before:inset-y-0 before:w-px before:-translate-x-px before:bg-border",
        isResizingThis &&
          "opacity-100 before:block before:w-0.5 before:bg-primary"
      )}
      data-slot="data-grid-table-head-cell-resize"
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
    />
  );
}

// ---------------------------------------------------------------------------
// DataGridTableRowSpacer
// ---------------------------------------------------------------------------

function DataGridTableRowSpacer() {
  return <tbody aria-hidden className="h-2" data-slot="data-grid-row-spacer" />;
}

// ---------------------------------------------------------------------------
// Body components
// ---------------------------------------------------------------------------

function DataGridTableBody({ children }: { children: React.ReactNode }) {
  const { props } = useDataGrid();
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", props.tableClassNames?.body)}
      data-slot="data-grid-table-body"
    >
      {children}
    </tbody>
  );
}

function DataGridTableBodyRow<TData extends object>({
  children,
  row,
  pinnedBoundary,
  rowRef,
  dndRef,
  dndStyle,
}: {
  children: React.ReactNode;
  row: Row<TData>;
  pinnedBoundary?: DataGridTablePinnedBoundary;
  rowRef?: React.Ref<HTMLTableRowElement>;
  dndRef?: React.Ref<HTMLTableRowElement>;
  dndStyle?: React.CSSProperties;
}) {
  const { props } = useDataGrid();
  const { tableLayout, tableClassNames } = props;
  const isSelected = row.getIsSelected();
  const isPinned = row.getIsPinned();

  const handleRef = useCallback(
    (el: HTMLTableRowElement | null) => {
      assignRef(rowRef, el);
      assignRef(dndRef, el);
    },
    [rowRef, dndRef]
  );

  return (
    <tr
      className={cn(
        "transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        props.onRowClick && "cursor-pointer",
        tableLayout?.rowBorder &&
          !tableLayout.stripped &&
          "border-border border-b [&:not(:last-child)>td]:border-b",
        tableLayout?.cellBorder && "*:last:border-e-0",
        tableLayout?.stripped &&
          "odd:bg-muted/50 hover:bg-muted odd:hover:bg-muted",
        row.getCanSelect() && "*:first:relative",
        isPinned && "bg-muted/50 hover:bg-muted",
        pinnedBoundary && "[&>td]:shadow-[0_2px_0_var(--border)]",
        tableClassNames?.bodyRow
      )}
      data-row-pinned={isPinned || undefined}
      data-row-pinned-boundary={pinnedBoundary}
      data-slot="data-grid-table-body-row"
      data-state={isSelected ? "selected" : undefined}
      onClick={
        props.onRowClick ? () => props.onRowClick?.(row.original) : undefined
      }
      ref={handleRef}
      style={dndStyle}
    >
      {children}
      {tableLayout?.columnsResizable && <DataGridTableFillBodyCell />}
    </tr>
  );
}

function DataGridTableBodyRowCell<TData>({
  children,
  cell,
  dndRef,
  dndStyle,
}: {
  children: React.ReactNode;
  cell: Cell<TData, unknown>;
  dndRef?: React.Ref<HTMLTableCellElement>;
  dndStyle?: React.CSSProperties;
}) {
  const { props } = useDataGrid();
  const { tableLayout } = props;
  const column = cell.column;
  const isPinned = column.getIsPinned();
  const isResizable = tableLayout?.columnsResizable && column.getCanResize();
  const dense = tableLayout?.dense;

  const allVisible = props.table?.getVisibleLeafColumns() ?? [];
  const isLastVisible = allVisible.at(-1)?.id === column.id;

  const pinStyle = getPinningStyles(column);
  const pinData = isPinned
    ? {
        "data-pinned": isPinned,
        "data-last-col": isLastVisible ? isPinned : undefined,
      }
    : {};

  return (
    <td
      className={cn(
        "align-middle",
        bodyCellSpacingVariants({ dense: dense ?? false }),
        tableLayout?.cellBorder && "border-border border-e",
        isResizable && "truncate",
        isPinned &&
          "data-pinned:bg-background [&[data-pinned][data-last-col]]:border-border",
        isPinned === "left" &&
          "[&[data-pinned=left][data-last-col=left]]:border-e!",
        isPinned === "right" &&
          "[&[data-pinned=right][data-last-col=right]]:border-s!",
        column.columnDef.meta?.cellClassName
      )}
      data-slot="data-grid-table-body-cell"
      ref={dndRef}
      style={{ ...pinStyle, ...dndStyle }}
      {...pinData}
    >
      {children}
    </td>
  );
}

function DataGridTableBodyRowExpanded<TData extends object>({
  row,
}: {
  row: Row<TData>;
}) {
  const { props, table } = useDataGrid<TData>();
  const visibleCells = row.getVisibleCells();
  const expandCol = table
    .getAllColumns()
    .find((col) => col.columnDef.meta?.expandedContent);

  return (
    <tr data-slot="data-grid-table-body-row-expanded">
      <td
        className="border-border border-b bg-muted/50"
        colSpan={
          visibleCells.length + (props.tableLayout?.columnsResizable ? 1 : 0)
        }
      >
        {expandCol?.columnDef.meta?.expandedContent?.(row.original)}
      </td>
    </tr>
  );
}

function DataGridTableBodyRowSkeleton({
  children,
}: {
  children: React.ReactNode;
}) {
  const { props } = useDataGrid();
  const { tableLayout, tableClassNames } = props;
  return (
    <tr
      className={cn(
        "hover:bg-muted/50",
        tableLayout?.rowBorder &&
          !tableLayout.stripped &&
          "border-border border-b [&:not(:last-child)>td]:border-b",
        tableLayout?.cellBorder && "*:last:border-e-0",
        tableClassNames?.bodyRow
      )}
      data-slot="data-grid-table-body-row-skeleton"
    >
      {children}
      {tableLayout?.columnsResizable && <DataGridTableFillBodyCell />}
    </tr>
  );
}

function DataGridTableBodyRowSkeletonCell<TData>({
  children,
  column,
}: {
  children: React.ReactNode;
  column: Column<TData>;
}) {
  const { props } = useDataGrid();
  const { tableLayout } = props;
  const isPinned = column.getIsPinned();
  const dense = tableLayout?.dense;
  const pinStyle = getPinningStyles(column);

  return (
    <td
      className={cn(
        "align-middle",
        bodyCellSpacingVariants({ dense: dense ?? false }),
        tableLayout?.cellBorder && "border-border border-e",
        isPinned &&
          "data-pinned:bg-background [&[data-pinned][data-last-col]]:border-border"
      )}
      data-slot="data-grid-table-body-cell-skeleton"
      style={pinStyle}
    >
      {children}
    </td>
  );
}

// ---------------------------------------------------------------------------
// DataGridTableRenderedRow
// ---------------------------------------------------------------------------

function DataGridTableRenderedRow<TData extends object>({
  row,
  pinnedBoundary,
  rowRef,
}: {
  row: Row<TData>;
  pinnedBoundary?: DataGridTablePinnedBoundary;
  rowRef?: React.Ref<HTMLTableRowElement>;
}) {
  return (
    <React.Fragment key={row.id}>
      <DataGridTableBodyRow
        pinnedBoundary={pinnedBoundary}
        row={row}
        rowRef={rowRef}
      >
        {row.getVisibleCells().map((cell) => (
          <DataGridTableBodyRowCell cell={cell} key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </DataGridTableBodyRowCell>
        ))}
      </DataGridTableBodyRow>
      {row.getIsExpanded() && <DataGridTableBodyRowExpanded row={row} />}
    </React.Fragment>
  );
}

// ---------------------------------------------------------------------------
// DataGridTableEmpty / DataGridTableLoader
// ---------------------------------------------------------------------------

/** Empty-state row rendered when there are no data rows. */
export function DataGridTableEmpty() {
  const { props, table } = useDataGrid();
  const visibleCount = table.getVisibleLeafColumns().length;
  return (
    <tr data-slot="data-grid-table-empty">
      <td
        className="py-6 text-center text-muted-foreground text-sm"
        colSpan={visibleCount + (props.tableLayout?.columnsResizable ? 1 : 0)}
      >
        {props.emptyMessage ?? "No data available"}
      </td>
    </tr>
  );
}

/** Spinner overlay rendered when `loadingMode="spinner"`. */
export function DataGridTableLoader() {
  const { props } = useDataGrid();
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      data-slot="data-grid-table-loader"
    >
      <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-muted-foreground text-sm shadow-sm">
        <Spinner className="size-4 opacity-60" />
        {props.loadingMessage}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DataGridTableBodyRows (loading/empty/data rendering)
// ---------------------------------------------------------------------------

function DataGridTableBodyRows<TData extends object>({
  table,
}: {
  table: Table<TData>;
}) {
  const { props, isLoading } = useDataGrid<TData>();
  const { tableLayout } = props;
  const rowsPinnable = tableLayout?.rowsPinnable;
  const pageSize = table.getState().pagination.pageSize;
  const visibleColumns = table.getVisibleLeafColumns();

  if (isLoading && props.loadingMode === "skeleton") {
    return (
      <>
        {Array.from({ length: pageSize }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no stable id
          <DataGridTableBodyRowSkeleton key={i}>
            {visibleColumns.map((col) => (
              <DataGridTableBodyRowSkeletonCell column={col} key={col.id}>
                {col.columnDef.meta?.skeleton ?? (
                  <Skeleton className="h-4 w-full" />
                )}
              </DataGridTableBodyRowSkeletonCell>
            ))}
          </DataGridTableBodyRowSkeleton>
        ))}
      </>
    );
  }

  const resolvedRows = getDataGridTableResolvedRows(table, rowsPinnable);

  if (!isLoading && resolvedRows.length === 0) {
    return <DataGridTableEmpty />;
  }

  return (
    <>
      {resolvedRows.map(({ row, pinnedBoundary }) => (
        <DataGridTableRenderedRow
          key={row.id}
          pinnedBoundary={pinnedBoundary}
          row={row}
        />
      ))}
      {isLoading && props.loadingMode === "spinner" && (
        <tr>
          <td colSpan={visibleColumns.length}>
            <DataGridTableLoader />
          </td>
        </tr>
      )}
    </>
  );
}

const MemoizedDataGridTableBodyRows = memo(
  DataGridTableBodyRows,
  (_prev, next) => !!next.table.getState().columnSizingInfo.isResizingColumn
) as typeof DataGridTableBodyRows;

// ---------------------------------------------------------------------------
// Footer components
// ---------------------------------------------------------------------------

/**
 * Footer wrapper `<tfoot>` element for the DataGrid table.
 */
export function DataGridTableFoot({ children }: { children: React.ReactNode }) {
  const { props } = useDataGrid();
  return (
    <tfoot
      className={cn("border-t", props.tableClassNames?.footer)}
      data-slot="data-grid-table-foot"
    >
      {children}
    </tfoot>
  );
}

/**
 * A `<tr>` row inside {@link DataGridTableFoot}.
 */
export function DataGridTableFootRow({
  children,
}: {
  children: React.ReactNode;
}) {
  const { props } = useDataGrid();
  return (
    <tr
      className={cn(
        "bg-muted/50",
        props.tableLayout?.cellBorder && "*:last:border-e-0"
      )}
      data-slot="data-grid-table-foot-row"
    >
      {children}
      {props.tableLayout?.columnsResizable && <DataGridTableFillFootCell />}
    </tr>
  );
}

/**
 * A `<td>` cell inside {@link DataGridTableFootRow}.
 */
export function DataGridTableFootRowCell({
  children,
  colSpan,
  className,
}: {
  children?: React.ReactNode;
  colSpan?: number;
  className?: string;
}) {
  const { props } = useDataGrid();
  const dense = props.tableLayout?.dense;
  return (
    <td
      className={cn(
        "border-border border-t align-middle font-medium text-foreground",
        footerCellSpacingVariants({ dense: dense ?? false }),
        props.tableLayout?.cellBorder && "border-border border-e",
        className
      )}
      colSpan={colSpan}
      data-slot="data-grid-table-foot-cell"
    >
      {children}
    </td>
  );
}

// ---------------------------------------------------------------------------
// Row action helpers: Pin / Select
// ---------------------------------------------------------------------------

/**
 * Pin/unpin toggle button for a single row. Use inside a cell renderer.
 */
export function DataGridTableRowPin<TData>({ row }: { row: Row<TData> }) {
  const isPinned = row.getIsPinned();
  return (
    <Button
      aria-label={isPinned ? "Unpin row" : "Pin row"}
      aria-pressed={isPinned ? true : undefined}
      data-slot="data-grid-row-pin"
      onClick={() => row.pin(isPinned ? false : "top")}
      size="icon-sm"
      type="button"
      variant="ghost"
    >
      <HugeiconsIcon icon={isPinned ? PinOffIcon : PinIcon} strokeWidth={2} />
    </Button>
  );
}

/**
 * Row-selection checkbox + selection indicator stripe. Use inside a cell renderer.
 */
export function DataGridTableRowSelect<TData>({ row }: { row: Row<TData> }) {
  const isSelected = row.getIsSelected();
  return (
    <>
      <div
        className={cn(
          "absolute inset-s-0 top-0 bottom-0 hidden w-[2px] bg-primary",
          isSelected && "block"
        )}
        data-slot="data-grid-row-select-indicator"
      />
      <Checkbox
        aria-label="Select row"
        checked={isSelected}
        className="align-[inherit]"
        data-slot="data-grid-row-select-checkbox"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    </>
  );
}

/**
 * "Select all" checkbox for the header cell. Renders indeterminate state when
 * some (but not all) rows are selected.
 */
export function DataGridTableRowSelectAll() {
  const { table, isLoading, recordCount } = useDataGrid();
  const isEmpty = recordCount === 0;
  const allSelected = table.getIsAllPageRowsSelected();
  const someSelected = table.getIsSomePageRowsSelected() && !allSelected;

  return (
    <Checkbox
      aria-label="Select all"
      checked={allSelected}
      className="align-[inherit]"
      data-slot="data-grid-row-select-all"
      disabled={isLoading || isEmpty}
      indeterminate={someSelected}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  );
}

/**
 * Props for {@link DataGridTableRowActions}.
 *
 * @typeParam TData - Row record shape.
 */
export type DataGridTableRowActionsProps<TData> = {
  /**
   * The TanStack row whose actions are being exposed. Passed through to
   * children via the `data-row-id` attribute for test selectors; the row
   * itself is available to consumers via the surrounding closure.
   */
  row: Row<TData>;
  /**
   * {@link DropdownMenuItem} children rendered inside the menu. Compose
   * `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuLabel`, etc.
   */
  children: React.ReactNode;
  /**
   * Accessible label for the trigger button. Defaults to `"Row actions"`.
   */
  label?: string;
  /** Additional class names merged onto the trigger button. */
  className?: string;
};

/**
 * Per-row actions menu — an ellipsis icon button that opens a
 * {@link DropdownMenu} with consumer-provided items (Edit, Delete, …).
 *
 * Drop this into a column's `cell` renderer to expose row-scoped commands.
 * The menu shell, trigger button, and ARIA labelling are handled here; only
 * the menu items are supplied by the consumer.
 *
 * @example
 * ```tsx
 * const columns: ColumnDef<User>[] = [
 *   // … other columns …
 *   {
 *     id: "actions",
 *     header: "",
 *     cell: ({ row }) => (
 *       <DataGridTableRowActions row={row}>
 *         <DropdownMenuItem onClick={() => edit(row.original)}>
 *           Edit
 *         </DropdownMenuItem>
 *         <DropdownMenuSeparator />
 *         <DropdownMenuItem
 *           onClick={() => remove(row.original)}
 *           variant="destructive"
 *         >
 *           Delete
 *         </DropdownMenuItem>
 *       </DataGridTableRowActions>
 *     ),
 *   },
 * ];
 * ```
 */
export function DataGridTableRowActions<TData>({
  row,
  children,
  label = "Row actions",
  className,
}: DataGridTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={label}
            className={className}
            data-row-id={row.id}
            data-slot="data-grid-row-actions"
            size="icon-sm"
            type="button"
            variant="ghost"
          />
        }
      >
        <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Props for {@link DataGridSelectionBar}.
 */
export type DataGridSelectionBarProps = {
  /**
   * Bulk action buttons rendered inside the toolbar. Each action's `onClick`
   * is responsible for resetting selection if desired — the clear (×) button
   * handles selection reset automatically.
   */
  actions: BulkAction[];
  /** Additional class names forwarded to {@link BulkActionBar}. */
  className?: string;
  /**
   * Extra content rendered between the count label and the action buttons
   * (forwarded to {@link BulkActionBar}'s `children` slot).
   */
  children?: React.ReactNode;
};

/**
 * Floating bulk-action toolbar wired to DataGrid selection state.
 *
 * Reads `table.getSelectedRowModel()` from the surrounding {@link DataGrid}
 * context and renders a fixed-position {@link BulkActionBar} whenever one or
 * more rows are selected. Returns `null` while nothing is selected.
 *
 * Place this anywhere inside a {@link DataGrid} (typically as a sibling of
 * {@link DataGridContainer}); the bar portals itself to the bottom of the
 * viewport via `position="fixed"`.
 *
 * @example
 * ```tsx
 * <DataGrid table={table} recordCount={data.length}>
 *   <DataGridContainer>
 *     <DataGridTable />
 *   </DataGridContainer>
 *   <DataGridSelectionBar
 *     actions={[
 *       { label: "Archive", onClick: archiveSelected },
 *       {
 *         label: "Delete",
 *         icon: Delete01Icon,
 *         variant: "destructive",
 *         onClick: deleteSelected,
 *       },
 *     ]}
 *   />
 * </DataGrid>
 * ```
 */
export function DataGridSelectionBar({
  actions,
  className,
  children,
}: DataGridSelectionBarProps) {
  const { table } = useDataGrid();
  const selectedCount = table.getSelectedRowModel().rows.length;
  if (selectedCount === 0) {
    return null;
  }
  return (
    <BulkActionBar
      actions={actions}
      className={className}
      onClearSelection={() => table.resetRowSelection()}
      position="fixed"
      selectedCount={selectedCount}
    >
      {children}
    </BulkActionBar>
  );
}

// ---------------------------------------------------------------------------
// DataGridTable (top-level standard table)
// ---------------------------------------------------------------------------

function renderHeaderCellContent<TData>(
  header: Header<TData, unknown>,
  tableLayout: DataGridTableLayout | undefined
) {
  if (header.isPlaceholder) {
    return null;
  }
  if (tableLayout?.columnsResizable && header.column.getCanResize()) {
    return (
      <>
        <div className="truncate">
          {flexRender(header.column.columnDef.header, header.getContext())}
        </div>
        <DataGridTableHeadRowCellResize header={header} />
      </>
    );
  }
  return flexRender(header.column.columnDef.header, header.getContext());
}

/**
 * Standard (non-virtual, non-DnD) DataGrid table.
 *
 * Renders the full `<table>` structure: header, body rows, optional footer.
 * Wrap in {@link DataGridScrollArea} for horizontal/vertical scroll.
 */
export function DataGridTable({
  footerContent,
  renderHeader = true,
}: {
  footerContent?: React.ReactNode;
  renderHeader?: boolean;
}) {
  const { props, table } = useDataGrid();
  const { tableLayout } = props;

  return (
    <DataGridTableViewport>
      <DataGridTableBase>
        {renderHeader && (
          <DataGridTableHead>
            {table.getHeaderGroups().map((hg) => (
              <DataGridTableHeadRow headerGroup={hg} key={hg.id}>
                {hg.headers.map((header) => (
                  <DataGridTableHeadRowCell header={header} key={header.id}>
                    {renderHeaderCellContent(header, tableLayout)}
                  </DataGridTableHeadRowCell>
                ))}
                {tableLayout?.columnsResizable && <DataGridTableFillHeadCell />}
              </DataGridTableHeadRow>
            ))}
          </DataGridTableHead>
        )}
        {renderHeader && (tableLayout?.stripped || !tableLayout?.rowBorder) && (
          <DataGridTableRowSpacer />
        )}
        <DataGridTableBody>
          <MemoizedDataGridTableBodyRows table={table} />
        </DataGridTableBody>
        {footerContent && (
          <DataGridTableFoot>{footerContent}</DataGridTableFoot>
        )}
      </DataGridTableBase>
    </DataGridTableViewport>
  );
}

// ---------------------------------------------------------------------------
// DataGridScrollArea
// ---------------------------------------------------------------------------

/**
 * Props for {@link DataGridScrollArea}.
 */
export type DataGridScrollAreaProps = Omit<
  ScrollAreaPrimitive.Root.Props,
  "children"
> & {
  /** Content rendered inside the scroll area. */
  children: React.ReactNode;
  /** Which scroll axes to enable. Default `"both"`. */
  orientation?: "horizontal" | "vertical" | "both";
};

/**
 * A custom scroll container for the DataGrid.
 *
 * Wraps Base UI's `ScrollArea` primitive with both horizontal and vertical
 * scrollbars by default. Sticky headers work via `sticky top-0` on header
 * cells when `tableLayout.headerSticky` is set.
 */
export function DataGridScrollArea({
  children,
  orientation = "both",
  className,
  ...props
}: DataGridScrollAreaProps) {
  const showHorizontal = orientation === "horizontal" || orientation === "both";
  const showVertical = orientation === "vertical" || orientation === "both";

  return (
    <ScrollAreaPrimitive.Root
      className={cn("relative", className)}
      data-slot="data-grid-scroll-area"
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className="size-full"
        data-slot="scroll-area-viewport"
      >
        <ScrollAreaPrimitive.Content data-slot="scroll-area-content">
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      {showHorizontal && (
        <ScrollAreaPrimitive.Scrollbar
          className="flex touch-none select-none p-px transition-colors data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent"
          data-orientation="horizontal"
          data-slot="data-grid-scrollbar"
          orientation="horizontal"
        >
          <ScrollAreaPrimitive.Thumb
            className="relative flex-1 rounded-full bg-border"
            data-slot="data-grid-thumb"
          />
        </ScrollAreaPrimitive.Scrollbar>
      )}
      {showVertical && (
        <ScrollAreaPrimitive.Scrollbar
          className="flex touch-none select-none p-px transition-colors data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 data-[orientation=vertical]:border-s data-[orientation=vertical]:border-s-transparent"
          data-orientation="vertical"
          data-slot="data-grid-scrollbar"
          orientation="vertical"
        >
          <ScrollAreaPrimitive.Thumb
            className="relative flex-1 rounded-full bg-border"
            data-slot="data-grid-thumb"
          />
        </ScrollAreaPrimitive.Scrollbar>
      )}
    </ScrollAreaPrimitive.Root>
  );
}

// ---------------------------------------------------------------------------
// DataGridPagination
// ---------------------------------------------------------------------------

/**
 * Props for {@link DataGridPagination}.
 */
export interface DataGridPaginationProps {
  /** Extra class names on the root element. */
  className?: string;
  /** Ellipsis text. Default `"..."`. */
  ellipsisText?: string;
  /** Pagination info template string. Default `"{from} - {to} of {count}"`. */
  info?: string;
  /** Skeleton shown for the info section while loading. */
  infoSkeleton?: React.ReactNode;
  /** Whether to render grouped ellipsis page buttons. Default `false`. */
  more?: boolean;
  /** Number of page buttons per group. Default `5`. */
  moreLimit?: number;
  /** Aria-label for the next-page button. Default `"Go to next page"`. */
  nextPageLabel?: string;
  /** Aria-label for the previous-page button. Default `"Go to previous page"`. */
  previousPageLabel?: string;
  /** Label for the rows-per-page control. Default `"Rows per page"`. */
  rowsPerPageLabel?: string;
  /** Available page-size options. Default `[5, 10, 25, 50, 100]`. */
  sizes?: number[];
  /** Label after the page-size select. Default `"per page"`. */
  sizesDescription?: string;
  /** Extra info shown next to the sizes select. */
  sizesInfo?: string;
  /** Label before the page-size select. Default `"Show"`. */
  sizesLabel?: string;
  /** Skeleton shown for the sizes section while loading. */
  sizesSkeleton?: React.ReactNode;
}

/**
 * Grouped pagination bar for {@link DataGrid}.
 *
 * Shows a page-size selector on the left and page-number buttons with
 * optional grouped ellipsis on the right. Reads table state from context.
 *
 * @remarks
 * The pagination has no border of its own. When placed inside a
 * {@link DataGridContainer} as a sibling of {@link DataGridTable} the
 * container draws a `border-t` between the two so they share one bordered
 * card. Render it outside the container — anywhere on the page — to get a
 * standalone bar with just padding; layer it into your own surface as
 * needed.
 */
export function DataGridPagination(userProps: DataGridPaginationProps) {
  const { table, isLoading, recordCount } = useDataGrid();

  const defaults = {
    sizes: [5, 10, 25, 50, 100],
    sizesLabel: "Show",
    sizesDescription: "per page",
    sizesSkeleton: <Skeleton className="h-8 w-44" />,
    more: false,
    moreLimit: 5,
    info: "{from} - {to} of {count}",
    infoSkeleton: <Skeleton className="h-8 w-60" />,
    rowsPerPageLabel: "Rows per page",
    previousPageLabel: "Go to previous page",
    nextPageLabel: "Go to next page",
    ellipsisText: "...",
  };

  const p = { ...defaults, ...userProps };

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, recordCount);

  const paginationInfo = (p.info ?? "{from} - {to} of {count}")
    .replace("{from}", String(from))
    .replace("{to}", String(to))
    .replace("{count}", String(recordCount));

  const paginationMoreLimit = p.moreLimit ?? 5;
  const currentGroupStart =
    Math.floor(pageIndex / paginationMoreLimit) * paginationMoreLimit;
  const currentGroupEnd = Math.min(
    currentGroupStart + paginationMoreLimit,
    pageCount
  );

  function renderPageButtons() {
    const buttons: React.ReactNode[] = [];
    for (let i = currentGroupStart; i < currentGroupEnd; i++) {
      const isActive = i === pageIndex;
      buttons.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={isActive}
            onClick={() => table.setPageIndex(i)}
          >
            <span className="tabular-nums">{i + 1}</span>
          </PaginationLink>
        </PaginationItem>
      );
    }
    return buttons;
  }

  return (
    <div
      className={cn(
        "flex grow flex-col flex-wrap items-center justify-between gap-2.5 px-3 py-2.5 text-sm sm:flex-row",
        userProps.className
      )}
      data-slot="data-grid-pagination"
    >
      {/* Left: rows per page */}
      <div className="order-2 flex flex-wrap items-center gap-2 sm:order-1">
        {isLoading ? (
          p.sizesSkeleton
        ) : (
          <>
            <div className="text-muted-foreground">{p.rowsPerPageLabel}</div>
            <Select
              onValueChange={(val) => table.setPageSize(Number(val))}
              value={String(pageSize)}
            >
              <SelectTrigger className="w-16" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-20" side="top">
                {(p.sizes ?? [5, 10, 25, 50, 100]).map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
      </div>

      {/* Right: info + page buttons */}
      <div className="order-1 flex flex-col items-center justify-center gap-2.5 sm:order-2 sm:flex-row sm:justify-end">
        {isLoading ? (
          p.infoSkeleton
        ) : (
          <>
            <div className="order-2 text-nowrap text-muted-foreground tabular-nums sm:order-1">
              {paginationInfo}
            </div>
            {pageCount > 1 && (
              <Pagination className="order-1 mx-0 w-auto sm:order-2" size="sm">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-disabled={!canPrev}
                      aria-label={p.previousPageLabel}
                      className={cn(
                        !canPrev && "pointer-events-none opacity-50"
                      )}
                      onClick={() => canPrev && table.previousPage()}
                    />
                  </PaginationItem>

                  {currentGroupStart > 0 && (
                    <PaginationItem>
                      <PaginationLink
                        aria-label="Previous page group"
                        onClick={() =>
                          table.setPageIndex(currentGroupStart - 1)
                        }
                      >
                        <PaginationEllipsis />
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  {renderPageButtons()}

                  {currentGroupEnd < pageCount && (
                    <PaginationItem>
                      <PaginationLink
                        aria-label="Next page group"
                        onClick={() => table.setPageIndex(currentGroupEnd)}
                      >
                        <PaginationEllipsis />
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      aria-disabled={!canNext}
                      aria-label={p.nextPageLabel}
                      className={cn(
                        !canNext && "pointer-events-none opacity-50"
                      )}
                      onClick={() => canNext && table.nextPage()}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DataGridColumnHeader
// ---------------------------------------------------------------------------

function buildColumnHeaderMenuItems<TData extends object, TValue>({
  filter,
  canSort,
  isSorted,
  column,
  columnsPinnable,
  canPin,
  isPinned,
  columnsMovable,
  moveColumn,
  columnsVisibility,
  visibility,
  table,
}: {
  filter: React.ReactNode;
  canSort: boolean;
  isSorted: false | "asc" | "desc";
  column: Column<TData, TValue>;
  columnsPinnable: boolean;
  canPin: boolean;
  isPinned: false | "left" | "right";
  columnsMovable: boolean;
  moveColumn: (direction: "left" | "right") => void;
  columnsVisibility: boolean;
  visibility: boolean;
  table: Table<TData>;
}): React.ReactNode[] {
  const items: React.ReactNode[] = [];
  let needsSep = false;

  if (filter) {
    items.push(
      <DropdownMenuGroup key="filter">
        <DropdownMenuLabel render={<div>{filter}</div>} />
      </DropdownMenuGroup>
    );
    needsSep = true;
  }

  if (canSort) {
    if (needsSep) {
      items.push(<DropdownMenuSeparator key="sep-sort" />);
    }
    needsSep = false;
    items.push(buildSortMenuGroup(column, isSorted));
    needsSep = true;
  }

  if (columnsPinnable && canPin) {
    if (needsSep) {
      items.push(<DropdownMenuSeparator key="sep-pin" />);
    }
    needsSep = false;
    items.push(buildPinMenuGroup(column, isPinned));
    needsSep = true;
  }

  if (columnsMovable && !isPinned) {
    if (needsSep) {
      items.push(<DropdownMenuSeparator key="sep-move" />);
    }
    needsSep = false;
    items.push(buildMoveMenuGroup(moveColumn));
    needsSep = true;
  }

  if (columnsVisibility && visibility) {
    if (needsSep) {
      items.push(<DropdownMenuSeparator key="sep-vis" />);
    }
    items.push(buildVisibilitySubMenu(table));
  }

  return items;
}

function buildSortMenuGroup<TData extends object, TValue>(
  column: Column<TData, TValue>,
  isSorted: false | "asc" | "desc"
) {
  return (
    <DropdownMenuGroup key="sort">
      <DropdownMenuItem
        onClick={() => {
          if (isSorted === "asc") {
            column.clearSorting();
          } else {
            column.toggleSorting(false);
          }
        }}
      >
        {isSorted === "asc" && (
          <HugeiconsIcon
            className="size-4 text-primary opacity-100!"
            icon={Tick02Icon}
          />
        )}
        <HugeiconsIcon className="size-3.5!" icon={ArrowUp02Icon} />
        Asc
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          if (isSorted === "desc") {
            column.clearSorting();
          } else {
            column.toggleSorting(true);
          }
        }}
      >
        {isSorted === "desc" && (
          <HugeiconsIcon
            className="size-4 text-primary opacity-100!"
            icon={Tick02Icon}
          />
        )}
        <HugeiconsIcon className="size-3.5!" icon={ArrowDown02Icon} />
        Desc
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}

function buildPinMenuGroup<TData extends object, TValue>(
  column: Column<TData, TValue>,
  isPinned: false | "left" | "right"
) {
  return (
    <DropdownMenuGroup key="pin">
      <DropdownMenuItem
        onClick={() => column.pin(isPinned === "left" ? false : "left")}
      >
        {isPinned === "left" && (
          <HugeiconsIcon
            className="size-4 text-primary opacity-100!"
            icon={Tick02Icon}
          />
        )}
        <HugeiconsIcon className="size-3.5!" icon={ArrowLeft03Icon} />
        Pin left
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => column.pin(isPinned === "right" ? false : "right")}
      >
        {isPinned === "right" && (
          <HugeiconsIcon
            className="size-4 text-primary opacity-100!"
            icon={Tick02Icon}
          />
        )}
        <HugeiconsIcon className="size-3.5!" icon={ArrowRight03Icon} />
        Pin right
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}

function buildMoveMenuGroup(moveColumn: (direction: "left" | "right") => void) {
  return (
    <DropdownMenuGroup key="move">
      <DropdownMenuItem onClick={() => moveColumn("left")}>
        <HugeiconsIcon className="size-3.5!" icon={ArrowLeft02Icon} />
        Move left
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => moveColumn("right")}>
        <HugeiconsIcon className="size-3.5!" icon={ArrowRight02Icon} />
        Move right
      </DropdownMenuItem>
    </DropdownMenuGroup>
  );
}

function buildVisibilitySubMenu<TData>(table: Table<TData>) {
  return (
    <DropdownMenuSub key="visibility">
      <DropdownMenuSubTrigger>
        <HugeiconsIcon className="size-3.5!" icon={SlidersHorizontalIcon} />
        Columns
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {table
          .getAllColumns()
          .filter((col) => col.getCanHide())
          .map((col) => (
            <DropdownMenuCheckboxItem
              checked={col.getIsVisible()}
              className="capitalize"
              key={col.id}
              onCheckedChange={(val) => col.toggleVisibility(!!val)}
              onSelect={(e) => e.preventDefault()}
            >
              {getColumnHeaderLabel(col)}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

/**
 * Props for {@link DataGridColumnHeader}.
 *
 * @typeParam TData - Row data type.
 * @typeParam TValue - Cell value type.
 */
export interface DataGridColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<"div"> {
  /** The TanStack Table column instance. */
  column: Column<TData, TValue>;
  /** Optional filter node rendered as the first item in the column dropdown. */
  filter?: React.ReactNode;
  /** Optional icon rendered before the title. */
  icon?: React.ReactNode;
  /** Whether pinning is supported (passed through; read from tableLayout). */
  pinnable?: boolean;
  /** Display title; falls back to `meta.headerTitle`, string header, or `column.id`. */
  title?: string;
  /** Whether to include a Columns visibility submenu. Default `false`. */
  visibility?: boolean;
}

function DataGridColumnHeaderInner<TData extends object, TValue>({
  column,
  title,
  icon,
  filter,
  visibility = false,
  className,
}: DataGridColumnHeaderProps<TData, TValue>) {
  const { props, isLoading, table, recordCount } = useDataGrid<TData>();
  const { tableLayout } = props;

  const columnsMovable = tableLayout?.columnsMovable ?? false;
  const columnsVisibility = tableLayout?.columnsVisibility ?? false;
  const columnsPinnable = tableLayout?.columnsPinnable ?? false;
  const columnsResizable = tableLayout?.columnsResizable ?? false;

  const canSort = column.getCanSort();
  const canPin = column.getCanPin();
  const canResize = column.getCanResize();
  const canOrder = column.columnDef.meta?.enableColumnOrdering !== false;
  const isPinned = column.getIsPinned();
  const isSorted = column.getIsSorted();
  const isDisabled = isLoading || recordCount === 0;

  const resolvedTitle = title ?? getColumnHeaderLabel(column);

  const hasControls =
    (columnsMovable && canOrder) ||
    (columnsVisibility && visibility) ||
    (columnsPinnable && canPin) ||
    !!filter;

  function handleSort() {
    if (isSorted === "asc") {
      column.toggleSorting(true);
    } else if (isSorted === "desc") {
      column.clearSorting();
    } else {
      column.toggleSorting(false);
    }
  }

  const moveColumn = useCallback(
    (direction: "left" | "right") => {
      const order = table.getState().columnOrder;
      const idx = order.indexOf(column.id);
      if (idx === -1) {
        return;
      }
      const newOrder = [...order];
      const targetIdx = direction === "left" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= newOrder.length) {
        return;
      }
      const temp = newOrder[idx];
      newOrder[idx] = newOrder[targetIdx] ?? newOrder[idx] ?? "";
      newOrder[targetIdx] = temp ?? "";
      table.setColumnOrder(newOrder);
    },
    [column.id, table]
  );

  const sortIcon = (() => {
    if (isSorted === "asc") {
      return <HugeiconsIcon className="size-3.5" icon={ArrowUp02Icon} />;
    }
    if (isSorted === "desc") {
      return <HugeiconsIcon className="size-3.5" icon={ArrowDown02Icon} />;
    }
    if (canSort) {
      return (
        <HugeiconsIcon
          className="size-3.5"
          icon={ArrowDataTransferVerticalIcon}
        />
      );
    }
    return null;
  })();

  const headerButtonClassName = cn(
    "-ms-2 h-7 gap-1.5 px-2 font-medium text-foreground hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground [&_svg]:opacity-60 [&_svg]:hover:opacity-100"
  );

  const headerLabelClassName = cn(
    "inline-flex h-full items-center gap-1.5 font-medium text-foreground [&_svg]:opacity-60",
    className
  );

  const menuItems = useMemo(
    () =>
      buildColumnHeaderMenuItems({
        filter,
        canSort,
        isSorted,
        column,
        columnsPinnable,
        canPin,
        isPinned,
        columnsMovable: columnsMovable && canOrder,
        moveColumn,
        columnsVisibility,
        visibility,
        table,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      filter,
      canSort,
      isSorted,
      columnsPinnable,
      canPin,
      isPinned,
      columnsMovable,
      canOrder,
      columnsVisibility,
      visibility,
      column,
      table,
      moveColumn,
    ]
  );

  if (hasControls) {
    return (
      <div
        className={cn(
          "flex h-full items-center justify-between gap-1.5",
          className
        )}
        data-slot="data-grid-column-header"
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                className={headerButtonClassName}
                disabled={isDisabled}
                variant="ghost"
              />
            }
          >
            {icon}
            {resolvedTitle}
            {sortIcon}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {menuItems}
          </DropdownMenuContent>
        </DropdownMenu>
        {columnsPinnable && canPin && isPinned && (
          <Button
            className="-me-1 size-7 rounded-md"
            onClick={() => column.pin(false)}
            size="icon-sm"
            variant="ghost"
          >
            <HugeiconsIcon icon={PinOffIcon} />
          </Button>
        )}
      </div>
    );
  }

  if (canSort || (columnsResizable && canResize)) {
    return (
      <div
        className={cn("flex h-full items-center", className)}
        data-slot="data-grid-column-header"
      >
        <Button
          className={headerButtonClassName}
          disabled={isDisabled}
          onClick={handleSort}
          variant="ghost"
        >
          {icon}
          {resolvedTitle}
          {sortIcon}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(headerLabelClassName)}
      data-slot="data-grid-column-header"
    >
      {icon}
      {resolvedTitle}
    </div>
  );
}

/**
 * Column header cell content with sort, pin, move, and visibility controls.
 *
 * Renders as a dropdown menu when any control is active, a click-to-sort
 * button when only sorting/resizing is available, or a plain label otherwise.
 */
export const DataGridColumnHeader = memo(
  DataGridColumnHeaderInner
) as typeof DataGridColumnHeaderInner;

// ---------------------------------------------------------------------------
// DataGridColumnFilter
// ---------------------------------------------------------------------------

/**
 * Props for {@link DataGridColumnFilter}.
 *
 * @typeParam TData - Row data type.
 * @typeParam TValue - Cell value type.
 */
export interface DataGridColumnFilterProps<TData, TValue> {
  /** The TanStack Table column to filter. */
  column?: Column<TData, TValue>;
  /** List of filterable option values. */
  options: {
    /** Display label. */
    label: string;
    /** Filter value matched against `getFacetedUniqueValues`. */
    value: string;
    /** Optional icon component. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  /** Display title for the trigger button and search input placeholder. */
  title?: string;
}

/**
 * A faceted column filter popover with multi-select checkboxes and search.
 *
 * Shows a count badge for selected values and a facet count per option
 * (from `getFacetedUniqueValues`).
 */
export function DataGridColumnFilter<TData, TValue>({
  column,
  title,
  options,
}: DataGridColumnFilterProps<TData, TValue>) {
  const [searchQuery, setSearchQuery] = useState("");

  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(
    column?.getFilterValue() as string[] | undefined
  );

  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [options, searchQuery]
  );

  function toggleOption(value: string) {
    const next = new Set(selectedValues);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    const arr = Array.from(next);
    column?.setFilterValue(arr.length ? arr : undefined);
  }

  function clearFilters() {
    column?.setFilterValue(undefined);
  }

  return (
    <Popover>
      <PopoverTrigger render={<Button size="sm" variant="outline" />}>
        <HugeiconsIcon className="size-4" icon={AddCircleIcon} />
        {title}
        {selectedValues.size > 0 && (
          <>
            <Separator className="mx-2 h-4" orientation="vertical" />
            <Badge
              className="rounded-sm px-1 font-normal lg:hidden"
              variant="secondary"
            >
              {selectedValues.size}
            </Badge>
            <div className="hidden space-x-1 lg:flex">
              {selectedValues.size > 2 ? (
                <Badge
                  className="rounded-sm px-1 font-normal"
                  variant="secondary"
                >
                  {selectedValues.size} selected
                </Badge>
              ) : (
                options
                  .filter((opt) => selectedValues.has(opt.value))
                  .map((opt) => (
                    <Badge
                      className="rounded-sm px-1 font-normal"
                      key={opt.value}
                      variant="secondary"
                    >
                      {opt.label}
                    </Badge>
                  ))
              )}
            </div>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            onValueChange={setSearchQuery}
            placeholder={title}
            value={searchQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                  >
                    <Checkbox
                      aria-hidden="true"
                      checked={isSelected}
                      className="pointer-events-none"
                      tabIndex={-1}
                    />
                    {option.icon && (
                      <option.icon className="size-4 text-muted-foreground" />
                    )}
                    <span className="truncate">{option.label}</span>
                    {facets?.get(option.value) != null && (
                      <span className="ms-auto font-mono text-muted-foreground text-xs tabular-nums">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className="justify-center"
                    onSelect={clearFilters}
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// DataGridColumnVisibility
// ---------------------------------------------------------------------------

/**
 * Column visibility toggle dropdown.
 *
 * Renders a dropdown menu with a checkbox per hideable column. Pass a custom
 * trigger element via the `trigger` prop.
 */
export function DataGridColumnVisibility<TData>({
  table,
  trigger,
}: {
  table: Table<TData>;
  trigger: React.ReactElement<Record<string, unknown>>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent align="end" className="min-w-[150px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-medium">
            Toggle Columns
          </DropdownMenuLabel>
          {table
            .getAllColumns()
            .filter((col) => col.getCanHide())
            .map((col) => (
              <DropdownMenuCheckboxItem
                checked={col.getIsVisible()}
                className="capitalize"
                key={col.id}
                onCheckedChange={(val) => col.toggleVisibility(!!val)}
                onSelect={(e) => e.preventDefault()}
              >
                {getColumnHeaderLabel(col)}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------
// DataGridTableVirtual
// ---------------------------------------------------------------------------

/**
 * Scroll elements exposed to the virtualizer configuration callback.
 */
export type DataGridTableVirtualScrollElements = {
  /** The `DataGridTableViewport` DOM node. */
  containerElement: HTMLElement | null;
  /** The ancestor scroll area viewport (or the container itself when self-contained). */
  scrollElement: HTMLElement | null;
};

/**
 * Extended virtualizer options that accept row-aware callbacks.
 *
 * @typeParam TData - Row data type.
 */
export type DataGridTableVirtualizerOptions<TData> = Omit<
  VirtualizerOptions<HTMLElement, HTMLTableRowElement>,
  "count" | "estimateSize" | "getItemKey" | "getScrollElement"
> & {
  /** Row-aware size estimator. */
  estimateSize?: (index: number, row: Row<TData>) => number;
  /** Row-aware key derivation. */
  getItemKey?: (index: number, row: Row<TData>) => string | number;
  /** Custom scroll element resolver. */
  getScrollElement?: (
    elements: DataGridTableVirtualScrollElements
  ) => HTMLElement | null;
};

/**
 * Props for {@link DataGridTableVirtual}.
 *
 * @typeParam TData - Row data type.
 */
export interface DataGridTableVirtualProps<TData> {
  /** Estimated row height in px. Default `48`. */
  estimateSize?: number;
  /** Number of items from the end to trigger `onFetchMore`. Default `0`. */
  fetchMoreOffset?: number;
  /** Footer content. */
  footerContent?: React.ReactNode;
  /** `false` = all loaded; `true` / `undefined` = more available. */
  hasMore?: boolean;
  /** Fixed height for a self-contained scroll container. */
  height?: number | string;
  /** Whether a fetch is in progress (disables duplicate fetches). Default `false`. */
  isFetchingMore?: boolean;
  /** If provided, enables infinite scroll mode. */
  onFetchMore?: () => void;
  /** Number of rows to render outside the visible area. Default `10`. */
  overscan?: number;
  /** Whether to render the header. Default `true`. */
  renderHeader?: boolean;
  /** Advanced virtualizer options. */
  virtualizerOptions?: DataGridTableVirtualizerOptions<TData>;
}

function DataGridTableVirtualBody<TData extends object>({
  table: _table,
  topRows,
  centerRows,
  bottomRows,
  totalRows,
  virtualItems,
  totalSize,
  measureRowRef,
  isInfiniteMode,
  isFetchingMore,
  hasMore,
  fetchingMoreMessage,
  allRowsLoadedMessage,
  columnCount,
}: {
  table: Table<TData>;
  topRows: Row<TData>[];
  centerRows: Row<TData>[];
  bottomRows: Row<TData>[];
  totalRows: number;
  virtualItems: VirtualItem[];
  totalSize: number;
  measureRowRef?: ((el: HTMLTableRowElement | null) => void) | null;
  isInfiniteMode: boolean;
  isFetchingMore?: boolean;
  hasMore?: boolean;
  fetchingMoreMessage?: React.ReactNode | string;
  allRowsLoadedMessage?: React.ReactNode | string;
  columnCount: number;
}) {
  if (totalRows === 0) {
    return <DataGridTableEmpty />;
  }

  const leadingHeight =
    virtualItems.length > 0 ? (virtualItems.at(0)?.start ?? 0) : 0;
  const lastVirtual = virtualItems.at(-1);
  const trailingHeight =
    virtualItems.length > 0 && lastVirtual
      ? totalSize - (lastVirtual.start ?? 0) - (lastVirtual.size ?? 0)
      : totalSize;

  return (
    <>
      {topRows.map((row, i) => (
        <DataGridTableRenderedRow
          key={row.id}
          pinnedBoundary={i === topRows.length - 1 ? "top" : undefined}
          row={row}
        />
      ))}

      {leadingHeight > 0 && (
        <tr aria-hidden data-slot="data-grid-virtual-spacer-top">
          <td
            colSpan={columnCount}
            style={{ height: leadingHeight, padding: 0 }}
          />
        </tr>
      )}

      {virtualItems.map((virtualItem) => {
        const row = centerRows[virtualItem.index];
        if (!row) {
          return null;
        }
        return (
          <DataGridTableRenderedRow
            key={row.id}
            row={row}
            rowRef={measureRowRef ?? undefined}
          />
        );
      })}

      {trailingHeight > 0 && (
        <tr aria-hidden data-slot="data-grid-virtual-spacer-bottom">
          <td
            colSpan={columnCount}
            style={{ height: trailingHeight, padding: 0 }}
          />
        </tr>
      )}

      {isInfiniteMode && isFetchingMore && (
        <tr data-slot="data-grid-virtual-status-loading">
          <td
            className="py-4 text-center text-muted-foreground text-sm"
            colSpan={columnCount}
          >
            <div className="flex items-center justify-center gap-2">
              <Spinner className="size-4 opacity-60" />
              {fetchingMoreMessage ?? "Loading more…"}
            </div>
          </td>
        </tr>
      )}

      {isInfiniteMode && hasMore === false && (
        <tr data-slot="data-grid-virtual-status-complete">
          <td
            className="py-4 text-center text-muted-foreground text-sm"
            colSpan={columnCount}
          >
            {allRowsLoadedMessage ?? "All rows loaded"}
          </td>
        </tr>
      )}

      {bottomRows.map((row, i) => (
        <DataGridTableRenderedRow
          key={row.id}
          pinnedBoundary={i === 0 ? "bottom" : undefined}
          row={row}
        />
      ))}
    </>
  );
}

const MemoizedVirtualBody = memo(
  DataGridTableVirtualBody,
  (_prev, next) =>
    !!(next.table as Table<unknown>).getState().columnSizingInfo
      .isResizingColumn
) as typeof DataGridTableVirtualBody;

/**
 * Virtualised DataGrid table with optional infinite-scroll support.
 *
 * When `onFetchMore` is provided, an infinite-scroll trigger fires when the
 * last visible row is within `fetchMoreOffset` items of the end. Wrap in
 * {@link DataGridScrollArea} or pass `height` for a self-contained container.
 */
export function DataGridTableVirtual<TData extends object>({
  height,
  estimateSize: estimateSizeProp = 48,
  overscan = 10,
  footerContent,
  renderHeader = true,
  onFetchMore,
  isFetchingMore = false,
  hasMore,
  fetchMoreOffset = 0,
  virtualizerOptions,
}: DataGridTableVirtualProps<TData>) {
  const { props, table } = useDataGrid<TData>();
  const { tableLayout } = props;

  const { topRows, centerRows, bottomRows } = getDataGridTableRowSections(
    table,
    tableLayout?.rowsPinnable
  );

  const [viewportElements, setViewportElements] =
    useState<DataGridTableVirtualScrollElements>({
      containerElement: null,
      scrollElement: null,
    });

  const handleViewportRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) {
      return;
    }
    const scrollEl =
      el.closest<HTMLElement>('[data-slot="scroll-area-viewport"]') ?? el;
    setViewportElements({ containerElement: el, scrollElement: scrollEl });
  }, []);

  const usesExternalScrollArea =
    viewportElements.scrollElement !== null &&
    viewportElements.scrollElement !== viewportElements.containerElement;

  const resolveScrollElement = useCallback((): HTMLElement | null => {
    if (virtualizerOptions?.getScrollElement) {
      return virtualizerOptions.getScrollElement(viewportElements);
    }
    return viewportElements.scrollElement;
  }, [viewportElements, virtualizerOptions]);

  const resolveEstimateSize = useCallback(
    (index: number): number => {
      if (virtualizerOptions?.estimateSize) {
        const row = centerRows[index];
        if (row) {
          return virtualizerOptions.estimateSize(index, row);
        }
      }
      return estimateSizeProp;
    },
    [centerRows, estimateSizeProp, virtualizerOptions]
  );

  const resolveItemKey = useCallback(
    (index: number): string | number => {
      if (virtualizerOptions?.getItemKey) {
        const row = centerRows[index];
        if (row) {
          return virtualizerOptions.getItemKey(index, row);
        }
      }
      const row = centerRows[index];
      return row ? row.id : index;
    },
    [centerRows, virtualizerOptions]
  );

  const {
    estimateSize: _es,
    getItemKey: _gik,
    getScrollElement: _gse,
    ...restOptions
  } = virtualizerOptions ?? {};

  const virtualizer = useVirtualizer({
    count: centerRows.length,
    getScrollElement: resolveScrollElement,
    estimateSize: resolveEstimateSize,
    getItemKey: resolveItemKey,
    overscan,
    ...(restOptions as Partial<
      VirtualizerOptions<HTMLElement, HTMLTableRowElement>
    >),
  });

  const virtualItems = virtualizer.getVirtualItems();
  const resolvedFetchMoreOffset = Math.max(0, fetchMoreOffset);
  const isInfiniteMode = !!onFetchMore;

  useEffect(() => {
    if (
      !(isInfiniteMode && virtualItems.length) ||
      hasMore === false ||
      isFetchingMore
    ) {
      return;
    }
    const lastItem = virtualItems.at(-1);
    if (!lastItem) {
      return;
    }
    if (lastItem.index >= centerRows.length - 1 - resolvedFetchMoreOffset) {
      onFetchMore();
    }
  }, [
    virtualItems,
    centerRows.length,
    resolvedFetchMoreOffset,
    isInfiniteMode,
    hasMore,
    isFetchingMore,
    onFetchMore,
  ]);

  const visibleColumns = table.getVisibleLeafColumns();
  const columnCount =
    visibleColumns.length + (tableLayout?.columnsResizable ? 1 : 0);

  const viewportStyle: React.CSSProperties = usesExternalScrollArea
    ? {}
    : {
        height,
        overflow: "auto",
        position: "relative",
      };

  return (
    <DataGridTableViewport
      className={usesExternalScrollArea ? undefined : "block"}
      style={viewportStyle}
      viewportRef={handleViewportRef}
    >
      <DataGridTableBase>
        {renderHeader && (
          <DataGridTableHead>
            {table.getHeaderGroups().map((hg) => (
              <DataGridTableHeadRow headerGroup={hg} key={hg.id}>
                {hg.headers.map((header) => (
                  <DataGridTableHeadRowCell header={header} key={header.id}>
                    {renderHeaderCellContent(header, tableLayout)}
                  </DataGridTableHeadRowCell>
                ))}
                {tableLayout?.columnsResizable && <DataGridTableFillHeadCell />}
              </DataGridTableHeadRow>
            ))}
          </DataGridTableHead>
        )}
        {renderHeader && (tableLayout?.stripped || !tableLayout?.rowBorder) && (
          <DataGridTableRowSpacer />
        )}
        <DataGridTableBody>
          <MemoizedVirtualBody
            allRowsLoadedMessage={props.allRowsLoadedMessage}
            bottomRows={bottomRows}
            centerRows={centerRows}
            columnCount={columnCount}
            fetchingMoreMessage={props.fetchingMoreMessage}
            hasMore={hasMore}
            isFetchingMore={isFetchingMore}
            isInfiniteMode={isInfiniteMode}
            measureRowRef={null}
            table={table}
            topRows={topRows}
            totalRows={topRows.length + centerRows.length + bottomRows.length}
            totalSize={virtualizer.getTotalSize()}
            virtualItems={virtualizer.getVirtualItems()}
          />
        </DataGridTableBody>
        {footerContent && (
          <DataGridTableFoot>{footerContent}</DataGridTableFoot>
        )}
      </DataGridTableBase>
    </DataGridTableViewport>
  );
}

// ---------------------------------------------------------------------------
// DataGridTableDnd (column DnD)
// ---------------------------------------------------------------------------

function DataGridTableDndHeader<TData extends object>({
  header,
}: {
  header: Header<TData, unknown>;
}) {
  const { props } = useDataGrid<TData>();
  const { tableLayout } = props;
  const column = header.column;

  const canOrder = column.columnDef.meta?.enableColumnOrdering !== false;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const dndStyle: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <DataGridTableHeadRowCell
      dndRef={setNodeRef}
      dndStyle={dndStyle}
      header={header}
    >
      <div className="flex items-center justify-start gap-0.5">
        {canOrder && (
          <Button
            className={cn(
              "-ms-2 size-6",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            size="icon-sm"
            variant="ghost"
            {...attributes}
            {...listeners}
          >
            <HugeiconsIcon
              className="opacity-60 hover:opacity-100"
              icon={DragDropVerticalIcon}
            />
          </Button>
        )}
        <span className="grow truncate">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {tableLayout?.columnsResizable && column.getCanResize() && (
          <DataGridTableHeadRowCellResize header={header} />
        )}
      </div>
    </DataGridTableHeadRowCell>
  );
}

function DataGridTableDndCell<TData>({ cell }: { cell: Cell<TData, unknown> }) {
  const { setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
  });

  const dndStyle: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <DataGridTableBodyRowCell
      cell={cell}
      dndRef={setNodeRef}
      dndStyle={dndStyle}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </DataGridTableBodyRowCell>
  );
}

/**
 * DataGrid table with column drag-to-reorder.
 *
 * Uses dnd-kit's `DndContext` + `SortableContext` with
 * `horizontalListSortingStrategy`. Pass `handleDragEnd` to update
 * `columnOrder` state (typically via `arrayMove`).
 */

function renderDndColumnBodyRows<TData extends object>({
  isLoading,
  loadingMode,
  pageSize,
  visibleColumns,
  rows,
  orderableIds,
}: {
  isLoading: boolean;
  loadingMode: "skeleton" | "spinner" | undefined;
  pageSize: number;
  visibleColumns: Column<TData>[];
  rows: Row<TData>[];
  orderableIds: string[];
}) {
  if (isLoading && loadingMode === "skeleton") {
    return Array.from({ length: pageSize }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no id
      <DataGridTableBodyRowSkeleton key={i}>
        {visibleColumns.map((col) => (
          <DataGridTableBodyRowSkeletonCell column={col} key={col.id}>
            {col.columnDef.meta?.skeleton ?? (
              <Skeleton className="h-4 w-full" />
            )}
          </DataGridTableBodyRowSkeletonCell>
        ))}
      </DataGridTableBodyRowSkeleton>
    ));
  }
  if (rows.length === 0) {
    return <DataGridTableEmpty />;
  }
  return rows.map((row) => (
    <React.Fragment key={row.id}>
      <DataGridTableBodyRow row={row}>
        <SortableContext
          items={orderableIds}
          strategy={horizontalListSortingStrategy}
        >
          {row.getVisibleCells().map((cell) => (
            <DataGridTableDndCell cell={cell} key={cell.id} />
          ))}
        </SortableContext>
      </DataGridTableBodyRow>
      {row.getIsExpanded() && <DataGridTableBodyRowExpanded row={row} />}
    </React.Fragment>
  ));
}

/**
 * DataGrid table with column drag-to-reorder.
 *
 * Uses dnd-kit's `DndContext` + `SortableContext` with
 * `horizontalListSortingStrategy`. Pass `handleDragEnd` to update
 * `columnOrder` state (typically via `arrayMove`).
 */
export function DataGridTableDnd<TData extends object>({
  handleDragEnd,
  footerContent,
}: {
  handleDragEnd: (event: DragEndEvent) => void;
  footerContent?: React.ReactNode;
}) {
  const { props, table, isLoading } = useDataGrid<TData>();
  const { tableLayout } = props;

  const dndId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingColumn, setIsDraggingColumn] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!isDraggingColumn) {
      return;
    }
    document.body.style.cursor = "grabbing";
    document.documentElement.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = "";
      document.documentElement.style.cursor = "";
    };
  }, [isDraggingColumn]);

  const restrictToTableBounds: Modifier = ({ transform, draggingNodeRect }) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!(containerRect && draggingNodeRect)) {
      return transform;
    }
    const minX = containerRect.left - draggingNodeRect.left;
    const maxX =
      containerRect.right - draggingNodeRect.left - draggingNodeRect.width;
    return {
      ...transform,
      x: Math.min(Math.max(transform.x, minX), maxX),
      y: 0,
    };
  };

  const rows = table.getRowModel().rows;
  const pageSize = table.getState().pagination.pageSize;
  const visibleColumns = table.getVisibleLeafColumns();
  // Only orderable columns participate in dnd-kit's SortableContext so
  // anchored columns (selection, row actions) can never become drop targets.
  const orderableIds = visibleColumns
    .filter((col) => col.columnDef.meta?.enableColumnOrdering !== false)
    .map((col) => col.id);

  return (
    <DndContext
      collisionDetection={closestCenter}
      id={dndId}
      modifiers={[restrictToTableBounds]}
      onDragCancel={() => setIsDraggingColumn(false)}
      onDragEnd={(e) => {
        setIsDraggingColumn(false);
        handleDragEnd(e);
      }}
      onDragStart={() => setIsDraggingColumn(true)}
      sensors={sensors}
    >
      <DataGridTableViewport
        className={cn(
          "relative",
          isDraggingColumn && "cursor-grabbing [&_*]:cursor-grabbing!"
        )}
        viewportRef={containerRef}
      >
        <DataGridTableBase>
          <DataGridTableHead>
            {table.getHeaderGroups().map((hg) => (
              <DataGridTableHeadRow headerGroup={hg} key={hg.id}>
                <SortableContext
                  items={orderableIds}
                  strategy={horizontalListSortingStrategy}
                >
                  {hg.headers.map((header) => (
                    <DataGridTableDndHeader header={header} key={header.id} />
                  ))}
                </SortableContext>
              </DataGridTableHeadRow>
            ))}
          </DataGridTableHead>
          {(tableLayout?.stripped || !tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}
          <DataGridTableBody>
            {renderDndColumnBodyRows({
              isLoading,
              loadingMode: props.loadingMode,
              pageSize,
              visibleColumns,
              rows,
              orderableIds,
            })}
          </DataGridTableBody>
          {footerContent && (
            <DataGridTableFoot>{footerContent}</DataGridTableFoot>
          )}
        </DataGridTableBase>
      </DataGridTableViewport>
    </DndContext>
  );
}

// ---------------------------------------------------------------------------
// DataGridTableDndRows (row DnD)
// ---------------------------------------------------------------------------

// Internal context — not exported
const SortableRowContext = createContext<
  Pick<ReturnType<typeof useSortable>, "attributes" | "listeners"> | undefined
>(undefined);

function DataGridTableDndRow<TData extends object>({
  row,
}: {
  row: Row<TData>;
}) {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({ id: row.id });

  const dndStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: isDragging ? "relative" : undefined,
    cursor: isDragging ? "grabbing" : undefined,
  };

  return (
    <SortableRowContext.Provider value={{ attributes, listeners }}>
      <DataGridTableBodyRow dndRef={setNodeRef} dndStyle={dndStyle} row={row}>
        {row.getVisibleCells().map((cell) => (
          <DataGridTableBodyRowCell cell={cell} key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </DataGridTableBodyRowCell>
        ))}
      </DataGridTableBodyRow>
    </SortableRowContext.Provider>
  );
}

/**
 * Drag handle button for row DnD. Place inside a cell renderer.
 *
 * Must be rendered inside a row rendered by {@link DataGridTableDndRows}.
 */
export function DataGridTableDndRowHandle({
  className,
}: {
  className?: string;
}) {
  const ctx = useContext(SortableRowContext);

  return (
    <Button
      className={cn(
        "size-7 cursor-grab opacity-70 hover:bg-transparent hover:opacity-100 active:cursor-grabbing",
        className
      )}
      disabled={!ctx}
      size="icon-sm"
      variant="ghost"
      {...(ctx?.attributes ?? {})}
      {...(ctx?.listeners ?? {})}
    >
      <HugeiconsIcon icon={DragDropHorizontalIcon} />
    </Button>
  );
}

function renderDndRowBodyRows<TData extends object>({
  isLoading,
  loadingMode,
  pageSize,
  visibleColumns,
  rows,
  dataIds,
}: {
  isLoading: boolean;
  loadingMode: "skeleton" | "spinner" | undefined;
  pageSize: number;
  visibleColumns: Column<TData>[];
  rows: Row<TData>[];
  dataIds: UniqueIdentifier[];
}) {
  if (isLoading && loadingMode === "skeleton") {
    return Array.from({ length: pageSize }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no id
      <DataGridTableBodyRowSkeleton key={i}>
        {visibleColumns.map((col) => (
          <DataGridTableBodyRowSkeletonCell column={col} key={col.id}>
            {col.columnDef.meta?.skeleton ?? (
              <Skeleton className="h-4 w-full" />
            )}
          </DataGridTableBodyRowSkeletonCell>
        ))}
      </DataGridTableBodyRowSkeleton>
    ));
  }
  if (rows.length === 0) {
    return <DataGridTableEmpty />;
  }
  return (
    <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
      {rows.map((row) => (
        <DataGridTableDndRow key={row.id} row={row} />
      ))}
    </SortableContext>
  );
}

/**
 * DataGrid table with row drag-to-reorder.
 *
 * Uses dnd-kit with `verticalListSortingStrategy`. Pass `dataIds` (ordered row
 * IDs) and `handleDragEnd` to manage row order state.
 */
export function DataGridTableDndRows<TData extends object>({
  handleDragEnd,
  dataIds,
  footerContent,
}: {
  handleDragEnd: (event: DragEndEvent) => void;
  dataIds: UniqueIdentifier[];
  footerContent?: React.ReactNode;
}) {
  const { props, table, isLoading } = useDataGrid<TData>();
  const { tableLayout } = props;

  const dndId = useId();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingRow, setIsDraggingRow] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!isDraggingRow) {
      return;
    }
    document.body.style.cursor = "grabbing";
    document.documentElement.style.cursor = "grabbing";
    return () => {
      document.body.style.cursor = "";
      document.documentElement.style.cursor = "";
    };
  }, [isDraggingRow]);

  // Inline restrictToVerticalAxis (no @dnd-kit/modifiers dependency)
  const restrictToVerticalAxis: Modifier = ({ transform }) => ({
    ...transform,
    x: 0,
  });

  const restrictToTableContainer: Modifier = ({
    transform,
    draggingNodeRect,
  }) => {
    const containerRect = tableContainerRef.current?.getBoundingClientRect();
    if (!(containerRect && draggingNodeRect)) {
      return transform;
    }
    const minX = containerRect.left - draggingNodeRect.left;
    const maxX = containerRect.right - draggingNodeRect.right;
    const minY = containerRect.top - draggingNodeRect.top;
    const maxY = containerRect.bottom - draggingNodeRect.bottom;
    const clamp = (v: number, lo: number, hi: number) =>
      Math.min(Math.max(v, lo), hi);
    return {
      ...transform,
      x: clamp(transform.x, minX, maxX),
      y: clamp(transform.y, minY, maxY),
    };
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: inline modifiers are stable referentially
  const modifiers = useMemo(
    () => [restrictToVerticalAxis, restrictToTableContainer],
    []
  );

  const rows = table.getRowModel().rows;
  const pageSize = table.getState().pagination.pageSize;
  const visibleColumns = table.getVisibleLeafColumns();

  return (
    <DndContext
      collisionDetection={closestCenter}
      id={dndId}
      modifiers={modifiers}
      onDragCancel={() => setIsDraggingRow(false)}
      onDragEnd={(e) => {
        setIsDraggingRow(false);
        handleDragEnd(e);
      }}
      onDragStart={() => setIsDraggingRow(true)}
      sensors={sensors}
    >
      <DataGridTableViewport
        className={cn(
          "relative",
          isDraggingRow && "cursor-grabbing [&_*]:cursor-grabbing!"
        )}
        viewportRef={tableContainerRef}
      >
        <DataGridTableBase>
          <DataGridTableHead>
            {table.getHeaderGroups().map((hg) => (
              <DataGridTableHeadRow headerGroup={hg} key={hg.id}>
                {hg.headers.map((header) => (
                  <DataGridTableHeadRowCell header={header} key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {tableLayout?.columnsResizable &&
                      header.column.getCanResize() && (
                        <DataGridTableHeadRowCellResize header={header} />
                      )}
                  </DataGridTableHeadRowCell>
                ))}
              </DataGridTableHeadRow>
            ))}
          </DataGridTableHead>
          {(tableLayout?.stripped || !tableLayout?.rowBorder) && (
            <DataGridTableRowSpacer />
          )}
          <DataGridTableBody>
            {renderDndRowBodyRows({
              isLoading,
              loadingMode: props.loadingMode,
              pageSize,
              visibleColumns,
              rows,
              dataIds,
            })}
          </DataGridTableBody>
          {footerContent && (
            <DataGridTableFoot>{footerContent}</DataGridTableFoot>
          )}
        </DataGridTableBase>
      </DataGridTableViewport>
    </DndContext>
  );
}
