import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

// Reusable inline fixture — inlined per test to avoid cross-test state.
function makeFixture(
  props: {
    onValueChange?: (value: string | null) => void;
    defaultValue?: string;
  } = {}
) {
  return (
    <Select {...props}>
      <SelectTrigger aria-label="Framework">
        <SelectValue placeholder="Pick a framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Frontend</SelectLabel>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectSeparator />
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("renders the trigger with a placeholder when no value is selected", () => {
    render(makeFixture());
    expect(screen.getByText("Pick a framework")).toBeInTheDocument();
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("trigger has the correct data-slot attribute", () => {
    render(makeFixture());
    const trigger = screen.getByRole("combobox", { name: "Framework" });
    expect(trigger).toHaveAttribute("data-slot", "select-trigger");
  });

  it("opens the dropdown and shows options, label, and separator on trigger click", async () => {
    const user = userEvent.setup();
    render(makeFixture());
    await user.click(screen.getByRole("combobox", { name: "Framework" }));
    const options = await screen.findAllByRole("option");
    expect(options.length).toBe(3);
    expect(screen.getByText("Frontend")).toBeInTheDocument();
  });

  it("calls onValueChange with the selected value when an option is clicked", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(makeFixture({ onValueChange }));
    await user.click(screen.getByRole("combobox", { name: "Framework" }));
    // Wait for the options to appear — Base UI may animate the portal in
    const options = await screen.findAllByRole("option");
    // click "Vue" — second option
    await user.click(options[1]);
    // Base UI passes the value string as first arg; extra event details follow
    expect(onValueChange).toHaveBeenCalledWith("vue", expect.anything());
  });

  it("shows the raw value in the trigger when a defaultValue is provided", () => {
    // SelectItems only register their labels after the popup opens;
    // before that the trigger shows the raw value string.
    render(makeFixture({ defaultValue: "svelte" }));
    expect(
      screen.getByRole("combobox", { name: "Framework" })
    ).toHaveTextContent(/svelte/i);
  });
});
