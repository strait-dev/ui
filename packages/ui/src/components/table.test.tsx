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
