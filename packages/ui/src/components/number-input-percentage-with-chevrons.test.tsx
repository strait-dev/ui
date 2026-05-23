import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberInputPercentageWithChevrons } from "./number-input-percentage-with-chevrons";

describe("NumberInputPercentageWithChevrons", () => {
  it("renders with the correct data-slot attribute", () => {
    const { container } = render(
      <NumberInputPercentageWithChevrons label="Discount" name="discount" />
    );
    expect(
      container.querySelector(
        "[data-slot='number-input-percentage-with-chevrons']"
      )
    ).toBeInTheDocument();
  });

  it("renders increment and decrement buttons", () => {
    render(
      <NumberInputPercentageWithChevrons label="Discount" name="discount" />
    );
    expect(
      screen.getByRole("button", { name: "Increase percentage" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Decrease percentage" })
    ).toBeInTheDocument();
  });

  it("renders the input with aria-label from label prop", () => {
    render(
      <NumberInputPercentageWithChevrons label="Discount" name="discount" />
    );
    // React Aria renders NumberField input as type="text" with aria-roledescription="Number field"
    expect(
      screen.getByRole("textbox", { name: "Discount" })
    ).toBeInTheDocument();
  });

  it("falls back to name-based aria-label for input", () => {
    render(<NumberInputPercentageWithChevrons name="ratio" />);
    // The Input aria-label uses `${name} percentage input` when no label is given
    expect(
      screen.getByRole("textbox", { name: "ratio percentage input" })
    ).toBeInTheDocument();
  });

  it("renders the chevrons-container data-slot", () => {
    const { container } = render(
      <NumberInputPercentageWithChevrons label="Discount" name="discount" />
    );
    expect(
      container.querySelector("[data-slot='chevrons-container']")
    ).toBeInTheDocument();
  });

  it("renders increment and decrement data-slot buttons", () => {
    const { container } = render(
      <NumberInputPercentageWithChevrons label="Discount" name="discount" />
    );
    expect(
      container.querySelector("[data-slot='increment-button']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='decrement-button']")
    ).toBeInTheDocument();
  });

  it("calls onChange with integer percentage when increment is clicked", async () => {
    const onChange = vi.fn();
    // value=50 (integer %) → internally 0.5 fraction; click increment → 0.51 → onChange(51)
    render(
      <NumberInputPercentageWithChevrons
        label="Discount"
        name="discount"
        onChange={onChange}
        value={50}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Increase percentage" })
    );
    expect(onChange).toHaveBeenCalled();
    // The fraction 0.51 * 100 = 51
    const called = onChange.mock.calls[0][0] as number;
    expect(called).toBeCloseTo(51, 0);
  });

  it("calls onChange with integer percentage when decrement is clicked", async () => {
    const onChange = vi.fn();
    render(
      <NumberInputPercentageWithChevrons
        label="Discount"
        name="discount"
        onChange={onChange}
        value={50}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Decrease percentage" })
    );
    expect(onChange).toHaveBeenCalled();
    const called = onChange.mock.calls[0][0] as number;
    expect(called).toBeCloseTo(49, 0);
  });

  it("disables buttons when disabled prop is true", () => {
    render(
      <NumberInputPercentageWithChevrons
        disabled
        label="Discount"
        name="discount"
      />
    );
    expect(
      screen.getByRole("button", { name: "Increase percentage" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Decrease percentage" })
    ).toBeDisabled();
  });

  it("renders the input data-slot", () => {
    const { container } = render(
      <NumberInputPercentageWithChevrons label="Discount" name="discount" />
    );
    expect(container.querySelector("[data-slot='input']")).toBeInTheDocument();
  });
});
