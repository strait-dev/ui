import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Tree, TreeItem } from "./tree";

beforeAll(() => {
  globalThis.ResizeObserver ||= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.scrollIntoView ||= () => {};
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function FileTree({
  selectionMode = "none" as "none" | "single" | "multiple",
  defaultExpandedKeys,
  onSelectionChange,
}: {
  selectionMode?: "none" | "single" | "multiple";
  defaultExpandedKeys?: Iterable<string>;
  onSelectionChange?: (keys: Set<string> | "all") => void;
}) {
  return (
    <Tree
      aria-label="Files"
      defaultExpandedKeys={defaultExpandedKeys}
      onSelectionChange={
        onSelectionChange as ((keys: unknown) => void) | undefined
      }
      selectionMode={selectionMode}
    >
      <TreeItem id="docs" title="Documents">
        <TreeItem id="resume" title="resume.pdf" />
        <TreeItem id="cover" title="cover-letter.pdf" />
      </TreeItem>
      <TreeItem id="pics" title="Pictures" />
    </Tree>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Tree", () => {
  it("renders with the required aria-label", () => {
    render(<FileTree />);
    const tree = document.querySelector("[data-slot='tree']");
    expect(tree).toBeInTheDocument();
    expect(tree).toHaveAttribute("aria-label", "Files");
  });

  it("renders top-level items with data-slot='tree-item'", () => {
    render(<FileTree />);
    const items = document.querySelectorAll("[data-slot='tree-item']");
    // Documents + Pictures (children hidden until expanded)
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  it("renders visible text for top-level nodes", () => {
    render(<FileTree />);
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Pictures")).toBeInTheDocument();
  });

  it("does not render nested children when parent is collapsed", () => {
    render(<FileTree />);
    expect(screen.queryByText("resume.pdf")).not.toBeInTheDocument();
  });

  it("renders nested children when parent is expanded via defaultExpandedKeys", () => {
    render(<FileTree defaultExpandedKeys={["docs"]} />);
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
    expect(screen.getByText("cover-letter.pdf")).toBeInTheDocument();
  });

  it("calls onSelectionChange when a row is selected in single mode", async () => {
    const handler = vi.fn();
    render(
      <FileTree
        defaultExpandedKeys={["docs"]}
        onSelectionChange={handler}
        selectionMode="single"
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByText("Pictures"));
    expect(handler).toHaveBeenCalled();
  });

  it("forwards a custom className to the tree root", () => {
    render(
      <Tree aria-label="Custom" className="my-custom-class">
        <TreeItem id="a" title="Alpha" />
      </Tree>
    );
    const tree = document.querySelector("[data-slot='tree']");
    expect(tree?.className).toContain("my-custom-class");
  });

  it("renders row roles for items (RAC treegrid pattern)", () => {
    render(<FileTree />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });

  it("expands a collapsed parent on click", async () => {
    render(<FileTree />);
    const user = userEvent.setup();
    expect(screen.queryByText("resume.pdf")).not.toBeInTheDocument();
    // Click the chevron button (slot=chevron) inside the Documents row
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]!);
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
  });
});
