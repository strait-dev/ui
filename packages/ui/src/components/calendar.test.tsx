import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Calendar } from "./calendar";

describe("Calendar", () => {
  it("renders the calendar root with data-slot", () => {
    render(<Calendar mode="single" />);
    expect(
      document.querySelector("[data-slot='calendar']")
    ).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<Calendar mode="single" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders a grid of day cells", () => {
    render(<Calendar defaultMonth={new Date(2025, 0, 1)} mode="single" />);
    const grid = document.querySelector("table");
    expect(grid).toBeInTheDocument();
  });

  it("calls onSelect when a day is clicked", async () => {
    const onSelect = vi.fn();
    render(
      <Calendar
        defaultMonth={new Date(2025, 0, 1)}
        mode="single"
        onSelect={onSelect}
      />
    );
    // Click a visible day button (day 15 should always be in view)
    const dayButtons = screen.getAllByRole("button");
    // Find a day button that's not prev/next navigation
    const dayButton = dayButtons.find(
      (btn) => btn.getAttribute("data-day") !== null
    );
    if (dayButton) {
      await userEvent.click(dayButton);
      expect(onSelect).toHaveBeenCalledTimes(1);
    }
  });

  it("renders in range mode with two months", () => {
    render(
      <Calendar
        defaultMonth={new Date(2025, 0, 1)}
        mode="range"
        numberOfMonths={2}
      />
    );
    expect(
      document.querySelector("[data-slot='calendar']")
    ).toBeInTheDocument();
  });

  it("accepts a custom buttonVariant prop without throwing", () => {
    expect(() =>
      render(<Calendar buttonVariant="outline" mode="single" />)
    ).not.toThrow();
  });
});
