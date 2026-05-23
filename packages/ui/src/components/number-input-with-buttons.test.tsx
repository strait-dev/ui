import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberInputWithButtons } from "./number-input-with-buttons";

describe("NumberInputWithButtons", () => {
  it("renders with the correct data-slot attribute", () => {
    const { container } = render(
      <NumberInputWithButtons label="Quantity" name="qty" />
    );
    expect(
      container.querySelector("[data-slot='number-input-with-buttons']")
    ).toBeInTheDocument();
  });

  it("renders decrement and increment buttons", () => {
    render(<NumberInputWithButtons label="Quantity" name="qty" />);
    expect(
      screen.getByRole("button", { name: "Decrease value" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Increase value" })
    ).toBeInTheDocument();
  });

  it("renders the input with the correct aria-label", () => {
    render(<NumberInputWithButtons label="Quantity" name="qty" />);
    // React Aria renders NumberField input as type="text" with aria-roledescription="Number field"
    expect(
      screen.getByRole("textbox", { name: "Quantity" })
    ).toBeInTheDocument();
  });

  it("falls back to name-based aria-label when label is not provided", () => {
    render(<NumberInputWithButtons name="amount" />);
    expect(
      screen.getByRole("textbox", { name: "amount input" })
    ).toBeInTheDocument();
  });

  it("calls onChange when increment button is clicked", async () => {
    const onChange = vi.fn();
    render(
      <NumberInputWithButtons
        defaultValue={5}
        label="Quantity"
        name="qty"
        onChange={onChange}
        step={1}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Increase value" })
    );
    expect(onChange).toHaveBeenCalledWith(6);
  });

  it("calls onChange when decrement button is clicked", async () => {
    const onChange = vi.fn();
    render(
      <NumberInputWithButtons
        defaultValue={5}
        label="Quantity"
        name="qty"
        onChange={onChange}
        step={1}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Decrease value" })
    );
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("clamps value to min when decrement would go below min", async () => {
    const onChange = vi.fn();
    render(
      <NumberInputWithButtons
        defaultValue={1}
        label="Quantity"
        min={1}
        name="qty"
        onChange={onChange}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Decrease value" })
    );
    // Should not call onChange below min, or calls with clamped min value
    if (onChange.mock.calls.length > 0) {
      expect(onChange).toHaveBeenCalledWith(1);
    }
  });

  it("clamps value to max when increment would exceed max", async () => {
    const onChange = vi.fn();
    render(
      <NumberInputWithButtons
        defaultValue={10}
        label="Quantity"
        max={10}
        name="qty"
        onChange={onChange}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Increase value" })
    );
    if (onChange.mock.calls.length > 0) {
      expect(onChange).toHaveBeenCalledWith(10);
    }
  });

  it("disables buttons when disabled prop is true", () => {
    render(<NumberInputWithButtons disabled label="Quantity" name="qty" />);
    expect(
      screen.getByRole("button", { name: "Decrease value" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Increase value" })
    ).toBeDisabled();
  });

  it("renders the input-group data-slot", () => {
    const { container } = render(
      <NumberInputWithButtons label="Quantity" name="qty" />
    );
    expect(
      container.querySelector("[data-slot='input-group']")
    ).toBeInTheDocument();
  });

  it("renders data-slot attributes for decrement and increment buttons", () => {
    const { container } = render(
      <NumberInputWithButtons label="Quantity" name="qty" />
    );
    expect(
      container.querySelector("[data-slot='decrement-button']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='increment-button']")
    ).toBeInTheDocument();
  });
});
