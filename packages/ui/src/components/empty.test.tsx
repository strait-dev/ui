import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";

describe("Empty", () => {
  it("renders root with data-slot empty", () => {
    render(<Empty>placeholder</Empty>);
    const root = screen.getByText("placeholder").closest("[data-slot=empty]");
    expect(root).toHaveAttribute("data-slot", "empty");
  });

  it("renders all parts with correct data-slots", () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia>icon</EmptyMedia>
          <EmptyTitle>No items</EmptyTitle>
          <EmptyDescription>Add one to get started.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button type="button">Add item</button>
        </EmptyContent>
      </Empty>
    );
    expect(screen.getByText("No items")).toHaveAttribute(
      "data-slot",
      "empty-title"
    );
    expect(screen.getByText("Add one to get started.")).toHaveAttribute(
      "data-slot",
      "empty-description"
    );
    expect(
      screen.getByText("Add item").closest("[data-slot=empty-content]")
    ).toHaveAttribute("data-slot", "empty-content");
  });

  it("EmptyMedia defaults to variant default", () => {
    render(<EmptyMedia>img</EmptyMedia>);
    const media = screen.getByText("img").closest("[data-slot=empty-icon]");
    expect(media).toHaveAttribute("data-variant", "default");
  });

  it("EmptyMedia applies icon variant", () => {
    render(<EmptyMedia variant="icon">svg</EmptyMedia>);
    const media = screen.getByText("svg").closest("[data-slot=empty-icon]");
    expect(media).toHaveAttribute("data-variant", "icon");
    expect(media).toHaveClass("bg-muted");
  });

  it("EmptyHeader has data-slot empty-header", () => {
    render(<EmptyHeader>header content</EmptyHeader>);
    const header = screen
      .getByText("header content")
      .closest("[data-slot=empty-header]");
    expect(header).toHaveAttribute("data-slot", "empty-header");
  });
});
