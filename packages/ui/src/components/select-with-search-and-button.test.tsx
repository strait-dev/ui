import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { SelectWithSearchAndButton } from "./select-with-search-and-button";

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
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

describe("SelectWithSearchAndButton", () => {
  it("renders with data-slot='select-with-search-and-button'", () => {
    const { container } = render(
      <SelectWithSearchAndButton options={OPTIONS} />
    );
    expect(
      container.querySelector("[data-slot='select-with-search-and-button']")
    ).toBeInTheDocument();
  });

  it("shows default placeholder text", () => {
    render(<SelectWithSearchAndButton options={OPTIONS} />);
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("shows custom placeholder", () => {
    render(
      <SelectWithSearchAndButton
        options={OPTIONS}
        placeholder="Choose a framework"
      />
    );
    expect(screen.getByText("Choose a framework")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<SelectWithSearchAndButton label="Framework" options={OPTIONS} />);
    expect(screen.getByText("Framework")).toBeInTheDocument();
  });

  it("renders required asterisk when required is true", () => {
    render(
      <SelectWithSearchAndButton label="Framework" options={OPTIONS} required />
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("shows selected option label when value is set", () => {
    render(<SelectWithSearchAndButton options={OPTIONS} value="vue" />);
    expect(screen.getByText("Vue")).toBeInTheDocument();
  });

  it("opens popover and shows options when trigger is clicked", async () => {
    render(<SelectWithSearchAndButton options={OPTIONS} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    expect(await screen.findByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.getByText("Svelte")).toBeInTheDocument();
  });

  it("shows search input when open", async () => {
    render(<SelectWithSearchAndButton options={OPTIONS} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("calls onValueChange when option is selected", async () => {
    const onValueChange = vi.fn();
    render(
      <SelectWithSearchAndButton
        onValueChange={onValueChange}
        options={OPTIONS}
      />
    );
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    const reactOption = await screen.findByRole("option", { name: /react/i });
    await userEvent.click(reactOption);
    expect(onValueChange).toHaveBeenCalledWith("react");
  });

  it("deselects when selecting the already-selected value", async () => {
    const onValueChange = vi.fn();
    render(
      <SelectWithSearchAndButton
        onValueChange={onValueChange}
        options={OPTIONS}
        value="react"
      />
    );
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    // Use the role="option" to select the list item, not the trigger text
    const reactOption = await screen.findByRole("option", { name: /react/i });
    await userEvent.click(reactOption);
    expect(onValueChange).toHaveBeenCalledWith("");
  });

  it("renders action button when onButtonClick is provided", async () => {
    const onButtonClick = vi.fn();
    render(
      <SelectWithSearchAndButton
        buttonText="Create new"
        onButtonClick={onButtonClick}
        options={OPTIONS}
      />
    );
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    expect(await screen.findByText("Create new")).toBeInTheDocument();
  });

  it("calls onButtonClick when action button is clicked", async () => {
    const onButtonClick = vi.fn();
    render(
      <SelectWithSearchAndButton
        buttonText="Add new"
        onButtonClick={onButtonClick}
        options={OPTIONS}
      />
    );
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    const addBtn = await screen.findByText("Add new");
    await userEvent.click(addBtn);
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });

  it("renders disabled trigger when disabled is true", () => {
    render(<SelectWithSearchAndButton disabled options={OPTIONS} />);
    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();
  });

  it("shows no results text when options list is empty", async () => {
    render(<SelectWithSearchAndButton options={[]} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    expect(await screen.findByText("No results found.")).toBeInTheDocument();
  });
});
