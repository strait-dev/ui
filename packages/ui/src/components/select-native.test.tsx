import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SelectNative } from "./select-native";

describe("SelectNative", () => {
  it("renders a select with the select-native data-slot", () => {
    render(
      <SelectNative aria-label="Fruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </SelectNative>
    );
    const select = screen.getByRole("combobox", { name: "Fruit" });
    expect(select).toHaveAttribute("data-slot", "select-native");
  });

  it("renders options as children", () => {
    render(
      <SelectNative aria-label="Fruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </SelectNative>
    );
    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Banana" })).toBeInTheDocument();
  });

  it("changes selected value on user interaction", async () => {
    render(
      <SelectNative aria-label="Fruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </SelectNative>
    );
    const select = screen.getByRole<HTMLSelectElement>("combobox", {
      name: "Fruit",
    });
    await userEvent.selectOptions(select, "banana");
    expect(select).toHaveValue("banana");
  });

  it("is disabled when the disabled prop is set", () => {
    render(
      <SelectNative aria-label="Fruit" disabled>
        <option value="apple">Apple</option>
      </SelectNative>
    );
    expect(screen.getByRole("combobox", { name: "Fruit" })).toBeDisabled();
  });

  it("reflects aria-invalid attribute", () => {
    render(
      <SelectNative aria-invalid aria-label="Fruit">
        <option value="apple">Apple</option>
      </SelectNative>
    );
    expect(screen.getByRole("combobox", { name: "Fruit" })).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("is associated with a label via htmlFor", () => {
    render(
      <>
        <label htmlFor="fruit">Fruit</label>
        <SelectNative id="fruit">
          <option value="apple">Apple</option>
        </SelectNative>
      </>
    );
    expect(screen.getByLabelText("Fruit")).toHaveAttribute(
      "data-slot",
      "select-native"
    );
  });
});
