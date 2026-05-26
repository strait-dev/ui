import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  type Table,
  useReactTable,
} from "@tanstack/react-table";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { Button } from "./button";
import {
  DataGrid,
  DataGridColumnVisibility,
  DataGridContainer,
  DataGridPagination,
  DataGridSelectionBar,
  DataGridTable,
  DataGridTableRowActions,
  DataGridTableRowSelect,
  getColumnHeaderLabel,
} from "./data-grid";
import { DropdownMenuItem } from "./dropdown-menu";

type Row = { id: string; name: string; budget: number };

const rows: Row[] = [
  { id: "1", name: "Alpha", budget: 100 },
  { id: "2", name: "Beta", budget: 200 },
  { id: "3", name: "Gamma", budget: 300 },
];

const columns: ColumnDef<Row>[] = [
  { accessorKey: "name", header: "Name", meta: { headerTitle: "Name" } },
  { accessorKey: "budget", header: "Budget" },
];

beforeAll(() => {
  // jsdom shims for Base UI / virtual / scroll-area primitives.
  if (typeof globalThis.ResizeObserver === "undefined") {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
  if (typeof globalThis.IntersectionObserver === "undefined") {
    globalThis.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
      root = null;
      rootMargin = "";
      thresholds = [];
    } as unknown as typeof IntersectionObserver;
  }
  if (typeof window !== "undefined" && !window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
  if (typeof Element !== "undefined") {
    Element.prototype.scrollIntoView ||= () => {};
    const proto = Element.prototype as unknown as {
      getAnimations?: () => Animation[];
    };
    proto.getAnimations ||= () => [];
  }
});

function Grid({
  data = rows,
  cols = columns,
  isLoading,
  loadingMode,
  emptyMessage,
}: {
  data?: Row[];
  cols?: ColumnDef<Row>[];
  isLoading?: boolean;
  loadingMode?: "skeleton" | "spinner";
  emptyMessage?: string;
}) {
  const table = useReactTable({
    data,
    columns: cols,
    getCoreRowModel: getCoreRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });
  return (
    <DataGrid
      emptyMessage={emptyMessage}
      isLoading={isLoading}
      loadingMode={loadingMode}
      recordCount={data.length}
      table={table}
    >
      <DataGridContainer>
        <DataGridTable />
      </DataGridContainer>
    </DataGrid>
  );
}

describe("DataGrid", () => {
  it("renders a table with the data-grid-table slot and provided rows", () => {
    render(<Grid />);
    expect(
      document.querySelector('[data-slot="data-grid-table"]')
    ).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("renders headers from column definitions", () => {
    render(<Grid />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Budget")).toBeInTheDocument();
  });

  it("shows the empty-state row when there are no rows", () => {
    render(<Grid data={[]} emptyMessage="Nothing here yet" />);
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="data-grid-table-empty"]')
    ).toBeInTheDocument();
  });

  it("renders skeleton rows when isLoading + loadingMode='skeleton'", () => {
    render(<Grid data={[]} isLoading loadingMode="skeleton" />);
    expect(
      document.querySelectorAll(
        '[data-slot="data-grid-table-body-row-skeleton"]'
      ).length
    ).toBeGreaterThan(0);
  });
});

describe("DataGridContainer", () => {
  it("renders a bordered wrapper with the data-grid slot", () => {
    render(
      <DataGridContainer>
        <span>child</span>
      </DataGridContainer>
    );
    const root = document.querySelector('[data-slot="data-grid"]');
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("border");
  });

  it("omits the border when border=false", () => {
    render(
      <DataGridContainer border={false}>
        <span>child</span>
      </DataGridContainer>
    );
    expect(document.querySelector('[data-slot="data-grid"]')).not.toHaveClass(
      "border"
    );
  });
});

describe("DataGridColumnVisibility", () => {
  function VisibilityHarness() {
    const table: Table<Row> = useReactTable({
      data: rows,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid recordCount={rows.length} table={table}>
        <DataGridColumnVisibility
          table={table}
          trigger={<Button variant="outline">Columns</Button>}
        />
      </DataGrid>
    );
  }

  it("renders a trigger that opens the visibility menu", () => {
    render(<VisibilityHarness />);
    expect(screen.getByRole("button", { name: "Columns" })).toBeInTheDocument();
  });
});

describe("DataGridPagination", () => {
  function PaginationHarness() {
    const table = useReactTable({
      data: rows,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      initialState: { pagination: { pageSize: 2 } },
    });
    return (
      <DataGrid recordCount={rows.length} table={table}>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridPagination />
      </DataGrid>
    );
  }

  it("renders the pagination slot and the rows-per-page label", () => {
    render(<PaginationHarness />);
    expect(
      document.querySelector('[data-slot="data-grid-pagination"]')
    ).toBeInTheDocument();
    expect(screen.getByText("Rows per page")).toBeInTheDocument();
  });

  it("advances to the next page when the next button is clicked", () => {
    render(<PaginationHarness />);
    const next = screen.getByRole("button", { name: "Go to next page" });
    fireEvent.click(next);
    // After advancing, the third row should be visible.
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });
});

describe("DataGridTableRowActions", () => {
  function ActionsHarness() {
    const table = useReactTable({
      data: rows,
      columns: [
        ...columns,
        {
          id: "actions",
          header: () => null,
          cell: ({ row }) => (
            <DataGridTableRowActions row={row}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DataGridTableRowActions>
          ),
        },
      ],
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid recordCount={rows.length} table={table}>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
      </DataGrid>
    );
  }

  it("renders one trigger per row with the data-grid-row-actions slot", () => {
    render(<ActionsHarness />);
    const triggers = document.querySelectorAll(
      '[data-slot="data-grid-row-actions"]'
    );
    expect(triggers.length).toBe(rows.length);
    expect(triggers[0]).toHaveAttribute("aria-label", "Row actions");
  });

  it("opens the dropdown menu when its trigger is clicked", () => {
    render(<ActionsHarness />);
    const trigger = document.querySelector<HTMLButtonElement>(
      '[data-slot="data-grid-row-actions"]'
    );
    expect(trigger).not.toBeNull();
    fireEvent.click(trigger as HTMLButtonElement);
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});

describe("DataGridSelectionBar", () => {
  function SelectionHarness() {
    const table = useReactTable({
      data: rows,
      columns: [
        {
          id: "select",
          header: () => null,
          cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        },
        ...columns,
      ],
      enableRowSelection: true,
      getRowId: (row) => row.id,
      getCoreRowModel: getCoreRowModel(),
    });
    return (
      <DataGrid recordCount={rows.length} table={table}>
        <DataGridContainer>
          <DataGridTable />
        </DataGridContainer>
        <DataGridSelectionBar
          actions={[{ label: "Archive", onClick: () => {} }]}
        />
      </DataGrid>
    );
  }

  it("does not render the toolbar while nothing is selected", () => {
    render(<SelectionHarness />);
    expect(
      document.querySelector('[data-slot="bulk-action-bar"]')
    ).not.toBeInTheDocument();
  });

  it("renders the toolbar with a selected count once a row is selected", () => {
    render(<SelectionHarness />);
    const checkbox = screen.getAllByLabelText("Select row")[0];
    fireEvent.click(checkbox as HTMLElement);
    expect(
      document.querySelector('[data-slot="bulk-action-bar"]')
    ).toBeInTheDocument();
    expect(screen.getByText("1 selected")).toBeInTheDocument();
  });

  it("clears the selection when the clear button is pressed", () => {
    render(<SelectionHarness />);
    const checkbox = screen.getAllByLabelText("Select row")[0];
    fireEvent.click(checkbox as HTMLElement);
    expect(screen.getByText("1 selected")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(
      document.querySelector('[data-slot="bulk-action-bar"]')
    ).not.toBeInTheDocument();
  });
});

describe("getColumnHeaderLabel", () => {
  it("prefers meta.headerTitle, then a string header, then the column id", () => {
    let labels: string[] = [];
    function Probe() {
      const table = useReactTable({
        data: rows,
        columns: [
          {
            accessorKey: "name",
            header: "Name",
            meta: { headerTitle: "Title" },
          },
          { accessorKey: "budget", header: "Budget" },
          { id: "raw", header: () => null },
        ],
        getCoreRowModel: getCoreRowModel(),
      });
      labels = table.getAllColumns().map((c) => getColumnHeaderLabel(c));
      return null;
    }
    render(<Probe />);
    expect(labels).toEqual(["Title", "Budget", "raw"]);
  });
});
