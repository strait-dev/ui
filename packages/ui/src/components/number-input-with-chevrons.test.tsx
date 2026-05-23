import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberInputWithChevrons } from "./number-input-with-chevrons";

describe("NumberInputWithChevrons", () => {
  it("renders with the correct data-slot attribute", () => {
    const { container } = render(
      <NumberInputWithChevrons label="Price" name="price" />
    );
    expect(
      container.querySelector("[data-slot='number-input-with-chevrons']")
    ).toBeInTheDocument();
  });

  it("renders increment and decrement buttons", () => {
    render(<NumberInputWithChevrons label="Price" name="price" />);
    expect(
      screen.getByRole("button", { name: "Increase value" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Decrease value" })
    ).toBeInTheDocument();
  });

  it("renders the input with aria-label from label prop", () => {
    render(<NumberInputWithChevrons label="Price" name="price" />);
    // React Aria renders NumberField input as type="text" with aria-roledescription="Number field"
    expect(screen.getByRole("textbox", { name: "Price" })).toBeInTheDocument();
  });

  it("falls back to name-based aria-label when no label is provided", () => {
    render(<NumberInputWithChevrons name="amount" />);
    expect(
      screen.getByRole("textbox", { name: "amount input" })
    ).toBeInTheDocument();
  });

  it("calls onChange when increment button is clicked", async () => {
    const onChange = vi.fn();
    render(
      <NumberInputWithChevrons
        defaultValue={10}
        label="Price"
        name="price"
        onChange={onChange}
        step={1}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Increase value" })
    );
    expect(onChange).toHaveBeenCalledWith(11);
  });

  it("calls onChange when decrement button is clicked", async () => {
    const onChange = vi.fn();
    render(
      <NumberInputWithChevrons
        defaultValue={10}
        label="Price"
        name="price"
        onChange={onChange}
        step={1}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Decrease value" })
    );
    expect(onChange).toHaveBeenCalledWith(9);
  });

  it("disables buttons when disabled prop is true", () => {
    render(<NumberInputWithChevrons disabled label="Price" name="price" />);
    expect(
      screen.getByRole("button", { name: "Increase value" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Decrease value" })
    ).toBeDisabled();
  });

  it("renders the chevrons-container data-slot", () => {
    const { container } = render(
      <NumberInputWithChevrons label="Price" name="price" />
    );
    expect(
      container.querySelector("[data-slot='chevrons-container']")
    ).toBeInTheDocument();
  });

  it("renders the input data-slot", () => {
    const { container } = render(
      <NumberInputWithChevrons label="Price" name="price" />
    );
    expect(container.querySelector("[data-slot='input']")).toBeInTheDocument();
  });

  it("accepts formatOptions for currency display", () => {
    const { container } = render(
      <NumberInputWithChevrons
        defaultValue={10}
        formatOptions={{ style: "currency", currency: "USD" }}
        label="Price"
        name="price"
      />
    );
    expect(
      container.querySelector("[data-slot='number-input-with-chevrons']")
    ).toBeInTheDocument();
  });

  it("respects min/max clamp on increment beyond max", async () => {
    const onChange = vi.fn();
    render(
      <NumberInputWithChevrons
        defaultValue={5}
        label="Price"
        max={5}
        name="price"
        onChange={onChange}
      />
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Increase value" })
    );
    if (onChange.mock.calls.length > 0) {
      expect(onChange).toHaveBeenCalledWith(5);
    }
  });
});
