import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { SelectWithSearch } from "./select-with-search";

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ||= () => {};
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
});

const OPTIONS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

describe("SelectWithSearch", () => {
  it("renders with data-slot='select-with-search'", () => {
    const { container } = render(<SelectWithSearch options={OPTIONS} />);
    expect(
      container.querySelector("[data-slot='select-with-search']")
    ).toBeInTheDocument();
  });

  it("shows placeholder text by default", () => {
    render(<SelectWithSearch options={OPTIONS} placeholder="Pick a fruit" />);
    expect(screen.getByText("Pick a fruit")).toBeInTheDocument();
  });

  it("shows default placeholder when none specified", () => {
    render(<SelectWithSearch options={OPTIONS} />);
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<SelectWithSearch label="Fruit" options={OPTIONS} />);
    expect(screen.getByText("Fruit")).toBeInTheDocument();
  });

  it("renders required asterisk when required is true", () => {
    render(<SelectWithSearch label="Fruit" options={OPTIONS} required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders the trigger button", () => {
    render(<SelectWithSearch options={OPTIONS} />);
    // The trigger is a button (aria-expanded)
    const trigger = screen.getByRole("button");
    expect(trigger).toBeInTheDocument();
  });

  it("shows selected value label when value is set", () => {
    render(<SelectWithSearch options={OPTIONS} value="banana" />);
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("opens popover when trigger is clicked", async () => {
    render(<SelectWithSearch options={OPTIONS} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("calls onSearchChange when user types in search input", async () => {
    const onSearchChange = vi.fn();
    render(
      <SelectWithSearch onSearchChange={onSearchChange} options={OPTIONS} />
    );
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    const input = screen.getByPlaceholderText("Search...");
    await userEvent.type(input, "app");
    expect(onSearchChange).toHaveBeenCalled();
  });

  it("renders trigger button with aria-expanded false when closed", () => {
    render(<SelectWithSearch options={OPTIONS} />);
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("calls onOpenChange when popover opens", async () => {
    const onOpenChange = vi.fn();
    render(<SelectWithSearch onOpenChange={onOpenChange} options={OPTIONS} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("shows 'No results found.' when options array is empty", async () => {
    render(<SelectWithSearch options={[]} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    expect(await screen.findByText("No results found.")).toBeInTheDocument();
  });

  it("shows custom noResultsText when options empty", async () => {
    render(<SelectWithSearch noResultsText="Nothing here" options={[]} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    expect(await screen.findByText("Nothing here")).toBeInTheDocument();
  });

  it("does not render trigger as disabled when disabled is false", () => {
    render(<SelectWithSearch disabled={false} options={OPTIONS} />);
    const trigger = screen.getByRole("button");
    expect(trigger).not.toBeDisabled();
  });

  it("renders trigger as disabled when disabled is true", () => {
    render(<SelectWithSearch disabled options={OPTIONS} />);
    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();
  });
});
