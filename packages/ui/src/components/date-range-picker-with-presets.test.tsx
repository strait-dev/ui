import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { DateRangePickerWithPresets } from "./date-range-picker-with-presets";

beforeAll(() => {
  Element.prototype.scrollIntoView ||= () => {};
});

describe("DateRangePickerWithPresets", () => {
  it("renders with data-slot='date-range-picker-with-presets'", () => {
    render(<DateRangePickerWithPresets />);
    expect(
      document.querySelector("[data-slot='date-range-picker-with-presets']")
    ).toBeInTheDocument();
  });

  it("renders date segment spinbuttons", () => {
    render(<DateRangePickerWithPresets />);
    const spinButtons = screen.getAllByRole("spinbutton");
    expect(spinButtons.length).toBeGreaterThan(0);
  });

  it("renders the 'to' separator", () => {
    render(<DateRangePickerWithPresets />);
    expect(screen.getByText("to")).toBeInTheDocument();
  });

  it("renders a label when provided", () => {
    render(<DateRangePickerWithPresets label="Select Period" />);
    expect(screen.getByText("Select Period")).toBeInTheDocument();
  });

  it("renders the calendar icon button", () => {
    render(<DateRangePickerWithPresets />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders without throwing when a value is provided", () => {
    expect(() =>
      render(
        <DateRangePickerWithPresets
          onChange={vi.fn()}
          value={{ from: new Date(2025, 0, 1), to: new Date(2025, 0, 31) }}
        />
      )
    ).not.toThrow();
  });

  it("renders without throwing when a defaultValue is provided", () => {
    expect(() =>
      render(
        <DateRangePickerWithPresets
          defaultValue={{
            from: new Date(2025, 0, 1),
            to: new Date(2025, 0, 31),
          }}
        />
      )
    ).not.toThrow();
  });
});
