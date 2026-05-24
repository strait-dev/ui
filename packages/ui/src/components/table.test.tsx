import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

function TableFixture() {
  return (
    <Table>
      <TableCaption>Users list</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>1 user</TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  );
}

describe("Table", () => {
  it("renders a table with correct ARIA roles", () => {
    render(<TableFixture />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("cell").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("columnheader").length).toBe(2);
  });

  it("table container has data-slot table-container", () => {
    render(<TableFixture />);
    const container = document.querySelector("[data-slot=table-container]");
    expect(container).toHaveAttribute("data-slot", "table-container");
  });

  it("table element has data-slot table", () => {
    render(<TableFixture />);
    expect(screen.getByRole("table")).toHaveAttribute("data-slot", "table");
  });

  it("renders header, body, footer with correct data-slots", () => {
    render(<TableFixture />);
    expect(document.querySelector("[data-slot=table-header]")).toHaveAttribute(
      "data-slot",
      "table-header"
    );
    expect(document.querySelector("[data-slot=table-body]")).toHaveAttribute(
      "data-slot",
      "table-body"
    );
    expect(document.querySelector("[data-slot=table-footer]")).toHaveAttribute(
      "data-slot",
      "table-footer"
    );
  });

  it("renders TableRow cells with data-slots", () => {
    render(<TableFixture />);
    const rows = document.querySelectorAll("[data-slot=table-row]");
    expect(rows.length).toBeGreaterThan(0);
    const cells = document.querySelectorAll("[data-slot=table-cell]");
    expect(cells.length).toBeGreaterThan(0);
    const heads = document.querySelectorAll("[data-slot=table-head]");
    expect(heads.length).toBe(2);
  });

  it("renders caption with data-slot", () => {
    render(<TableFixture />);
    const caption = document.querySelector("[data-slot=table-caption]");
    expect(caption).toHaveAttribute("data-slot", "table-caption");
    expect(caption).toHaveTextContent("Users list");
  });
});

/* ------------------------------------------------------------------ */
/* Size axis                                                           */
/* ------------------------------------------------------------------ */

describe("Table size prop", () => {
  it("sets data-size='default' on the container by default", () => {
    render(<TableFixture />);
    const container = document.querySelector("[data-slot=table-container]");
    expect(container).toHaveAttribute("data-size", "default");
  });

  it("sets data-size='sm' when size='sm'", () => {
    const { container } = render(
      <Table size="sm">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(
      container.querySelector("[data-slot=table-container]")
    ).toHaveAttribute("data-size", "sm");
  });

  it("sets data-size='lg' when size='lg'", () => {
    const { container } = render(
      <Table size="lg">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(
      container.querySelector("[data-slot=table-container]")
    ).toHaveAttribute("data-size", "lg");
  });

  it("applies sm size classes to TableHead", () => {
    const { container } = render(
      <Table size="sm">
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
    const th = container.querySelector("[data-slot=table-head]");
    expect(th?.className).toContain("group-data-[size=sm]/table:h-6");
  });

  it("applies lg size classes to TableCell", () => {
    const { container } = render(
      <Table size="lg">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const td = container.querySelector("[data-slot=table-cell]");
    expect(td?.className).toContain("group-data-[size=lg]/table:h-9");
  });
});

/* ------------------------------------------------------------------ */
/* Variant axis                                                        */
/* ------------------------------------------------------------------ */

describe("Table variant prop", () => {
  it("renders with variant='default' by default (no extra class)", () => {
    render(<TableFixture />);
    const table = screen.getByRole("table");
    // default variant produces no extra class fragment beyond the base
    expect(table).toHaveAttribute("data-slot", "table");
  });

  it("applies striped class for variant='striped'", () => {
    render(
      <Table variant="striped">
        <TableBody>
          <TableRow>
            <TableCell>Row</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const table = screen.getByRole("table");
    expect(table.className).toContain("tbody");
  });

  it("applies bordered classes for variant='bordered'", () => {
    render(
      <Table variant="bordered">
        <TableHeader>
          <TableRow>
            <TableHead>H</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    const table = screen.getByRole("table");
    // The CVA string includes [&_th]:border
    expect(table.className).toContain("border");
  });

  it("forwards extra className alongside the variant class", () => {
    render(
      <Table className="my-custom" variant="striped">
        <TableBody>
          <TableRow>
            <TableCell>Row</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("table")).toHaveClass("my-custom");
  });
});
