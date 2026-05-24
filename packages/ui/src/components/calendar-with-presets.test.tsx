import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CalendarWithPresets } from "./calendar-with-presets";

describe("CalendarWithPresets", () => {
  it("renders with data-slot='calendar-with-presets'", () => {
    render(<CalendarWithPresets />);
    expect(
      document.querySelector("[data-slot='calendar-with-presets']")
    ).toBeInTheDocument();
  });

  it("renders default single-mode presets in Portuguese", () => {
    render(<CalendarWithPresets mode="single" />);
    expect(screen.getByText("Hoje")).toBeInTheDocument();
    expect(screen.getByText("Ontem")).toBeInTheDocument();
    expect(screen.getByText("Última semana")).toBeInTheDocument();
  });

  it("renders range-mode presets", () => {
    render(<CalendarWithPresets mode="range" />);
    expect(screen.getByText("Últimos 7 dias")).toBeInTheDocument();
    expect(screen.getByText("Últimos 30 dias")).toBeInTheDocument();
  });

  it("renders the calendar grid", () => {
    render(<CalendarWithPresets mode="single" />);
    const table = document.querySelector("table");
    expect(table).toBeInTheDocument();
  });

  it("calls onSelect with a Date when a preset is clicked in single mode", async () => {
    const onSelect = vi.fn();
    render(
      <CalendarWithPresets
        mode="single"
        onSelect={onSelect as (date: Date | undefined) => void}
      />
    );
    const hojeButton = screen.getByRole("button", { name: /Hoje/i });
    await userEvent.click(hojeButton);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0]?.[0]).toBeInstanceOf(Date);
  });

  it("renders custom presets when provided", () => {
    const customDate = new Date(2025, 0, 1);
    render(
      <CalendarWithPresets
        mode="single"
        presets={[{ name: "Custom Preset", value: customDate }]}
      />
    );
    expect(screen.getByText("Custom Preset")).toBeInTheDocument();
  });

  it("accepts disableFutureDates=false without throwing", () => {
    expect(() =>
      render(<CalendarWithPresets disableFutureDates={false} mode="single" />)
    ).not.toThrow();
  });
});
