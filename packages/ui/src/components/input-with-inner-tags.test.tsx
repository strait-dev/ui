import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InputWithInnerTags, type Tag } from "./input-with-inner-tags";

describe("InputWithInnerTags", () => {
  it("renders the container with data-slot='input-with-inner-tags'", () => {
    render(<InputWithInnerTags onTagsChange={vi.fn()} tags={[]} />);
    expect(
      document.querySelector("[data-slot='input-with-inner-tags']")
    ).toBeInTheDocument();
  });

  it("renders existing tags", () => {
    const tags: Tag[] = [
      { id: "1", text: "React" },
      { id: "2", text: "TypeScript" },
    ];
    render(<InputWithInnerTags onTagsChange={vi.fn()} tags={tags} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders the default placeholder", () => {
    render(<InputWithInnerTags onTagsChange={vi.fn()} tags={[]} />);
    expect(screen.getByPlaceholderText("Add a tag")).toBeInTheDocument();
  });

  it("gives the add-tag button an accessible name once typing begins", async () => {
    render(<InputWithInnerTags onTagsChange={vi.fn()} tags={[]} />);
    expect(
      screen.queryByRole("button", { name: "Add tag" })
    ).not.toBeInTheDocument();
    await userEvent.type(screen.getByPlaceholderText("Add a tag"), "React");
    expect(screen.getByRole("button", { name: "Add tag" })).toBeInTheDocument();
  });

  it("renders a custom placeholder", () => {
    render(
      <InputWithInnerTags
        onTagsChange={vi.fn()}
        placeholder="Add a skill…"
        tags={[]}
      />
    );
    expect(screen.getByPlaceholderText("Add a skill…")).toBeInTheDocument();
  });

  it("calls onTagsChange with the new tag when add button is clicked", async () => {
    const onTagsChange = vi.fn();
    render(<InputWithInnerTags onTagsChange={onTagsChange} tags={[]} />);
    const input = screen.getByPlaceholderText("Add a tag");
    await userEvent.type(input, "Vue");
    const addBtn = screen.getByRole("button");
    await userEvent.click(addBtn);
    expect(onTagsChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ text: "Vue" })])
    );
  });

  it("calls onTagsChange without the removed tag when remove is clicked", async () => {
    const onTagsChange = vi.fn();
    const tags: Tag[] = [{ id: "1", text: "React" }];
    render(<InputWithInnerTags onTagsChange={onTagsChange} tags={tags} />);
    await userEvent.click(screen.getByRole("button", { name: "Remove React" }));
    expect(onTagsChange).toHaveBeenCalledWith([]);
  });

  it("disables inputs and remove buttons when disabled", () => {
    const tags: Tag[] = [{ id: "1", text: "React" }];
    render(<InputWithInnerTags disabled onTagsChange={vi.fn()} tags={tags} />);
    expect(screen.getByPlaceholderText("Add a tag")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Remove React" })).toBeDisabled();
  });

  it("does not add a duplicate tag", async () => {
    const onTagsChange = vi.fn();
    const tags: Tag[] = [{ id: "1", text: "React" }];
    render(<InputWithInnerTags onTagsChange={onTagsChange} tags={tags} />);
    const input = screen.getByPlaceholderText("Add a tag");
    await userEvent.type(input, "React");
    const addBtns = screen.getAllByRole("button");
    // find the add button (not the remove button)
    const addBtn = addBtns.find((b) => !b.getAttribute("aria-label"));
    if (addBtn) {
      await userEvent.click(addBtn);
    }
    expect(onTagsChange).not.toHaveBeenCalled();
  });
});
