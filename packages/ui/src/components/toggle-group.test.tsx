import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

describe("ToggleGroup", () => {
  it("renders a group with the toggle-group data-slot", () => {
    render(
      <ToggleGroup aria-label="Alignment">
        <ToggleGroupItem aria-label="Left" value="left">
          L
        </ToggleGroupItem>
      </ToggleGroup>
    );
    const group = screen.getByRole("group", { name: "Alignment" });
    expect(group).toHaveAttribute("data-slot", "toggle-group");
  });

  it("renders items with the toggle-group-item data-slot", () => {
    render(
      <ToggleGroup aria-label="Alignment">
        <ToggleGroupItem aria-label="Left" value="left">
          L
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Center" value="center">
          C
        </ToggleGroupItem>
      </ToggleGroup>
    );
    const items = screen.getAllByRole("button");
    for (const item of items) {
      expect(item).toHaveAttribute("data-slot", "toggle-group-item");
    }
  });

  it("calls onValueChange with selected value in single mode", async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup aria-label="Alignment" onValueChange={onValueChange}>
        <ToggleGroupItem aria-label="Left" value="left">
          L
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Center" value="center">
          C
        </ToggleGroupItem>
      </ToggleGroup>
    );
    await userEvent.click(screen.getByRole("button", { name: "Left" }));
    expect(onValueChange).toHaveBeenCalledWith(["left"], expect.anything());
  });

  it("calls onValueChange each time an item is toggled", async () => {
    const onValueChange = vi.fn();
    render(
      <ToggleGroup aria-label="Formatting" onValueChange={onValueChange}>
        <ToggleGroupItem aria-label="Bold" value="bold">
          B
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Italic" value="italic">
          I
        </ToggleGroupItem>
      </ToggleGroup>
    );
    await userEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(onValueChange).toHaveBeenNthCalledWith(
      1,
      ["bold"],
      expect.anything()
    );
    await userEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(onValueChange).toHaveBeenCalledTimes(2);
  });

  it("reflects emphasis and size on the group data attributes", () => {
    render(
      <ToggleGroup aria-label="Alignment" emphasis="outline" size="sm">
        <ToggleGroupItem aria-label="Left" value="left">
          L
        </ToggleGroupItem>
      </ToggleGroup>
    );
    const group = screen.getByRole("group", { name: "Alignment" });
    expect(group).toHaveAttribute("data-emphasis", "outline");
    expect(group).toHaveAttribute("data-size", "sm");
  });

  it("reflects spacing on the data-spacing attribute", () => {
    render(
      <ToggleGroup aria-label="Actions" spacing={4}>
        <ToggleGroupItem aria-label="A" value="a">
          A
        </ToggleGroupItem>
      </ToggleGroup>
    );
    const group = screen.getByRole("group", { name: "Actions" });
    expect(group).toHaveAttribute("data-spacing", "4");
  });

  /* ------------------------------------------------------------------ */
  /* xs / xl size forwarding                                             */
  /* ------------------------------------------------------------------ */

  it("reflects size=xs on the group data-size attribute", () => {
    render(
      <ToggleGroup aria-label="Tiny" size="xs">
        <ToggleGroupItem aria-label="A" value="a">
          A
        </ToggleGroupItem>
      </ToggleGroup>
    );
    expect(screen.getByRole("group", { name: "Tiny" })).toHaveAttribute(
      "data-size",
      "xs"
    );
  });

  it("reflects size=xl on the group data-size attribute", () => {
    render(
      <ToggleGroup aria-label="Huge" size="xl">
        <ToggleGroupItem aria-label="A" value="a">
          A
        </ToggleGroupItem>
      </ToggleGroup>
    );
    expect(screen.getByRole("group", { name: "Huge" })).toHaveAttribute(
      "data-size",
      "xl"
    );
  });

  /* ------------------------------------------------------------------ */
  /* Variant forwarding                                                  */
  /* ------------------------------------------------------------------ */

  it("reflects variant on the group data-variant attribute", () => {
    render(
      <ToggleGroup aria-label="Danger" variant="destructive">
        <ToggleGroupItem aria-label="Delete" value="delete">
          D
        </ToggleGroupItem>
      </ToggleGroup>
    );
    expect(screen.getByRole("group", { name: "Danger" })).toHaveAttribute(
      "data-variant",
      "destructive"
    );
  });

  it("cascades variant to ToggleGroupItem via data-variant", () => {
    render(
      <ToggleGroup aria-label="Status" variant="success">
        <ToggleGroupItem aria-label="Approve" value="approve">
          OK
        </ToggleGroupItem>
      </ToggleGroup>
    );
    const item = screen.getByRole("button", { name: "Approve" });
    expect(item).toHaveAttribute("data-variant", "success");
  });
});
