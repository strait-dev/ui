import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DateInput } from "./date-input";

describe("DateInput", () => {
  it("renders with data-slot='date-input'", () => {
    const onChange = vi.fn();
    render(<DateInput onChange={onChange} value={new Date(2025, 0, 15)} />);
    expect(
      document.querySelector("[data-slot='date-input']")
    ).toBeInTheDocument();
  });

  it("renders three input segments (month, day, year)", () => {
    const onChange = vi.fn();
    render(<DateInput onChange={onChange} value={new Date(2025, 0, 15)} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(3);
  });

  it("displays the correct month, day, and year values", () => {
    const onChange = vi.fn();
    // January 15, 2025 → month=1, day=15, year=2025
    render(<DateInput onChange={onChange} value={new Date(2025, 0, 15)} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("1"); // month
    expect(inputs[1]).toHaveValue("15"); // day
    expect(inputs[2]).toHaveValue("2025"); // year
  });

  it("calls onChange when a valid day is typed", async () => {
    const onChange = vi.fn();
    render(<DateInput onChange={onChange} value={new Date(2025, 0, 15)} />);
    const inputs = screen.getAllByRole("textbox");
    const dayInput = inputs[1]!;
    await userEvent.clear(dayInput);
    await userEvent.type(dayInput, "20");
    expect(onChange).toHaveBeenCalled();
  });

  it("increments the day with ArrowUp", async () => {
    const onChange = vi.fn();
    render(<DateInput onChange={onChange} value={new Date(2025, 0, 15)} />);
    const inputs = screen.getAllByRole("textbox");
    const dayInput = inputs[1]!;
    await userEvent.click(dayInput);
    await userEvent.keyboard("{ArrowUp}");
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls.at(-1)?.[0] as Date;
    expect(lastCall).toBeInstanceOf(Date);
    expect(lastCall.getDate()).toBe(16);
  });

  it("renders without a value prop (defaults to today)", () => {
    const onChange = vi.fn();
    expect(() => render(<DateInput onChange={onChange} />)).not.toThrow();
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(3);
  });
});
