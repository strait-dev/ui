import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "./autocomplete";

beforeAll(() => {
  // jsdom lacks ResizeObserver (used by Base UI popup positioning).
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  // jsdom lacks matchMedia (used by Base UI internals).
  window.matchMedia ||= (q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  });
  // jsdom lacks scrollIntoView (used when highlighting items).
  Element.prototype.scrollIntoView ||= () => {};
  // jsdom lacks getAnimations (used by Base UI ScrollArea viewport).
  Element.prototype.getAnimations ||= () => [];
});

const FRUITS = ["Apple", "Banana", "Cherry"];

function Fixture(
  props: Partial<React.ComponentProps<typeof AutocompleteInput>> = {}
) {
  return (
    <Autocomplete items={FRUITS}>
      <AutocompleteInput placeholder="Search fruits…" {...props} />
      <AutocompleteContent>
        <AutocompleteEmpty>No fruits found.</AutocompleteEmpty>
        <AutocompleteList>
          {(item: string) => (
            <AutocompleteItem key={item} value={item}>
              {item}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}

describe("Autocomplete", () => {
  it("renders the input with data-slot='autocomplete-input'", () => {
    render(<Fixture />);
    const input = screen.getByPlaceholderText("Search fruits…");
    expect(input).toHaveAttribute("data-slot", "autocomplete-input");
  });

  it("applies the size variant to the input", () => {
    render(<Fixture size="sm" />);
    expect(screen.getByPlaceholderText("Search fruits…")).toHaveClass("h-7");
  });

  it("merges a custom className onto the input", () => {
    render(<Fixture className="custom-class" />);
    expect(screen.getByPlaceholderText("Search fruits…")).toHaveClass(
      "custom-class"
    );
  });

  it("disables the input when disabled", () => {
    render(<Fixture disabled />);
    expect(screen.getByPlaceholderText("Search fruits…")).toBeDisabled();
  });

  it("renders the trigger button when showTrigger is set", () => {
    render(<Fixture showTrigger />);
    expect(
      document.querySelector("[data-slot='autocomplete-trigger']")
    ).toBeInTheDocument();
  });

  it("gives the trigger button an accessible name", () => {
    render(<Fixture showTrigger />);
    expect(
      screen.getByRole("button", { name: "Show options" })
    ).toBeInTheDocument();
  });

  it("renders the clear button once the field has a value", async () => {
    const user = userEvent.setup();
    render(<Fixture showClear />);
    expect(
      document.querySelector("[data-slot='autocomplete-clear']")
    ).not.toBeInTheDocument();
    await user.type(screen.getByPlaceholderText("Search fruits…"), "Ap");
    await waitFor(() => {
      expect(
        document.querySelector("[data-slot='autocomplete-clear']")
      ).toBeInTheDocument();
    });
  });

  it("filters the list as the user types", async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    const input = screen.getByPlaceholderText("Search fruits…");
    await user.type(input, "Ban");
    await waitFor(() => {
      expect(screen.getByText("Banana")).toBeInTheDocument();
    });
    expect(screen.queryByText("Cherry")).not.toBeInTheDocument();
  });
});
