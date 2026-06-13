import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { DateRangePicker } from "./date-range-picker";

beforeAll(() => {
  Element.prototype.scrollIntoView ||= () => {};
});

describe("DateRangePicker", () => {
  it("renders with data-slot='date-range-picker'", () => {
    render(<DateRangePicker />);
    expect(
      document.querySelector("[data-slot='date-range-picker']")
    ).toBeInTheDocument();
  });

  it("renders the date segment inputs", () => {
    render(<DateRangePicker />);
    // RAC DateInput renders spinbutton roles for each segment
    const spinButtons = screen.getAllByRole("spinbutton");
    expect(spinButtons.length).toBeGreaterThan(0);
  });

  it("renders the 'to' separator", () => {
    render(<DateRangePicker />);
    expect(screen.getByText("to")).toBeInTheDocument();
  });

  it("renders a label when label prop is provided", () => {
    render(<DateRangePicker label="Period" />);
    expect(screen.getByText("Period")).toBeInTheDocument();
  });

  it("renders the calendar icon trigger button", () => {
    render(<DateRangePicker />);
    // The calendar icon button is the last button in the group
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders with a pre-filled date range", () => {
    const from = new Date(2025, 0, 1);
    const to = new Date(2025, 0, 31);
    expect(() =>
      render(<DateRangePicker onChange={vi.fn()} value={{ from, to }} />)
    ).not.toThrow();
  });

  it("renders inline validation copy", () => {
    render(<DateRangePicker error errorMessage="Select an end date." />);
    expect(screen.getByText("Select an end date.")).toBeInTheDocument();
  });

  it("disables the calendar trigger", () => {
    render(<DateRangePicker disabled />);
    expect(screen.getAllByRole("button").at(-1)).toBeDisabled();
  });
});
