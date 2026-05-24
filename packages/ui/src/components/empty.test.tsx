import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  emptyMediaVariants,
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

// ---------------------------------------------------------------------------
// border prop
// ---------------------------------------------------------------------------

describe("Empty border prop", () => {
  it("applies border border-dashed by default", () => {
    render(<Empty>content</Empty>);
    const root = screen.getByText("content").closest("[data-slot=empty]");
    expect(root).toHaveClass("border");
    expect(root).toHaveClass("border-dashed");
  });

  it("applies border border-dashed when border={true}", () => {
    render(<Empty border={true}>content</Empty>);
    const root = screen.getByText("content").closest("[data-slot=empty]");
    expect(root).toHaveClass("border");
    expect(root).toHaveClass("border-dashed");
  });

  it("omits border classes when border={false}", () => {
    render(<Empty border={false}>content</Empty>);
    const root = screen.getByText("content").closest("[data-slot=empty]");
    expect(root).not.toHaveClass("border");
    expect(root).not.toHaveClass("border-dashed");
  });
});

// ---------------------------------------------------------------------------
// EmptyMedia size axis
// ---------------------------------------------------------------------------

describe("EmptyMedia size axis", () => {
  it("sm size applies size-6 box class on icon variant", () => {
    render(
      <EmptyMedia size="sm" variant="icon">
        content
      </EmptyMedia>
    );
    const media = screen.getByText("content").closest("[data-slot=empty-icon]");
    expect(media).toHaveAttribute("data-size", "sm");
    expect(media).toHaveClass("size-6");
  });

  it("default size applies size-8 box class on icon variant", () => {
    render(
      <EmptyMedia size="default" variant="icon">
        content
      </EmptyMedia>
    );
    const media = screen.getByText("content").closest("[data-slot=empty-icon]");
    expect(media).toHaveClass("size-8");
  });

  it("lg size applies size-12 box class on icon variant", () => {
    render(
      <EmptyMedia size="lg" variant="icon">
        content
      </EmptyMedia>
    );
    const media = screen.getByText("content").closest("[data-slot=empty-icon]");
    expect(media).toHaveAttribute("data-size", "lg");
    expect(media).toHaveClass("size-12");
  });

  it("size does not apply fixed box class on default variant", () => {
    // variant=default → no compound variant fires for size, so no size-* class
    const classes = emptyMediaVariants({ variant: "default", size: "lg" });
    expect(classes).not.toContain("size-12");
    expect(classes).not.toContain("size-8");
    expect(classes).not.toContain("size-6");
  });

  it("emptyMediaVariants helper reflects sm icon sizing classes", () => {
    const classes = emptyMediaVariants({ variant: "icon", size: "sm" });
    expect(classes).toContain("size-6");
  });

  it("emptyMediaVariants helper reflects lg icon sizing classes", () => {
    const classes = emptyMediaVariants({ variant: "icon", size: "lg" });
    expect(classes).toContain("size-12");
  });
});

// ---------------------------------------------------------------------------
// EmptyMedia intent axis
// ---------------------------------------------------------------------------

describe("EmptyMedia intent axis", () => {
  it("defaults to muted intent (bg-muted text-foreground) on icon variant", () => {
    render(<EmptyMedia variant="icon">content</EmptyMedia>);
    const media = screen.getByText("content").closest("[data-slot=empty-icon]");
    expect(media).toHaveAttribute("data-intent", "muted");
    expect(media).toHaveClass("bg-muted");
    expect(media).toHaveClass("text-foreground");
  });

  it("info intent applies bg-info/10 and text-info-accent on icon variant", () => {
    render(
      <EmptyMedia intent="info" variant="icon">
        content
      </EmptyMedia>
    );
    const media = screen.getByText("content").closest("[data-slot=empty-icon]");
    expect(media).toHaveAttribute("data-intent", "info");
    expect(media).toHaveClass("bg-info/10");
    expect(media).toHaveClass("text-info-accent");
  });

  it("success intent applies bg-success/10 and text-success-accent on icon variant", () => {
    render(
      <EmptyMedia intent="success" variant="icon">
        content
      </EmptyMedia>
    );
    const media = screen.getByText("content").closest("[data-slot=empty-icon]");
    expect(media).toHaveClass("bg-success/10");
    expect(media).toHaveClass("text-success-accent");
  });

  it("warning intent applies bg-warning/10 and text-warning-accent on icon variant", () => {
    render(
      <EmptyMedia intent="warning" variant="icon">
        content
      </EmptyMedia>
    );
    const media = screen.getByText("content").closest("[data-slot=empty-icon]");
    expect(media).toHaveClass("bg-warning/10");
    expect(media).toHaveClass("text-warning-accent");
  });

  it("destructive intent applies bg-destructive/10 and text-destructive-accent on icon variant", () => {
    render(
      <EmptyMedia intent="destructive" variant="icon">
        content
      </EmptyMedia>
    );
    const media = screen.getByText("content").closest("[data-slot=empty-icon]");
    expect(media).toHaveClass("bg-destructive/10");
    expect(media).toHaveClass("text-destructive-accent");
  });

  it("intent bg does not apply when variant=default", () => {
    // No compound variant fires, so no intent-specific bg class
    const classes = emptyMediaVariants({ variant: "default", intent: "info" });
    expect(classes).not.toContain("bg-info/10");
    expect(classes).not.toContain("bg-muted");
  });

  it("emptyMediaVariants helper reflects warning intent classes", () => {
    const classes = emptyMediaVariants({ variant: "icon", intent: "warning" });
    expect(classes).toContain("bg-warning/10");
    expect(classes).toContain("text-warning-accent");
  });
});
