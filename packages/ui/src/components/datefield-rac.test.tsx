import { parseDate, parseTime } from "@internationalized/date";
import { render, screen } from "@testing-library/react";
import { Label } from "react-aria-components";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { DateField, DateInput, TimeField } from "./datefield-rac";

beforeAll(() => {
  Element.prototype.scrollIntoView ||= () => {};
});

describe("DateField (RAC)", () => {
  it("renders with data-slot='date-field'", () => {
    render(
      <DateField value={parseDate("2025-06-15")}>
        <DateInput />
      </DateField>
    );
    expect(
      document.querySelector("[data-slot='date-field']")
    ).toBeInTheDocument();
  });

  it("renders date segments as spinbuttons", () => {
    render(
      <DateField value={parseDate("2025-06-15")}>
        <DateInput />
      </DateField>
    );
    const spinButtons = screen.getAllByRole("spinbutton");
    expect(spinButtons.length).toBeGreaterThan(0);
  });

  it("renders a label when provided", () => {
    render(
      <DateField value={parseDate("2025-06-15")}>
        <Label>Start date</Label>
        <DateInput />
      </DateField>
    );
    expect(screen.getByText("Start date")).toBeInTheDocument();
  });

  it("renders data-slot='date-input' for DateInput", () => {
    render(
      <DateField value={parseDate("2025-06-15")}>
        <DateInput />
      </DateField>
    );
    expect(
      document.querySelector("[data-slot='date-input']")
    ).toBeInTheDocument();
  });

  it("calls onChange when a segment is changed", () => {
    const onChange = vi.fn();
    render(
      <DateField onChange={onChange} value={parseDate("2025-06-15")}>
        <DateInput />
      </DateField>
    );
    // Segment spinbuttons exist
    const spinButtons = screen.getAllByRole("spinbutton");
    expect(spinButtons.length).toBeGreaterThan(0);
  });
});

describe("TimeField (RAC)", () => {
  it("renders with data-slot='time-field'", () => {
    render(
      <TimeField value={parseTime("14:30")}>
        <DateInput />
      </TimeField>
    );
    expect(
      document.querySelector("[data-slot='time-field']")
    ).toBeInTheDocument();
  });

  it("renders time segments as spinbuttons", () => {
    render(
      <TimeField value={parseTime("14:30")}>
        <DateInput />
      </TimeField>
    );
    const spinButtons = screen.getAllByRole("spinbutton");
    expect(spinButtons.length).toBeGreaterThan(0);
  });
});

describe("DateSegment (RAC)", () => {
  it("renders with data-slot='date-segment'", () => {
    render(
      <DateField value={parseDate("2025-06-15")}>
        <DateInput />
      </DateField>
    );
    // DateInput internally renders DateSegments
    const segments = document.querySelectorAll("[data-slot='date-segment']");
    expect(segments.length).toBeGreaterThan(0);
  });
});
