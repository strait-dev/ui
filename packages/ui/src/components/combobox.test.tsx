import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./combobox";

const OPTIONS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

function Fixture({
  onValueChange,
  defaultValue,
}: {
  onValueChange?: (value: string | null) => void;
  defaultValue?: string;
}) {
  return (
    <Combobox defaultValue={defaultValue} onValueChange={onValueChange}>
      <ComboboxInput placeholder="Search framework..." />
      <ComboboxContent>
        <ComboboxList>
          <ComboboxEmpty>No results.</ComboboxEmpty>
          {OPTIONS.map((opt) => (
            <ComboboxItem key={opt.value} value={opt.value}>
              {opt.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

describe("Combobox", () => {
  it("renders the input and hides the dropdown initially", () => {
    render(<Fixture />);
    expect(
      screen.getByPlaceholderText("Search framework...")
    ).toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });

  it("opens the dropdown and shows all items when the input is focused", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByPlaceholderText("Search framework..."));
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.getByText("Svelte")).toBeInTheDocument();
  });

  it("items have the correct data-slot when the dropdown is open", async () => {
    render(<Fixture />);
    await userEvent.click(screen.getByPlaceholderText("Search framework..."));
    const reactItem = screen
      .getByText("React")
      .closest("[data-slot='combobox-item']");
    expect(reactItem).toBeInTheDocument();
  });

  it("calls onValueChange with the selected value when an item is clicked", async () => {
    const onValueChange = vi.fn();
    render(<Fixture onValueChange={onValueChange} />);
    await userEvent.click(screen.getByPlaceholderText("Search framework..."));
    await userEvent.click(screen.getByText("Vue"));
    // Base UI passes the value as the first argument; extra event details follow
    expect(onValueChange).toHaveBeenCalledWith("vue", expect.anything());
  });

  it("toggle button opens the dropdown as well", async () => {
    render(<Fixture />);
    const toggleBtn = screen.getByRole("button", {
      name: "Toggle suggestions",
    });
    await userEvent.click(toggleBtn);
    expect(screen.getByText("React")).toBeInTheDocument();
  });
});
