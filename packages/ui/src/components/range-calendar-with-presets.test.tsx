import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RangeCalendarWithPresets } from "./range-calendar-with-presets";

describe("RangeCalendarWithPresets", () => {
  it("renders with data-slot='range-calendar-with-presets'", () => {
    render(<RangeCalendarWithPresets />);
    expect(
      document.querySelector("[data-slot='range-calendar-with-presets']")
    ).toBeInTheDocument();
  });

  it("renders preset buttons", () => {
    render(<RangeCalendarWithPresets />);
    expect(screen.getByRole("button", { name: "Hoje" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ontem" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Últimos 7 dias" })
    ).toBeInTheDocument();
  });

  it("renders the calendar grid", () => {
    render(<RangeCalendarWithPresets />);
    const table = document.querySelector("table");
    expect(table).toBeInTheDocument();
  });

  it("calls onSelect when a preset is clicked", async () => {
    const onSelect = vi.fn();
    render(<RangeCalendarWithPresets onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "Hoje" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    const called = onSelect.mock.calls[0][0];
    expect(called).toHaveProperty("from");
    expect(called).toHaveProperty("to");
  });

  it("does not render footer buttons when showFooter is false (default)", () => {
    render(<RangeCalendarWithPresets />);
    expect(
      screen.queryByRole("button", { name: "Aplicar" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Limpar" })
    ).not.toBeInTheDocument();
  });

  it("renders footer buttons when showFooter is true", () => {
    render(<RangeCalendarWithPresets showFooter />);
    expect(screen.getByRole("button", { name: "Aplicar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Limpar" })).toBeInTheDocument();
  });

  it("calls onApply when Aplicar is clicked", async () => {
    const onApply = vi.fn();
    const from = new Date(2025, 0, 1);
    const to = new Date(2025, 0, 7);
    render(
      <RangeCalendarWithPresets
        onApply={onApply}
        selected={{ from, to }}
        showFooter
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Aplicar" }));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it("calls onReset when Limpar is clicked", async () => {
    const onReset = vi.fn();
    render(<RangeCalendarWithPresets onReset={onReset} showFooter />);
    await userEvent.click(screen.getByRole("button", { name: "Limpar" }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
