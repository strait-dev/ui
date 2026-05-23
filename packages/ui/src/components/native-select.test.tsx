import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "./native-select";

describe("NativeSelect", () => {
  it("renders a select with the native-select data-slot", () => {
    render(
      <NativeSelect aria-label="Colour">
        <NativeSelectOption value="red">Red</NativeSelectOption>
        <NativeSelectOption value="blue">Blue</NativeSelectOption>
      </NativeSelect>
    );
    const select = screen.getByRole("combobox", { name: "Colour" });
    expect(select).toHaveAttribute("data-slot", "native-select");
  });

  it("renders the wrapper with the native-select-wrapper data-slot", () => {
    const { container } = render(
      <NativeSelect aria-label="Colour">
        <NativeSelectOption value="red">Red</NativeSelectOption>
      </NativeSelect>
    );
    expect(
      container.querySelector("[data-slot='native-select-wrapper']")
    ).toBeInTheDocument();
  });

  it("forwards the size to data-size on the wrapper and select", () => {
    const { container } = render(
      <NativeSelect aria-label="Colour" size="sm">
        <NativeSelectOption value="red">Red</NativeSelectOption>
      </NativeSelect>
    );
    expect(
      container.querySelector("[data-slot='native-select-wrapper']")
    ).toHaveAttribute("data-size", "sm");
    expect(screen.getByRole("combobox", { name: "Colour" })).toHaveAttribute(
      "data-size",
      "sm"
    );
  });

  it("changes selected value on user interaction", async () => {
    render(
      <NativeSelect aria-label="Colour">
        <NativeSelectOption value="red">Red</NativeSelectOption>
        <NativeSelectOption value="blue">Blue</NativeSelectOption>
      </NativeSelect>
    );
    const select = screen.getByRole<HTMLSelectElement>("combobox", {
      name: "Colour",
    });
    await userEvent.selectOptions(select, "blue");
    expect(select).toHaveValue("blue");
  });

  it("renders NativeSelectOption with native-select-option data-slot", () => {
    render(
      <NativeSelect aria-label="Colour">
        <NativeSelectOption value="red">Red</NativeSelectOption>
      </NativeSelect>
    );
    expect(screen.getByRole("option", { name: "Red" })).toHaveAttribute(
      "data-slot",
      "native-select-option"
    );
  });

  it("renders NativeSelectOptGroup with native-select-optgroup data-slot", () => {
    const { container } = render(
      <NativeSelect aria-label="Colour">
        <NativeSelectOptGroup label="Warm">
          <NativeSelectOption value="red">Red</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    );
    expect(
      container.querySelector("[data-slot='native-select-optgroup']")
    ).toBeInTheDocument();
  });

  it("accepts size=lg and forwards data-size=lg to wrapper and select", () => {
    const { container } = render(
      <NativeSelect aria-label="Colour" size="lg">
        <NativeSelectOption value="red">Red</NativeSelectOption>
      </NativeSelect>
    );
    expect(
      container.querySelector("[data-slot='native-select-wrapper']")
    ).toHaveAttribute("data-size", "lg");
    expect(screen.getByRole("combobox", { name: "Colour" })).toHaveAttribute(
      "data-size",
      "lg"
    );
  });
});
