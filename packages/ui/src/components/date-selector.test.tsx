import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { beforeAll, describe, expect, it } from "vitest";

import {
  DateSelector,
  type DateSelectorValue,
  formatDateValue,
} from "./date-selector";

beforeAll(() => {
  window.matchMedia ||= (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
});

function Harness({
  presetMode,
  showInput = true,
  label,
}: {
  presetMode?: DateSelectorValue["operator"];
  showInput?: boolean;
  label?: string;
}) {
  const [value, setValue] = useState<DateSelectorValue>();
  return (
    <DateSelector
      label={label}
      onChange={setValue}
      presetMode={presetMode}
      showInput={showInput}
      value={value}
    />
  );
}

describe("DateSelector", () => {
  it("renders the root with the date-selector data-slot", () => {
    const { container } = render(<Harness />);
    expect(
      container.querySelector('[data-slot="date-selector"]')
    ).not.toBeNull();
  });

  it("renders the operator and period tabs", () => {
    render(<Harness />);
    expect(screen.getByRole("tab", { name: "is" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "between" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Day" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Year" })).toBeInTheDocument();
  });

  it("hides the operator tabs while leaving periods when presetMode is set", () => {
    render(<Harness presetMode="before" />);
    expect(screen.queryByRole("tab", { name: "between" })).toBeNull();
    expect(screen.getByRole("tab", { name: "Day" })).toBeInTheDocument();
  });

  it("omits the text input when showInput is false", () => {
    const { container } = render(<Harness showInput={false} />);
    expect(
      container.querySelector('[data-slot="date-selector-input"]')
    ).toBeNull();
  });

  it("renders the label when provided", () => {
    const { container } = render(<Harness label="Created" />);
    const heading = container.querySelector(
      '[data-slot="date-selector-label"]'
    );
    expect(heading).toHaveTextContent("Created");
  });

  it("switches to the year grid when the Year tab is selected", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("tab", { name: "Year" }));
    expect(
      screen.getByRole("button", { name: String(new Date().getFullYear()) })
    ).toBeInTheDocument();
  });
});

describe("formatDateValue", () => {
  it("formats a single day with the default format", () => {
    const result = formatDateValue({
      period: "day",
      operator: "is",
      startDate: new Date(2026, 0, 15),
    });
    expect(result).toBe("01/15/2026");
  });

  it("formats a month and year", () => {
    const result = formatDateValue({
      period: "month",
      operator: "is",
      year: 2026,
      month: 2,
    });
    expect(result).toBe("Mar 2026");
  });

  it("formats a year range", () => {
    const result = formatDateValue({
      period: "year",
      operator: "between",
      rangeStart: { year: 2022, value: 0 },
      rangeEnd: { year: 2025, value: 0 },
    });
    expect(result).toBe("2022 - 2025");
  });
});
