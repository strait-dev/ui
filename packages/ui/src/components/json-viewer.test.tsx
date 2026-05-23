import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { JsonViewer } from "./json-viewer";

describe("JsonViewer", () => {
  it("renders with data-slot='json-viewer'", () => {
    render(<JsonViewer data={null} />);
    expect(
      document.querySelector("[data-slot='json-viewer']")
    ).toBeInTheDocument();
  });

  it("renders a primitive number", () => {
    render(<JsonViewer data={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders a primitive null", () => {
    render(<JsonViewer data={null} />);
    expect(screen.getByText("null")).toBeInTheDocument();
  });

  it("renders a primitive boolean false", () => {
    render(<JsonViewer data={false} />);
    expect(screen.getByText("false")).toBeInTheDocument();
  });

  it("renders a string value with surrounding quotes", () => {
    render(<JsonViewer data="hello world" />);
    // Rendered via &quot; entities, text content should include the value
    const viewer = document.querySelector("[data-slot='json-viewer']");
    expect(viewer?.textContent).toContain("hello world");
    // The string should be wrapped in quote punctuation
    const successSpan = viewer?.querySelector(".text-success-accent");
    expect(successSpan?.textContent).toContain("hello world");
  });

  it("renders object keys for a nested object", () => {
    render(
      <JsonViewer data={{ name: "Alice", age: 30 }} defaultExpanded={2} />
    );
    // Keys should be visible
    const viewer = document.querySelector("[data-slot='json-viewer']");
    expect(viewer?.textContent).toContain("name");
    expect(viewer?.textContent).toContain("Alice");
    expect(viewer?.textContent).toContain("age");
    expect(viewer?.textContent).toContain("30");
  });

  it("shows collapse/expand buttons for objects", () => {
    render(<JsonViewer data={{ key: "value" }} />);
    // Root object should have a toggle button
    expect(
      screen.getAllByRole("button", { name: /collapse|expand/i }).length
    ).toBeGreaterThan(0);
  });

  it("collapses an expanded node when toggle is clicked", async () => {
    render(<JsonViewer data={{ inner: { x: 1 } }} defaultExpanded={true} />);
    // All should be expanded initially; find the root expand button
    const collapseButtons = screen.getAllByRole("button", {
      name: "Collapse",
    });
    // Click the root collapse button
    await userEvent.click(collapseButtons[0]);
    // After collapsing root, the summary text should appear (singular or plural)
    const viewer = document.querySelector("[data-slot='json-viewer']");
    expect(viewer?.textContent).toMatch(/key|keys/);
  });

  it("expands a collapsed node when toggle is clicked", async () => {
    render(<JsonViewer data={{ name: "Bob" }} defaultExpanded={false} />);
    // Starts collapsed - content is not visible
    const viewer = document.querySelector("[data-slot='json-viewer']");
    expect(viewer?.textContent).not.toContain("Bob");

    const expandBtn = screen.getByRole("button", { name: "Expand" });
    await userEvent.click(expandBtn);
    // Now content should be visible
    expect(viewer?.textContent).toContain("Bob");
  });

  it("renders copy button when copyable is true", () => {
    render(<JsonViewer copyable data={{ x: 1 }} />);
    expect(
      document.querySelector("[data-slot='copy-button']")
    ).toBeInTheDocument();
  });

  it("does not render copy button when copyable is false (default)", () => {
    render(<JsonViewer data={{ x: 1 }} />);
    expect(
      document.querySelector("[data-slot='copy-button']")
    ).not.toBeInTheDocument();
  });

  it("renders arrays correctly", () => {
    render(<JsonViewer data={[1, 2, 3]} defaultExpanded={true} />);
    const viewer = document.querySelector("[data-slot='json-viewer']");
    expect(viewer?.textContent).toContain("1");
    expect(viewer?.textContent).toContain("2");
    expect(viewer?.textContent).toContain("3");
  });

  it("renders empty object without crashing", () => {
    render(<JsonViewer data={{}} />);
    const viewer = document.querySelector("[data-slot='json-viewer']");
    expect(viewer).toBeInTheDocument();
    expect(viewer?.textContent).toContain("{");
  });

  it("renders empty array without crashing", () => {
    render(<JsonViewer data={[]} />);
    const viewer = document.querySelector("[data-slot='json-viewer']");
    expect(viewer).toBeInTheDocument();
    expect(viewer?.textContent).toContain("[");
  });

  it("renders rootLabel when provided", () => {
    render(<JsonViewer data={{ a: 1 }} rootLabel="myVar" />);
    expect(screen.getByText("myVar")).toBeInTheDocument();
  });
});
