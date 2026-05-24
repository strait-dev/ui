import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Rating } from "./rating";

describe("Rating", () => {
  it("renders the rating root with data-slot='rating'", () => {
    const { container } = render(<Rating aria-label="Rate this" />);
    expect(container.querySelector("[data-slot='rating']")).toBeInTheDocument();
  });

  it("renders the correct number of stars via max prop", () => {
    const { container } = render(<Rating aria-label="Rate this" max={7} />);
    expect(
      container.querySelectorAll("[data-slot='rating-star']")
    ).toHaveLength(7);
  });

  it("defaults to rendering 5 stars when max is not specified", () => {
    const { container } = render(<Rating aria-label="Rate this" />);
    expect(
      container.querySelectorAll("[data-slot='rating-star']")
    ).toHaveLength(5);
  });

  it("clicking a star calls onValueChange with the correct star number", async () => {
    const onValueChange = vi.fn();
    render(
      <Rating aria-label="Rate this" max={5} onValueChange={onValueChange} />
    );
    const radios = screen.getAllByRole("radio");
    // Click the third star (index 2 → value 3)
    await userEvent.click(radios[2]!);
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it("controlled value reflects correct checked state on radio inputs", () => {
    render(<Rating aria-label="Rate this" max={5} value={2} />);
    const radios = screen.getAllByRole("radio");
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });

  it("uncontrolled defaultValue shows the correct star as checked", () => {
    render(<Rating aria-label="Rate this" defaultValue={4} max={5} />);
    const radios = screen.getAllByRole("radio");
    expect(radios[3]).toBeChecked();
    expect(radios[4]).not.toBeChecked();
  });

  it("readOnly renders no interactive radio inputs and uses role='img'", () => {
    render(<Rating aria-label="Rated 3 out of 5" max={5} readOnly value={3} />);
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
    expect(
      screen.getByRole("img", { name: "Rated 3 out of 5" })
    ).toBeInTheDocument();
  });

  it("disabled renders no interactive radio inputs", () => {
    render(<Rating aria-label="Rating" disabled max={5} value={2} />);
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });

  it("ArrowRight key increments the value and calls onValueChange", async () => {
    const onValueChange = vi.fn();
    render(
      <Rating
        aria-label="Rate this"
        defaultValue={2}
        max={5}
        onValueChange={onValueChange}
      />
    );
    const root = screen.getByRole("radiogroup", { name: "Rate this" });
    root.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it("ArrowLeft key decrements the value and calls onValueChange", async () => {
    const onValueChange = vi.fn();
    render(
      <Rating
        aria-label="Rate this"
        defaultValue={4}
        max={5}
        onValueChange={onValueChange}
      />
    );
    const root = screen.getByRole("radiogroup", { name: "Rate this" });
    root.focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it("Home key sets value to 1 and End key sets value to max", async () => {
    const onValueChange = vi.fn();
    render(
      <Rating
        aria-label="Rate this"
        defaultValue={3}
        max={5}
        onValueChange={onValueChange}
      />
    );
    const root = screen.getByRole("radiogroup", { name: "Rate this" });
    root.focus();
    await userEvent.keyboard("{Home}");
    expect(onValueChange).toHaveBeenCalledWith(1);

    onValueChange.mockClear();
    await userEvent.keyboard("{End}");
    expect(onValueChange).toHaveBeenCalledWith(5);
  });
});
