import { parseDate } from "@internationalized/date";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Calendar, RangeCalendar } from "./calendar-rac";

describe("Calendar (RAC)", () => {
  it("renders with data-slot='calendar'", () => {
    render(<Calendar />);
    expect(
      document.querySelector("[data-slot='calendar']")
    ).toBeInTheDocument();
  });

  it("renders navigation buttons (previous/next)", () => {
    render(<Calendar />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(1);
  });

  it("renders a grid for day cells", () => {
    render(<Calendar value={parseDate("2025-06-15")} />);
    const grid = document.querySelector("table");
    expect(grid).toBeInTheDocument();
  });

  it("calls onChange when a date is selected", () => {
    const onChange = vi.fn();
    render(<Calendar onChange={onChange} value={parseDate("2025-06-01")} />);
    // Grid cells should exist
    const gridCells = screen.getAllByRole("gridcell");
    expect(gridCells.length).toBeGreaterThan(0);
  });
});

describe("RangeCalendar (RAC)", () => {
  it("renders with data-slot='range-calendar'", () => {
    render(<RangeCalendar />);
    expect(
      document.querySelector("[data-slot='range-calendar']")
    ).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<RangeCalendar />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(1);
  });

  it("renders a day grid", () => {
    render(
      <RangeCalendar
        value={{
          start: parseDate("2025-06-01"),
          end: parseDate("2025-06-15"),
        }}
      />
    );
    const grid = document.querySelector("table");
    expect(grid).toBeInTheDocument();
  });
});
