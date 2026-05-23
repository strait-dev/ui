import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChartEmptyState } from "./chart-empty-state";

describe("ChartEmptyState", () => {
  it("renders the required message", () => {
    render(<ChartEmptyState message="No data available." />);
    expect(screen.getByText("No data available.")).toBeInTheDocument();
  });

  it("renders the title when provided", () => {
    render(<ChartEmptyState message="No data." title="Nothing to display" />);
    expect(screen.getByText("Nothing to display")).toBeInTheDocument();
  });

  it("does not render a title element when title is omitted", () => {
    const { container } = render(<ChartEmptyState message="No data." />);
    // There should only be one <p> — the message — not two.
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it("renders the action node when provided", () => {
    render(
      <ChartEmptyState
        action={<button type="button">Add data source</button>}
        message="No data."
      />
    );
    expect(
      screen.getByRole("button", { name: "Add data source" })
    ).toBeInTheDocument();
  });

  it("does not render an action when omitted", () => {
    render(<ChartEmptyState message="No data." />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it('has data-slot="chart-empty-state" on the root element', () => {
    const { container } = render(<ChartEmptyState message="No data." />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("data-slot", "chart-empty-state");
  });

  it("renders the default icon when no icon prop is passed", () => {
    const { container } = render(<ChartEmptyState message="No data." />);
    // HugeiconsIcon renders an <svg>; verify at least one is present in the tree.
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("merges a custom className onto the root element", () => {
    const { container } = render(
      <ChartEmptyState className="my-custom-class" message="No data." />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("my-custom-class");
  });

  // --- size axis ---

  it("default size sets data-size='default' on the root element", () => {
    const { container } = render(<ChartEmptyState message="No data." />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("data-size", "default");
  });

  it("size='sm' sets data-size='sm' on the root element", () => {
    const { container } = render(
      <ChartEmptyState message="No data." size="sm" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("data-size", "sm");
  });

  it("size='lg' sets data-size='lg' on the root element", () => {
    const { container } = render(
      <ChartEmptyState message="No data." size="lg" />
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("data-size", "lg");
  });

  it("size='sm' uses a smaller icon tile (size-7)", () => {
    const { container } = render(
      <ChartEmptyState message="No data." size="sm" />
    );
    const tile = container.querySelector(".size-7");
    expect(tile).toBeInTheDocument();
  });

  it("size='lg' uses a larger icon tile (size-14)", () => {
    const { container } = render(
      <ChartEmptyState message="No data." size="lg" />
    );
    const tile = container.querySelector(".size-14");
    expect(tile).toBeInTheDocument();
  });

  it("default size uses size-10 icon tile", () => {
    const { container } = render(<ChartEmptyState message="No data." />);
    const tile = container.querySelector(".size-10");
    expect(tile).toBeInTheDocument();
  });
});
