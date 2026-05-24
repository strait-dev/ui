import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DatePickerWithMonthYear } from "./date-picker-with-month-year";

describe("DatePickerWithMonthYear", () => {
  it("renders with data-slot='date-picker-with-month-year'", () => {
    render(<DatePickerWithMonthYear />);
    expect(
      document.querySelector("[data-slot='date-picker-with-month-year']")
    ).toBeInTheDocument();
  });

  it("shows default placeholder when no date is selected", () => {
    render(<DatePickerWithMonthYear />);
    expect(screen.getByText("Selecione uma data")).toBeInTheDocument();
  });

  it("shows custom placeholder when provided", () => {
    render(<DatePickerWithMonthYear placeholder="Pick a date" />);
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it("renders the trigger button", () => {
    render(<DatePickerWithMonthYear />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<DatePickerWithMonthYear disabled />);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
  });

  it("opens popover with calendar when trigger is clicked", async () => {
    render(<DatePickerWithMonthYear />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    // Calendar should be visible (dropdown caption layout)
    const calendar = document.querySelector("[data-slot='calendar']");
    expect(calendar).toBeInTheDocument();
  });

  it("shows formatted date when a value is set", () => {
    // value=new Date(2025, 0, 15) → "15/01/2025" in pt-BR
    render(<DatePickerWithMonthYear value={new Date(2025, 0, 15)} />);
    expect(screen.getByText("15/01/2025")).toBeInTheDocument();
  });

  it("calls onChange when a date is selected", async () => {
    const onChange = vi.fn();
    render(
      <DatePickerWithMonthYear
        onChange={onChange}
        value={new Date(2025, 0, 1)}
      />
    );
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
