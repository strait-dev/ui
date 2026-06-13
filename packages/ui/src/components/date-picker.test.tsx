import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "./date-picker";

describe("DatePicker", () => {
  it("renders with data-slot='date-picker'", () => {
    render(<DatePicker />);
    expect(
      document.querySelector("[data-slot='date-picker']")
    ).toBeInTheDocument();
  });

  it("shows 'Select a date' placeholder when no value is provided", () => {
    render(<DatePicker />);
    expect(screen.getByText("Select a date")).toBeInTheDocument();
  });

  it("displays a formatted date when value is provided", () => {
    const date = new Date(2025, 0, 15);
    const formatted = new Intl.DateTimeFormat().format(date);
    render(<DatePicker value={date} />);
    expect(screen.getByText(formatted)).toBeInTheDocument();
  });

  it("supports custom placeholder and date formatting", () => {
    const date = new Date(2025, 0, 15);
    render(
      <DatePicker
        formatDate={() => "15 Jan 2025"}
        placeholder="Pick a due date"
        value={date}
      />
    );
    expect(screen.getByText("15 Jan 2025")).toBeInTheDocument();
  });

  it("renders a custom placeholder when no value is provided", () => {
    render(<DatePicker placeholder="Pick a due date" />);
    expect(screen.getByText("Pick a due date")).toBeInTheDocument();
  });

  it("renders a label when label prop is provided", () => {
    render(<DatePicker label="Due date" />);
    expect(screen.getByText("Due date")).toBeInTheDocument();
  });

  it("renders a required asterisk when required is true", () => {
    render(<DatePicker label="Due date" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders inline validation copy", () => {
    render(<DatePicker error errorMessage="Choose a date." />);
    expect(screen.getByText("Choose a date.")).toBeInTheDocument();
  });

  it("trigger button is disabled when disabled prop is true", () => {
    render(<DatePicker disabled />);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
  });

  it("opens the calendar popover when trigger is clicked", async () => {
    render(<DatePicker />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    // Calendar grid should be visible
    const grid = document.querySelector("table");
    expect(grid).toBeInTheDocument();
  });

  it("calls onChange when a date is selected from the calendar", async () => {
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} value={new Date(2025, 0, 1)} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    const dayButtons = screen.getAllByRole("button");
    const dayButton = dayButtons.find(
      (btn) => btn.getAttribute("data-day") !== null
    );
    if (dayButton) {
      await userEvent.click(dayButton);
      expect(onChange).toHaveBeenCalled();
    }
  });
});
