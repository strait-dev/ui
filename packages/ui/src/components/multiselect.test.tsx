import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import MultipleSelector from "./multiselect";

// MultipleSelector is built on cmdk which requires ResizeObserver and
// scrollIntoView. jsdom does not provide either, so we polyfill both.
beforeAll(() => {
  if (typeof window.ResizeObserver === "undefined") {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = vi.fn();
  }
});

const OPTIONS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular" },
];

describe("MultipleSelector", () => {
  it("renders the input with placeholder when nothing is selected", () => {
    render(
      <MultipleSelector options={OPTIONS} placeholder="Select frameworks..." />
    );
    expect(
      screen.getByPlaceholderText("Select frameworks...")
    ).toBeInTheDocument();
  });

  it("opens the dropdown and shows all options when the input is focused", async () => {
    render(
      <MultipleSelector options={OPTIONS} placeholder="Select frameworks..." />
    );
    const input = screen.getByPlaceholderText("Select frameworks...");
    await userEvent.click(input);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.getByText("Svelte")).toBeInTheDocument();
  });

  it("adds a selected badge after clicking an option", async () => {
    render(
      <MultipleSelector options={OPTIONS} placeholder="Select frameworks..." />
    );
    const input = screen.getByPlaceholderText("Select frameworks...");
    await userEvent.click(input);
    await userEvent.click(screen.getByText("React"));
    // The selected option appears as a badge chip
    const badges = screen.getAllByText("React");
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it("calls onChange with the newly selected option array", async () => {
    const onChange = vi.fn();
    render(
      <MultipleSelector
        onChange={onChange}
        options={OPTIONS}
        placeholder="Select frameworks..."
      />
    );
    const input = screen.getByPlaceholderText("Select frameworks...");
    await userEvent.click(input);
    await userEvent.click(screen.getByText("Vue"));
    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ value: "vue" }),
    ]);
  });

  it("removes a selected chip via its remove button", async () => {
    const onChange = vi.fn();
    render(
      <MultipleSelector
        onChange={onChange}
        options={OPTIONS}
        placeholder="Select frameworks..."
      />
    );
    const input = screen.getByPlaceholderText("Select frameworks...");
    // Select one option
    await userEvent.click(input);
    await userEvent.click(screen.getByText("React"));
    // Remove it via the badge remove button
    const removeBtn = screen.getByRole("button", { name: "Remove" });
    await userEvent.click(removeBtn);
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("filters the dropdown options as the user types", async () => {
    render(
      <MultipleSelector options={OPTIONS} placeholder="Select frameworks..." />
    );
    const input = screen.getByPlaceholderText("Select frameworks...");
    await userEvent.click(input);
    await userEvent.type(input, "vue");
    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });
});
